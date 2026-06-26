// Embedded benchmark datasets (spec §22). Add new datasets here to ship with the app.
import type { EmbeddedDataset } from '../datasets.ts';
import { asterAgentV1Dataset } from './aster-agent-v1.ts';
import { asterAgentV1ZhDataset } from './aster-agent-v1-zh.ts';
import { deepResearchGoldV1Dataset } from './deep-research-gold-v1.ts';

export const embeddedDatasets: EmbeddedDataset[] = [
  {
    id: 'aster-agent-v1',
    version: '1.0.0',
    load: () => asterAgentV1Dataset,
  },
  {
    id: 'aster-agent-v1-zh',
    version: '1.0.0',
    load: () => asterAgentV1ZhDataset,
  },
  {
    id: 'deep-research-gold-v1',
    version: '1.0.0',
    load: () => deepResearchGoldV1Dataset,
  },
];
