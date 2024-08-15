backの起動、コンテナの中で
```
pnpm i
pnpm dev
```
結果
```
open http://localhost:3000
```


prisma.schema の適用
```
pnpm dlx prisma generate
pnpm dlx prisma migrate dev
```

prisma studio
```
pnpm dlx prisma studio
```

API一覧はback_api_test.http
REST CLientという拡張機能を入れて開く
Send Requestを押すと楽にテストできる