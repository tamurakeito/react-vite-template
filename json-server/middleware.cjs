// GET以外のメソッドもGETに置き換えることでdb_mock.jsonの上書きを防ぐ
module.exports = function (req, res, next) {
  // routes.jsonの上書きを防ぐためにGET以外のメソッドもGETに変更
  if (req.method !== "GET") {
    req.method = "GET";
  }
  setTimeout(() => {
    next();
  }, 1000);
};
