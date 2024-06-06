import { Hono } from "hono";
import { userApp } from "./user";

export const apiApp = new Hono()
    .route('/user', userApp)