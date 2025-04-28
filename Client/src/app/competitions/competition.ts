import { Page } from '../shared/models/page';

export interface CreateCompetitionDto {
  name: string;
  description: string;
}

export interface CompetitionDto {
  id: string;
  name: string;
  description: string;
  fighterIds: string[];
  bracketIds: string[];
  matchIds: string[];
}

export interface ShiftPage extends Page<CompetitionDto> {}
