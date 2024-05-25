// ESモジュールとしてpgをインポートし、Clientを抽出
import pkg from 'pg';
const { Client } = pkg;

async function testConnection() {
    const client = new Client({
        host: 'postgres', // Docker Composeで定義したPostgreSQLコンテナのホスト名
        user: 'postgres', // 環境変数から取得または直接指定
        password: 'postgres',
        database: 'postgres',
        port: 5432,
    });

    try {
        await client.connect();
        console.log('Connected successfully to PostgreSQL database');
        const res = await client.query('SELECT NOW()');
        console.log('Current timestamp from PostgreSQL:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Database connection failed', err.stack);
    }
}

testConnection();
