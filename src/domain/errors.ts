// 基本エラークラス
export class Err {
  readonly message: string;

  constructor({ message }: { message: string }) {
    this.message = message;
  }
}

// エラーメッセージ定義
export class ErrMessages {
  static readonly badRequest = "Request was invalid";
  static readonly unauthorized = "Not authorized to access";
  static readonly forbidden = "Access to this resource is forbidden";
  static readonly notFound = "Data not found";
  static readonly conflict = "Resource conflict";
  static readonly internalError = "Internal server error";
  static readonly serviceUnavailable = "Service temporarily unavailable";
  static readonly networkUnavailable = "Network is unconnected";
  static readonly timeout = "Connection is timeout";
  static readonly invalidResponseFormat = "Unexpected response format";
  static readonly databaseError = "Database error occurred";
  static readonly unknownError = "Unknown error occurred";
}

// HTTPエラークラス
export class HttpErr extends Err {
  constructor({ message }: { message: string }) {
    super({ message });
  }
}

// HTTPエラーの定義
export class HttpError {
  static readonly badRequest = new HttpErr({ message: ErrMessages.badRequest });
  static readonly unauthorized = new HttpErr({
    message: ErrMessages.unauthorized,
  });
  static readonly forbidden = new HttpErr({ message: ErrMessages.forbidden });
  static readonly notFound = new HttpErr({ message: ErrMessages.notFound });
  static readonly conflict = new HttpErr({ message: ErrMessages.conflict });
  static readonly internalError = new HttpErr({
    message: ErrMessages.internalError,
  });
  static readonly serviceUnavailable = new HttpErr({
    message: ErrMessages.serviceUnavailable,
  });
  static readonly networkUnavailable = new HttpErr({
    message: ErrMessages.networkUnavailable,
  });
  static readonly timeout = new HttpErr({ message: ErrMessages.timeout });
  static readonly invalidResponseFormat = new HttpErr({
    message: ErrMessages.invalidResponseFormat,
  });
  static readonly unknownError = new HttpErr({
    message: ErrMessages.unknownError,
  });
}
