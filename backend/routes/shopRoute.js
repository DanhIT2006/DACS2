import express from "express";
import shopOwnerAuthMiddleware from "../middleware/shopOwnerAuth.js";

import { addFood, listShopFood, removeFood } from "../controllers/foodController.js";
import { listOrders, updateStatus } from "../controllers/orderController.js";
import {getOrCreateShopProfile, updateShopProfile} from "../controllers/shopController.js";

const shopRouter = express.Router();


// Quản lý món ăn
shopRouter.post("/add", shopOwnerAuthMiddleware, addFood);
shopRouter.post("/remove", shopOwnerAuthMiddleware, removeFood);
shopRouter.get("/list",shopOwnerAuthMiddleware, listShopFood);

// Quản lý đơn hàng (Đơn hàng chi tiết cho Shop)
shopRouter.get("/orders/list", shopOwnerAuthMiddleware, listOrders);
shopRouter.post("/orders/status", shopOwnerAuthMiddleware, updateStatus);

// lấy/tạo hồ sơ
shopRouter.get("/profile", shopOwnerAuthMiddleware, getOrCreateShopProfile);
// Cập nhật hồ sơ
shopRouter.put("/profile", shopOwnerAuthMiddleware, updateShopProfile);

export default shopRouter;