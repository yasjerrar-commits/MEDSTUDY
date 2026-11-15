import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { neon } from '@neondatabase/serverless';
import { put, get, del } from '@vercel/blob';
import { createServer as createViteServer } from 'vite';

dotenv.config({ path: ['.env.development.local', '.env'] });

const PORT = 3000;
const PROFILE_ID = 'default';
const LEGACY_STORE_FILE = path.resolve(process.cwd(), 'data', 'medstudy-store.json');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL manquant : connectez l’intégration Neon.');
}
const sql = neon(process.env.DATABASE_URL);

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS medstudy_state (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      version BIGINT NOT NULL DEFAULT 1,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

function getDefaultState() {
  return {
    preferences: {
      studentName: 'Étudiant(e) en 1ère Année',
      theme: 'light',
      readerFontSize: 'md',
      dailyGoalMinutes: 60,
      dailyGoalQcms: 20,
    },
    completedLessonIds: [],
    bookmarkedLessonIds: [],
    recentlyStudiedLessons: [],
    studySecondsByModule: {
      anatomie: 0,
      biophysique: 0,
      biochimie: 0,
      biologie: 0,
      'sante-publique': 0,
      terminologie: 0,
      personnalise: 0,
    },
    qcmAttempts: [],
    favoriteQcmIds: [],
    wrongQcmCounts: {},
    flashcardProgress: {},
    notes: [],
    highlights: [],
    uploadedCourses: [],
    customModule: {
      title: 'Module Personnalisable',
      subtitle: 'Votre espace d’étude sur mesure',
      description:
        'Renommez ce module selon votre matière (Embryologie, Histologie, Biologie cellulaire...) et importez vos propres cours, PDF et fiches.',
      accentColor: 'teal',
      chapters: [],
      flashcards: [],
      qcms: [],
    },
    importedQcms: [],
    importedFlashcards: [],
    dailyActivity: {},
  };
}

function mergeState(parsed: Record<string, any>) {
  const def = getDefaultState();
  return {
    ...def,
    ...parsed,
    preferences: { ...def.preferences, ...(parsed.preferences || {}) },
    studySecondsByModule: {
      ...def.studySecondsByModule,
      ...(parsed.studySecondsByModule || {}),
    },
    customModule: {
      ...def.customModule,
      ...(parsed.customModule || {}),
    },
  };
}

function readLegacyFileState(): Record<string, any> | null {
  try {
    if (!fs.existsSync(LEGACY_STORE_FILE)) return null;
    return JSON.parse(fs.readFileSync(LEGACY_STORE_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

async function readStore(): Promise<{ state: Record<string, any>; version: number }> {
  const rows = await sql`SELECT data, version FROM medstudy_state WHERE id = ${PROFILE_ID}`;
  if (rows.length > 0) {
    return { state: mergeState(rows[0].data), version: Number(rows[0].version) };
  }
  const initial = mergeState(readLegacyFileState() || {});
  await sql`
    INSERT INTO medstudy_state (id, data, version)
    VALUES (${PROFILE_ID}, ${JSON.stringify(initial)}::jsonb, 1)
    ON CONFLICT (id) DO NOTHING
  `;
  return { state: initial, version: 1 };
}

async function readVersion(): Promise<number> {
  const rows = await sql`SELECT version FROM medstudy_state WHERE id = ${PROFILE_ID}`;
  return rows.length > 0 ? Number(rows[0].version) : 0;
}

async function writeStore(state: unknown): Promise<{ version: number; updatedAt: string }> {
  const rows = await sql`
    INSERT INTO medstudy_state (id, data, version, updated_at)
    VALUES (${PROFILE_ID}, ${JSON.stringify(state)}::jsonb, 1, now())
    ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data,
          version = medstudy_state.version + 1,
          updated_at = now()
    RETURNING version, updated_at
  `;
  return { version: Number(rows[0].version), updatedAt: new Date(rows[0].updated_at).toISOString() };
}

function sanitizeFileName(originalName: string) {
  const ext = path.extname(originalName).toLowerCase();
  const safeBase = path
    .basename(originalName, ext)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 40);
  return `${Date.now()}_${safeBase}${ext}`;
}

function blobPathFor(storedFileName: string) {
  return `medstudy/uploads/${path.basename(storedFileName)}`;
}

async function readBlobBuffer(storedFileName: string): Promise<Buffer | null> {
  const result = await get(blobPathFor(storedFileName), { access: 'public' });
  if (!result || result.statusCode !== 200) return null;
  return Buffer.from(await new Response(result.stream).arrayBuffer());
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'text/plain',
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Utilisez PDF, PNG, JPG, WEBP ou TXT.'));
    }
  },
});

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Clé API Gemini manquante dans les variables d’environnement.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildSystemInstruction() {
  return `Tu es un professeur agrégé de médecine et pédagogue spécialisé pour les étudiants de 1ère année de médecine francophone.
RÈGLES IMPÉRATIVES :
1. Réponds EXCLUSIVEMENT en français avec une terminologie médicale rigoureuse et exacte.
2. PRIORITÉ ABSOLUE AU SUPPORT FOURNI : Base-toi en priorité absolue sur les informations contenues dans le document ou le texte du cours fourni par l'étudiant. N'invente aucune donnée attribuée au professeur et n'introduis jamais silencieusement de faits contradictoires avec le support.
3. Si tu ajoutes une précision scientifique ou clinique utile qui ne figure pas explicitement dans le document source, sépare-la impérativement dans une section distincte clairement intitulée "### Compléments scientifiques (hors support du professeur)".
4. Adapte la clarté pédagogique à un étudiant de 1ère année.`;
}

async function startServer() {
  await ensureSchema();
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  // Health endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, service: 'MEDSTUDY' });
  });

  // Load persistent state (shared across all devices)
  app.get('/api/state', async (_req: Request, res: Response) => {
    try {
      const { state, version } = await readStore();
      res.setHeader('Cache-Control', 'no-store');
      res.json({ state, version });
    } catch (error) {
      console.error('Erreur lecture état:', error);
      res.status(500).json({ error: 'Impossible de charger la progression.' });
    }
  });

  // Lightweight version check used by devices to detect remote changes
  app.get('/api/state/version', async (_req: Request, res: Response) => {
    try {
      res.setHeader('Cache-Control', 'no-store');
      res.json({ version: await readVersion() });
    } catch (error) {
      console.error('Erreur lecture version:', error);
      res.status(500).json({ error: 'Impossible de vérifier la synchronisation.' });
    }
  });

  // Save persistent state
  app.put('/api/state', async (req: Request, res: Response) => {
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        res.status(400).json({ error: 'Données invalides.' });
        return;
      }
      const { version, updatedAt } = await writeStore(req.body);
      res.json({ ok: true, version, savedAt: updatedAt });
    } catch (error) {
      console.error('Erreur sauvegarde état:', error);
      res.status(500).json({ error: 'Impossible de sauvegarder la progression.' });
    }
  });

  // Upload PDF or image file to Vercel Blob (private)
  app.post('/api/upload', (req: Request, res: Response) => {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        res.status(400).json({ error: err.message || 'Erreur lors du téléversement.' });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: 'Aucun fichier reçu.' });
        return;
      }
      try {
        const blob = await put(blobPathFor(sanitizeFileName(req.file.originalname)), req.file.buffer, {
          access: 'public',
          contentType: req.file.mimetype,
          addRandomSuffix: true,
        });
        const storedFileName = path.basename(blob.pathname);
        res.json({
          storedFileName,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          fileUrl: `/api/files/${encodeURIComponent(storedFileName)}`,
        });
      } catch (uploadError) {
        console.error('Erreur Blob upload:', uploadError);
        res.status(500).json({ error: 'Erreur lors du téléversement du fichier.' });
      }
    });
  });

  // Serve uploaded files from private Blob storage
  app.get('/api/files/:filename', async (req: Request, res: Response) => {
    try {
      const safeName = path.basename(req.params.filename);
      const ifNoneMatch = req.headers['if-none-match'];
      const result = await get(blobPathFor(safeName), {
        access: 'public',
        ifNoneMatch: typeof ifNoneMatch === 'string' ? ifNoneMatch : undefined,
      });
      if (!result) {
        res.status(404).json({ error: 'Fichier introuvable.' });
        return;
      }
      res.setHeader('ETag', result.blob.etag);
      res.setHeader('Cache-Control', 'private, no-cache');
      if (result.statusCode === 304) {
        res.status(304).end();
        return;
      }
      res.setHeader('Content-Type', result.blob.contentType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
      const buffer = Buffer.from(await new Response(result.stream).arrayBuffer());
      res.end(buffer);
    } catch (error) {
      console.error('Erreur lecture fichier:', error);
      res.status(500).json({ error: 'Impossible de lire le fichier.' });
    }
  });

  // Delete uploaded file
  app.delete('/api/files/:filename', async (req: Request, res: Response) => {
    try {
      await del(blobPathFor(path.basename(req.params.filename)));
    } catch (error) {
      console.error('Erreur suppression fichier:', error);
    }
    res.json({ ok: true });
  });

  // AI Pedagogical Analysis for uploaded courses (PDF, Image, Text)
  app.post('/api/ai/analyze', async (req: Request, res: Response) => {
    try {
      const {
        tool,
        storedFileName,
        mimeType,
        textContent,
        courseTitle,
        moduleTitle,
        chapterName,
        customPrompt,
      } = req.body as {
        tool: string;
        storedFileName?: string;
        mimeType?: string;
        textContent?: string;
        courseTitle?: string;
        moduleTitle?: string;
        chapterName?: string;
        customPrompt?: string;
      };

      if (!tool) {
        res.status(400).json({ error: 'Type d’analyse manquant.' });
        return;
      }

      const parts: Array<
        | { text: string }
        | { inlineData: { mimeType: string; data: string } }
      > = [];

      if (storedFileName) {
        const safeName = path.basename(storedFileName);
        const fileBuffer = await readBlobBuffer(safeName);
        if (fileBuffer) {
          const detectedMime =
            mimeType ||
            (safeName.endsWith('.pdf')
              ? 'application/pdf'
              : safeName.endsWith('.png')
                ? 'image/png'
                : 'image/jpeg');
          if (detectedMime === 'text/plain') {
            parts.push({ text: `CONTENU DU FICHIER TEXTE :\n${fileBuffer.toString('utf-8')}` });
          } else {
            parts.push({
              inlineData: {
                mimeType: detectedMime,
                data: fileBuffer.toString('base64'),
              },
            });
          }
        }
      }

      if (textContent && textContent.trim().length > 0) {
        parts.push({
          text: `NOTES / TEXTE DU COURS FOURNI PAR L'ÉTUDIANT :\n${textContent.trim()}`,
        });
      }

      if (parts.length === 0) {
        res.status(400).json({
          error: 'Veuillez fournir un fichier PDF, une image ou du texte de cours à analyser.',
        });
        return;
      }

      const contextHeader = `Cours : "${courseTitle || 'Support personnel'}" | Matière : ${moduleTitle || 'Médecine'} | Chapitre : ${chapterName || 'Général'}.`;
      const ai = getGeminiClient();

      // Structured JSON outputs for QCM & Flashcards
      if (tool === 'qcm') {
        parts.push({
          text: `${contextHeader}
Génère exactement 6 QCM rigoureux en français basés STRICTEMENT sur les informations contenues dans ce document.
Inclus un mélange de questions à choix unique ("single"), choix multiple ("multiple") et vrai/faux ("boolean").
Chaque question doit comporter une explication détaillée citant les éléments du cours. Si une précision scientifique externe est utile dans l'explication, préfixe-la par "[Complément hors support]".`,
        });

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: { parts },
          config: {
            systemInstruction: buildSystemInstruction(),
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summaryNote: {
                  type: Type.STRING,
                  description: 'Brève note sur la couverture du support.',
                },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: {
                        type: Type.STRING,
                        description: 'single, multiple ou boolean',
                      },
                      question: { type: Type.STRING },
                      options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      correctIndices: {
                        type: Type.ARRAY,
                        items: { type: Type.INTEGER },
                      },
                      explanation: { type: Type.STRING },
                      difficulty: {
                        type: Type.STRING,
                        description: 'Facile, Moyen ou Difficile',
                      },
                    },
                    required: ['type', 'question', 'options', 'correctIndices', 'explanation', 'difficulty'],
                  },
                },
              },
              required: ['questions'],
            },
          },
        });

        const parsed = JSON.parse((response.text || '{}').trim());
        res.json({
          tool,
          title: `QCM générés — ${courseTitle || 'Cours'}`,
          contentMarkdown:
            parsed.summaryNote ||
            `${(parsed.questions || []).length} questions générées strictement à partir de votre support.`,
          generatedQcms: parsed.questions || [],
        });
        return;
      }

      if (tool === 'qcm_corrector') {
        const studentAnswersNote = customPrompt?.trim()
          ? `\nRÉPONSES OU CONSIGNES PROPOSÉES PAR L'ÉTUDIANT :\n${customPrompt.trim()}\nÉvalue explicitement les réponses de l'étudiant (Juste / Erreur / Incomplet) avant de détailler la correction.`
          : '';

        parts.push({
          text: `${contextHeader}${studentAnswersNote}
Tu es un correcteur officiel d'examens de 1ère année de médecine.
Analyse les QCM présents dans le document (PDF, image ou texte) fourni par l'étudiant :
1. Dans "correctionMarkdown", rédige une correction complète et structurée en français pour CHAQUE question trouvée dans le document :
   - Indique l'énoncé et les bonnes réponses exactes (lettres + intitulés).
   - Justifie POURQUOI chaque proposition vraie est exacte ET pourquoi chaque proposition fausse est inexacte (piège classique, inversion, valeur seuil...).
   - Si l'étudiant a indiqué ses réponses, signale clairement ses réussites et ses erreurs.
   - Si une précision scientifique utile ne figure pas dans le support du professeur, sépare-la dans "[Complément hors support]".
2. Dans "questions", extrais jusqu'à 10 de ces QCM au format structuré pour que l'étudiant puisse les rejouer dans son entraîneur interactif.`,
        });

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: { parts },
          config: {
            systemInstruction: buildSystemInstruction(),
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                correctionMarkdown: {
                  type: Type.STRING,
                  description:
                    'Correction détaillée question par question avec justification de chaque item vrai et faux.',
                },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: 'single, multiple ou boolean' },
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctIndices: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                      explanation: { type: Type.STRING },
                      difficulty: { type: Type.STRING, description: 'Facile, Moyen ou Difficile' },
                    },
                    required: [
                      'type',
                      'question',
                      'options',
                      'correctIndices',
                      'explanation',
                      'difficulty',
                    ],
                  },
                },
              },
              required: ['correctionMarkdown', 'questions'],
            },
          },
        });

        const parsed = JSON.parse((response.text || '{}').trim());
        res.json({
          tool,
          title: `Correction détaillée des QCM — ${courseTitle || 'Annales'}`,
          contentMarkdown: parsed.correctionMarkdown || 'Correction générée.',
          generatedQcms: parsed.questions || [],
        });
        return;
      }

      if (tool === 'flashcards') {
        parts.push({
          text: `${contextHeader}
Génère 8 flashcards de mémorisation active (Recto / Verso + explication concise) en français, basées STRICTEMENT sur le document fourni.
Le recto doit poser une question précise ou nommer un concept clé du cours. Le verso doit donner la réponse exacte du cours.`,
        });

        const response = await ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: { parts },
          config: {
            systemInstruction: buildSystemInstruction(),
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                cards: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      front: { type: Type.STRING },
                      back: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                    },
                    required: ['front', 'back', 'explanation'],
                  },
                },
              },
              required: ['cards'],
            },
          },
        });

        const parsed = JSON.parse((response.text || '{}').trim());
        res.json({
          tool,
          title: `Flashcards générées — ${courseTitle || 'Cours'}`,
          contentMarkdown: `${(parsed.cards || []).length} flashcards prêtes à être ajoutées à vos révisions.`,
          generatedFlashcards: parsed.cards || [],
        });
        return;
      }

      // Markdown pedagogical outputs for the remaining 6 tools
      const toolPrompts: Record<string, { title: string; prompt: string }> = {
        summarize: {
          title: 'Résumé structuré du cours',
          prompt: `Rédige un résumé complet, clair et fidèle de ce cours en français. Structure le résumé avec des titres hiérarchisés, les idées directrices, les mécanismes principaux et un bilan synthétique.`,
        },
        beginner: {
          title: 'Explication pas à pas pour débutant',
          prompt: `Explique les concepts les plus difficiles de ce support comme si tu t'adressais à un étudiant débutant en 1ère année sans connaissances préalables, en suivant strictement ces 7 étapes pour chaque concept majeur :
1. Définition simple
2. Explication accessible (analogie ou langage courant)
3. Terminologie scientifique exacte
4. Mécanisme étape par étape
5. Exemples concrets tirés du cours
6. Ce qu'il faut absolument mémoriser
7. Deux mini-questions d'entraînement type examen (avec réponses).`,
        },
        definitions: {
          title: 'Glossaire des définitions essentielles',
          prompt: `Extrais toutes les définitions importantes présentes dans ce cours. Présente chaque terme avec sa définition exacte issue du document, puis son importance clinique ou physiologique.`,
        },
        exam_focus: {
          title: 'Points clés & notions tombables à l’examen',
          prompt: `Identifie toutes les notions à haute probabilité d'évaluation à l'examen dans ce cours : pièges classiques de QCM, valeurs seuils, rapports anatomiques ou formules critiques, exceptions et mots-clés attendus par les correcteurs.`,
        },
        diagrams: {
          title: 'Analyse des schémas et tableaux',
          prompt: `Analyse et explique en détail chaque schéma, figure, graphique ou tableau présent dans ce document : décris ce qu'il montre, explique les légendes, les relations entre éléments et la conclusion médicale à en retenir. Si aucun schéma/tableau visuel n'est présent, synthétise les relations du cours sous forme de tableaux comparatifs clairs.`,
        },
        revision_sheet: {
          title: 'Fiche de révision structurée',
          prompt: `Construis une fiche de révision ultra-structurée prête pour la veille d'examen : Plan en points clés, tableaux synthétiques, formules/mécanismes essentiels, moyens mnémotechniques utiles et check-list de maîtrise.`,
        },
        custom_question: {
          title: 'Explication ciblée sur le support',
          prompt: customPrompt?.trim()
            ? `Réponds précisément et pédagogiquement à la demande suivante de l'étudiant en te basant PRIORITAIREMENT sur le document fourni :\n"${customPrompt.trim()}"`
            : `Explique en détail les passages les plus complexes de ce support pour un étudiant de 1ère année de médecine.`,
        },
      };

      const selectedTool = toolPrompts[tool] || toolPrompts.summarize;
      parts.push({ text: `${contextHeader}\n\n${selectedTool.prompt}` });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          systemInstruction: buildSystemInstruction(),
        },
      });

      res.json({
        tool,
        title: `${selectedTool.title} — ${courseTitle || 'Cours'}`,
        contentMarkdown: response.text || 'Aucune réponse générée.',
      });
    } catch (error) {
      console.error('Erreur Gemini AI:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Erreur lors de l’analyse pédagogique avec Gemini.';
      res.status(500).json({ error: message });
    }
  });

  // Vite middleware in dev, static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MEDSTUDY server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
