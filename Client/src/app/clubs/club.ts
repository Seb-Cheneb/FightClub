import { FighterDto } from '../fighters/fighter';
import { Page } from '../shared/models/page';

export interface CreateClubDto {
  appUserId: string;
  clubName: string;
}

export interface ClubDto {
  id: string;
  appUserId: string;
  clubName: string;
  fighters: FighterDto[];
}
export interface ShiftPage extends Page<ClubDto> {}
