import { Hono } from "hono";
import { cors } from 'hono/cors';
import { userApp } from "./user";
import { PortfolioPageApp } from "./portfolio_page";
import { PortfolioChartApp } from "./portfolio_rader_chart";

export const apiApp = new Hono()
    .route('/user', userApp)
    .route('/portfolio/page', PortfolioPageApp)
    .route('/portfolio/chart', PortfolioChartApp)

// // CORSミドルウェアの設定nn
// apiApp.use('/*', cors({
//     origin: "http://localhost:8000",
//     //オリジンの設定がうまく言ってないのでとりあえず*で動かす
//     // origin: "*",
//     //   allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
//     allowHeaders: ['*'],
//     allowMethods: ['POST', 'GET', 'OPTIONS'],
//     exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
//     maxAge: 600,
//     credentials: true,
//}));