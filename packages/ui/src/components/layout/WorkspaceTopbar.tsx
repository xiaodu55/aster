import React from 'react';
import { Moon, RefreshCw } from 'lucide-react';
import { useAtom, useAtomValue } from 'jotai';
import { useTranslation } from 'react-i18next';
import { activeSymbolAtom, activeViewAtom, navSectionAtom } from '../../atoms';
import type { WorkspaceView } from '@aster/core';

const TABS: Array<{ labelKey: string; view: WorkspaceView }> = [
  { labelKey: 'kLines', view: 'chart' },
  { labelKey: 'statements', view: 'financials' },
  { labelKey: 'news', view: 'news' },
  { labelKey: 'reports', view: 'overview' },
];

/** Stitch's persistent center-column header: asset tabs stay available while
 * the existing Aster navigation controls the actual page surface below. */
export const WorkspaceTopbar: React.FC = () => {
  const { t } = useTranslation();
  const activeSymbol = useAtomValue(activeSymbolAtom);
  const navSection = useAtomValue(navSectionAtom);
  const [activeView, setActiveView] = useAtom(activeViewAtom);
  const showAssetTabs = navSection !== 'today' && navSection !== 'alerts' && navSection !== 'events' && navSection !== 'profile' && navSection !== 'settings';

  const selectTab = (view: WorkspaceView) => {
    setActiveView(view);
  };

  return (
    <header className="aster-workspace-topbar flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-6">
      <div className="flex min-w-0 items-center gap-7">
        <div className="aster-workspace-topbar-title shrink-0">Aster Research</div>
        {showAssetTabs && (
          <nav aria-label={t('navigation.workspaceTabs')} className="aster-workspace-topbar-tabs flex h-full items-center gap-5">
            {TABS.map((tab) => (
              <button
                key={tab.labelKey}
                type="button"
                aria-pressed={activeSymbol != null && navSection === 'watchlist' && activeView === tab.view}
                onClick={() => selectTab(tab.view)}
                className={`aster-workspace-topbar-tab ${activeSymbol != null && navSection === 'watchlist' && activeView === tab.view ? 'aster-workspace-topbar-tab--active' : ''}`}
              >
                {t(`navigation.${tab.labelKey}`)}
              </button>
            ))}
          </nav>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-3 text-foreground/48">
        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
        <Moon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="aster-workspace-status"><span />{t('navigation.agentPanel')}</span>
      </div>
    </header>
  );
};
