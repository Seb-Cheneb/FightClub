import { ClubDto } from '../clubs/club';
import { Page } from '../shared/models/page';

export interface CreateFighterDto {
  name: string;
  gender: string;
  birthDate: string;
  weight: number;
  clubId: string;
  rank: string;
}

export interface FighterDto {
  id: string;
  name: string;
  gender: string;
  birthdate: string;
  weight: number;
  club: string;
  rank: string;
  competitionIds: string[];
  matchIds: string[];
}

export interface ShiftPage extends Page<FighterDto> {}
