import { Page } from '../shared/models/page';

export interface CreateBracketDto {
  competitionId: string;
  name: string;
}

export interface BracketDto {
  id: string;
  competitionId: string;
  name: string;
  fighterIds: string[];
}

export interface ShiftPage extends Page<BracketDto> {}
