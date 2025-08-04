// Add this to a types file
export interface ValidationErrorWithParam {
  param: string;
  msg: string;
  location: string;
  value: any;
}

export interface ValidationErrorWithPath {
  path: string;
  msg: string;
  location: string;
  value: any;
}

export type ExtendedValidationError = ValidationErrorWithParam | ValidationErrorWithPath;