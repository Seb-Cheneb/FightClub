export class Logger {
  private _className: string = '';

  constructor(className: string) {
    this._className = className;
  }

  public log(methodName: string, message: string) {
    console.log(`${this._className} :: ${methodName} ===> ${message}`);
  }
}
