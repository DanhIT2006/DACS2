import express from "express";
import shopOwnerAuthMiddleware from "../middleware/shopOwnerAuth.js";

import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import { listOrders, updateStatus } from "../controllers/orderController.js";

const shopRouter = express.Router();


// Quản lý món ăn
shopRouter.post("/add", shopOwnerAuthMiddleware, addFood);
shopRouter.post("/remove", shopOwnerAuthMiddleware, removeFood);

// Quản lý đơn hàng (Đơn hàng chi tiết cho Shop)
shopRouter.get("/orders/list", shopOwnerAuthMiddleware, listOrders);
shopRouter.post("/orders/status", shopOwnerAuthMiddleware, updateStatus);

export default shopRouter;