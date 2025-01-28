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

// 使用例
const successResult = new Result({ data: "Success Data" });
console.log(successResult.isSuccess); // true

const errorResult = new Result({ error: "Error Message" });
console.log(errorResult.isSuccess); // false
