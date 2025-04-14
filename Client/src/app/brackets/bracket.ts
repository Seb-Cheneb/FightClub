import { Page } from '../shared/models/page';

export interface CreateBracketDto {
  competitionId: string;
  category: string;
}

export interface BracketDto {
  id: string;
  competitionId: string;
  category: string;
  fighterIds: string[];
}

export interface ShiftPage extends Page<BracketDto> {}
