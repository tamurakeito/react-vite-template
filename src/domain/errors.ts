// 基本エラークラス
export class Err {
  readonly message: string;

  constructor({ message }: { message: string }) {
    this.message = message;
  }
}

// エラーメッセージ定義
export class ErrMessages {
  static readonly badRequest = "入力内容に誤りがあります。";
  static readonly unauthorized =
    "認証に失敗しました。ログインし直してください。";
  static readonly forbidden =
    "この操作を行う権限がありません。管理者にお問い合わせください。";
  static readonly notFound = "お探しのデータが見つかりませんでした。";
  static readonly conflict =
    "リクエストが競合しています。既に存在するデータか確認してください。";
  static readonly internalError =
    "サーバーでエラーが発生しました。時間を置いて再試行してください。";
  static readonly serviceUnavailable =
    "現在サービスを利用できません。時間を置いて再試行してください。";
  static readonly networkUnavailable =
    "ネットワークに接続できません。インターネット接続を確認してください。";
  static readonly serverUnreachable =
    "サーバーに接続できません。時間を置いて再試行してください。";
  static readonly timeout =
    "サーバーの応答がありません。時間を置いて再試行してください。";
  static readonly invalidResponseFormat = "サーバーからのデータが不正です。";
  static readonly databaseError =
    "データベースでエラーが発生しました。時間を置いて再試行してください。";
  static readonly unknownError =
    "予期しないエラーが発生しました。サポートにお問い合わせください。";
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
  static readonly serverUnreachable = new HttpErr({
    message: ErrMessages.serverUnreachable,
  });
  static readonly timeout = new HttpErr({ message: ErrMessages.timeout });
  static readonly invalidResponseFormat = new HttpErr({
    message: ErrMessages.invalidResponseFormat,
  });
  static readonly unknownError = new HttpErr({
    message: ErrMessages.unknownError,
  });
}
