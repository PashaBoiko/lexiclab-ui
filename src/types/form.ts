export type IRule = (value: string) => string | boolean;

export interface IFormField {
  value: string | number;
  rules: IRule[];
  errorMessage: string;
}
