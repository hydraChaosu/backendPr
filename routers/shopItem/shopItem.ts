import { Request, Response, Router } from "express";
import { CategoryRecord, ShopItemRecord } from "../../records";
import { exists, isNull } from "../../utils/dataCheck";
import { ShopItemEntity } from "../../types";

export const shopItemRouter = Router();

shopItemRouter

  .get("/all", async (req: Request, res: Response) => {
    const shopItemList = await ShopItemRecord.listAll();
    res.json(shopItemList as ShopItemEntity[]);
  })
  .get("/category/:categoryId", async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    exists(categoryId, "id param");

    const category = await CategoryRecord.getOne(categoryId);
    isNull(category, null, "category does not exists");
    const shopItemList = await ShopItemRecord.listAllByCategory(categoryId);

    res.json(shopItemList as ShopItemEntity[]);
  })
  .get("/name/:name", async (req: Request, res: Response) => {
    const { name } = req.params;
    exists(name, "name");

    const shopItemList = await ShopItemRecord.getOneByName(name);
    isNull(shopItemList, null, "shopItemList does not exists");

    res.json(shopItemList as ShopItemEntity[]);
  })
  .get("/one/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    exists(id, "id param");

    const shopItem = await ShopItemRecord.getOne(id);
    isNull(shopItem, null, "shopItem does not exists");

    res.json(shopItem as ShopItemEntity);
  });
