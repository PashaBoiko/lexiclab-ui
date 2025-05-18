export type IRule = (value: string) => string | boolean;

export interface IFormField {
  value: string;
  rules: IRule[];
  errorMessage: string;
}