import { IFormField } from "@/types";
import { IDictionaryModel } from "@/services/rdo/dictionary.ts";

export interface IDictionaryForm {
  ua: IFormField;
  en: IFormField;
  description: IFormField;
  iteration: IFormField;
}

export type IEditFormPayload = IDictionaryModel;
