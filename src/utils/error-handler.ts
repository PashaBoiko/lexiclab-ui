import { IError, IValidationError } from "../types/error.ts";

export default function errorHandler(err: unknown): never {
  // Is validation error
  if ((err as IValidationError).fields) {
    throw err;
  }
  throw new Error((err as IError).message);
}
