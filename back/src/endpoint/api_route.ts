import { Hono } from "hono";
import { PortfolioPageApp } from "./portfolio_page";
import { userApp } from "./user";

export const apiApp = new Hono()
    .route('/user', userApp)
    .route('/portfolio/page', PortfolioPageApp)