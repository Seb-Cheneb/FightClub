export class Client {
  /** HOME
   **************************************/
  static home: string = '';

  /** AUTH
   **************************************/
  static authentication: string = `${this.home}/authentication`;
  static register() {
    return `${this.authentication}/register`;
  }

  static login() {
    return `${this.authentication}/login`;
  }

  /** ERRORS
   **************************************/
  static unauthorizedAccessError: string = `${this.home}/401`;
  static pageNotFoundError: string = `${this.home}/404`;

  /** FEATURES
   **************************************/
  // FIGHTERS
  static club: string = `${this.home}/clubs`;

  static getClubs(): string {
    return `${this.club}`;
  }

  static addClub(userId: string): string {
    return `${this.club}/add/${userId}`;
  }

  static editClub(id: string): string {
    return `${this.club}/edit/${id}`;
  }
  // FIGHTERS
  static fighters: string = `${this.home}/fighters`;

  static getFighters(): string {
    return `${this.fighters}/getAll`;
  }

  static addFighter(): string {
    return `${this.fighters}/add`;
  }

  static editFighter(id: string): string {
    return `${this.fighters}/edit/${id}`;
  }

  // COMPETITIONS
  static competitions: string = `${this.home}/competitions`;

  static getCompetitions(): string {
    return `${this.competitions}`;
  }

  static addCompetition(): string {
    return `${this.competitions}/add`;
  }

  static editCompetition(id: string): string {
    return `${this.competitions}/edit/${id}`;
  }

  static manageCompetitionFighters(id: string): string {
    return `${this.competitions}/club-page/${id}`;
  }
}
