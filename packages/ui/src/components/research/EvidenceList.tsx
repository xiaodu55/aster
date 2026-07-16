import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchSection } from '@aster/core';
import { semanticCapabilityLabelKey } from '../../lib/agentPresentation';

/**
 * Evidence refs for one report section: claim → capability → fetch time.
 * The capability id is shown as its user-facing label (V9 §47 — "claim,
 * source, time"); unknown ids keep a stable neutral fallback instead of
 * leaking engineering terms into the normal report view.
 */
export const EvidenceList: React.FC<{ section: ResearchSection }> = ({ section }) => {
  const { t } = useTranslation();
  if (section.evidence.length === 0) return null;
  return (
    <div className="aster-pilot-evidence-list">
      {section.evidence.map((ref) => {
        const label = t(semanticCapabilityLabelKey(ref.capabilityId));
        return (
          <div
            key={ref.runId}
            className="aster-pilot-evidence-row"
          >
            <span className="aster-pilot-evidence-claim">{ref.claim}</span>
            <span className="aster-pilot-evidence-meta">
              {label} · {new Date(ref.fetchedAt).toLocaleTimeString()}
              {ref.summary ? ` · ${ref.summary}` : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
};
