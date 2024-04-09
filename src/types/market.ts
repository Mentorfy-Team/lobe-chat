import { MetaData } from '@/types/meta';
import { LobeAgentSettings } from '@/types/session';

export interface AgentsMarketIndexItem {
  author: string;
  createAt: string;
  homepage: string;
  identifier: string;
  manifest: string;
  meta: MetaData;
  schemaVersion: 1;
}

export type AgentsMarketItem = AgentsMarketIndexItem & LobeAgentSettings;

export interface Mentorfy GPTAgentsMarketIndex {
  agents: AgentsMarketIndexItem[];
  schemaVersion: 1;
  tags: string[];
}
