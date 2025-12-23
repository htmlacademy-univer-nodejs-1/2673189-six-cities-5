export class HttpError extends Error {
  public httpStatusCode!: number;
  public detail?: string;
  public errors?: unknown;

  constructor(httpStatusCode: number, message: string, detail?: string, errors?: unknown) {
    super(message);

    this.httpStatusCode = httpStatusCode;
    this.message = message;
    this.detail = detail;
    this.errors = errors;
  }
}
