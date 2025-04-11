import { Page } from '../shared/models/page';

export interface CreateCompetitionDto {
  name: string;
  type: string;
  description: string;
}

export interface CompetitionDto {
  id: string;
  name: string;
  type: string;
  description: string;
  fighterIds: string[];
  matchIds: string[];
}

export interface ShiftPage extends Page<CompetitionDto> {}
