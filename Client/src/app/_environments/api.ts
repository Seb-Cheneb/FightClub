import { environment } from './environment';

export class API {
  // BASE
  static server: string = `${environment.API_PROTOCOL}://${environment.API_URL}:${environment.API_PORT}`;

  // CORE
  static authentication: string = `${this.server}/api/Authentication`;
  static user: string = `${this.server}/api/User`;

  // APP
  static club: string = `${this.server}/api/Club`;
  static fighter: string = `${this.server}/api/Fighter`;
  static competition: string = `${this.server}/api/Competition`;
  static match: string = `${this.server}/api/Match`;
  static bracket: string = `${this.server}/api/Bracket`;
}
