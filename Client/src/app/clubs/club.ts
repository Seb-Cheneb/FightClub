import { FighterDto } from '../fighters/fighter';
import { Page } from '../shared/models/page';

export interface CreateBracketDto {
  competitionId: string;
  name: string;
}

export interface PositionDto {
  key: number;
  value: string;
}

export interface BracketDto {
  id: string;
  competitionId: string;
  name: string;
  fighters: FighterDto[];
  positions: PositionDto[];
}

export class Round {
  constructor(public fighters: (FighterDto | null)[]) {}
}

export interface ShiftPage extends Page<BracketDto> {}
