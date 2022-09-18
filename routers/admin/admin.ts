import { Router } from "express";
import { adminItemInBasketRouter } from "./adminBasket";
import { adminCategoryRouter } from "./adminCategory";
import { adminPersonalInfoRouter } from "./adminPersonalInfo";
import { adminShopItemRouter } from "./adminShopItem";
import { adminUserRouter } from "./adminUser";

export const adminRouter = Router();

adminRouter.use("/category", adminCategoryRouter);
adminRouter.use("/shopItem", adminShopItemRouter);
adminRouter.use("/user", adminUserRouter);
adminRouter.use("/personalInfo", adminPersonalInfoRouter);
adminRouter.use("/itemInBasket", adminItemInBasketRouter);
