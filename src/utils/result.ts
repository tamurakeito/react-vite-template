export class Result<T, E> {
  data?: T;
  error?: E;

  constructor({ data, error }: { data?: T; error?: E }) {
    this.data = data;
    this.error = error;
  }

  get isSuccess(): boolean {
    return this.data !== undefined && this.error === undefined;
  }
}
