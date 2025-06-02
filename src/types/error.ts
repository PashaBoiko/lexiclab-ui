export interface IError {
  status: string;
  message: string;
}

export interface IValidationError {
  status: string;
  message: string;
  fields: Record<string, string>;
}
