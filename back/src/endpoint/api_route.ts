import { Hono } from "hono";

import { userApp } from "./user";
import { PortfolioPageApp } from "./portfolio_page";
import { PortfolioChartApp } from "./portfolio_rader_chart";

export const apiApp = new Hono()
    .route('/user', userApp)
    .route('/portfolio/page', PortfolioPageApp)
    .route('/portfolio/chart', PortfolioChartApp)