// error handling
export type ErrorResponse = {
  error: string;
};
export const checkIsErrorResponse = (obj: any): obj is ErrorResponse => {
  return typeof obj.error === "string";
};
