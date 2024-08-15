## endpoint
rader-leaf
* 作成: /portfolio/rader-leaf/create
* 取得: /portfolio/rader-leaf/get
* 更新: /portfolio/rader-leaf/update
* 削除: /portfolio/rader-leaf/delete

rader-chart
* 作成: /portfolio/rader-chart/create
* 取得: /portfolio/rader-chart/get
* 更新: /portfolio/rader-chart/update
* 削除: /portfolio/rader-chart/delete

portfolio-pageの修正

# db_operations
上記と同様

* /api/user/create/ POST
const createSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
});
* /api/uset/login POST
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

* /api/user/delete
const deleteSchema = z.object({
    email: z.string().email()
});

* /api/user/update/ POST
const createSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string()
});
