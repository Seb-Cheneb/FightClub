import { Page } from '../shared/models/page';

export interface CreateMatchDto {
  competitionId: string;
  category: string;
}

export interface MatchDto {
  id: string;
  competitionId: string;
  category: string;
  number: number;
  winner: string;
  fighterIds: string[];
}

export interface ShiftPage extends Page<MatchDto> {}
