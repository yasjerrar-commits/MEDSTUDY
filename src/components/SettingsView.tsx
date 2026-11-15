import React, { useState } from 'react';
import { Download, Moon, RotateCcw, Sun } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import type { UserPreferences, UserStudyState } from '../types/medstudy';

interface SettingsViewProps {
  state: UserStudyState;
  onUpdatePreferences: (patch: Partial<UserPreferences>) => void;
  onResetProgress: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdatePreferences,
  onResetProgress,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medstudy-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2744] dark:text-white">
            Préférences & Sauvegarde
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Toutes vos données (progression, notes, flashcards, QCM et cours importés) sont
            enregistrées de façon persistante sur le serveur et synchronisées localement.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-xs space-y-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Nom / Profil étudiant
            </span>
            <input
              type="text"
              value={state.preferences.studentName}
              onChange={(e) => onUpdatePreferences({ studentName: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-xs space-y-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Objectif quotidien (minutes/jour)
            </span>
            <input
              type="number"
              min={10}
              max={600}
              value={state.preferences.dailyGoalMinutes}
              onChange={(e) =>
                onUpdatePreferences({ dailyGoalMinutes: Math.max(10, Number(e.target.value)) })
              }
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-mono"
            />
          </label>
        </div>

        {/* Theme Switch */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#0F2744] dark:text-white">
              Apparence de l’interface
            </p>
            <p className="text-xs text-slate-500">
              Basculez entre le thème clair médical et le thème sombre de révision nocturne.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onUpdatePreferences({
                theme: state.preferences.theme === 'dark' ? 'light' : 'dark',
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {state.preferences.theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Passer en mode clair</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#0F2744]" />
                <span>Passer en mode sombre</span>
              </>
            )}
          </button>
        </div>

        {/* PWA & Backup */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <PWAInstallButton />
            <button
              type="button"
              onClick={exportBackup}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exporter mes données (JSON)</span>
            </button>
          </div>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser la progression</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-rose-600 font-medium">Confirmer ?</span>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white cursor-pointer"
              >
                Oui, réinitialiser
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs cursor-pointer"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
