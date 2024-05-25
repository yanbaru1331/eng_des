// Expressモジュールを読み込む
const express = require('express');
const app = express();

// ポート番号を設定
const PORT = process.env.PORT || 3000;

// ルートパスにGETリクエストがあった場合の処理
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// サーバーをポート3000で起動
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
