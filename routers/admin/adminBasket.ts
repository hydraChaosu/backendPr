import { Router } from "express";
import { adminToken } from "../../middleware/auth";
import {
  AddItemToUserItemInBasketRequest,
  DeleteItemInBasketRequest,
  EditItemInBasketRequest,
  GetOneItemInBasketRequest,
  IsAdminRequest,
  ItemInBasketEntity,
} from "../../types";
import { AuthInvalidError } from "../../utils/errors";
import { exists, isBetween, isNull, isTypeOf } from "../../utils/dataCheck";
import { ItemInBasketRecord, ShopItemRecord, UserRecord } from "../../records";
import { ItemInBasketCreateReq } from "../../types";

export const adminItemInBasketRouter = Router();

adminItemInBasketRouter
  .get("/all", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    const itemsInBasketList = await ItemInBasketRecord.listAll();

    res.json(itemsInBasketList as ItemInBasketEntity[]);
  })
  .get("/all/user/:userId", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    const { userId } = req.params;
    exists(userId, "userId param");

    const user = await UserRecord.getOne(userId);
    isNull(user, null, "user does not exists");
    const itemsInBasketList = await ItemInBasketRecord.listAllItemsForUser(
      userId
    );

    res.json(itemsInBasketList as ItemInBasketEntity[]);
  })
  .get(
    "/all/shopitem/:shopItemId",
    adminToken,
    async (req: IsAdminRequest, res) => {
      if (!req.isAdmin) throw new AuthInvalidError();

      const { shopItemId } = req.params;

      exists(shopItemId, "item Id");
      isTypeOf(shopItemId, "string", "itemId");
      const shopItem = await ShopItemRecord.getOne(shopItemId);
      isNull(shopItem, null, "Item does not exists");
      const itemsInBasketList = await ItemInBasketRecord.listAllSameShopItems(
        shopItemId
      );

      res.json(itemsInBasketList as ItemInBasketEntity[]);
    }
  )
  .get("/one/:id", adminToken, async (req: IsAdminRequest, res) => {
    const {
      body: { itemId },
    }: {
      body: GetOneItemInBasketRequest;
    } = req;

    if (!req.isAdmin) throw new AuthInvalidError();

    exists(req.params.id, "item Id");
    const itemsInBasketList = await ItemInBasketRecord.getOne(req.params.id);
    isNull(itemsInBasketList, null, "Item does not exists");

    res.json(itemsInBasketList as ItemInBasketEntity);
  })
  .post("/", adminToken, async (req: IsAdminRequest, res) => {
    const {
      body: { shopItemId, userId },
    }: {
      body: AddItemToUserItemInBasketRequest;
    } = req;

    if (!req.isAdmin) throw new AuthInvalidError();

    exists(userId, "user id");
    isTypeOf(userId, "string", "user Id");
    const user = await UserRecord.getOne(userId);
    isNull(user, null, "user does not exists");

    exists(shopItemId, "shopItem id");
    isTypeOf(shopItemId, "string", "shopItem Id");
    const shopItem = await ShopItemRecord.getOne(shopItemId);
    isNull(shopItem, null, "shop Item does not exists");

    const newItemInBasket = new ItemInBasketRecord(
      req.body as ItemInBasketCreateReq
    );
    await newItemInBasket.insert();

    res.json(newItemInBasket as ItemInBasketEntity);
  })

  .patch("/", adminToken, async (req: IsAdminRequest, res) => {
    const {
      body: { quantity, id, shopItemId, userId },
    }: {
      body: EditItemInBasketRequest;
    } = req;

    if (!req.isAdmin) throw new AuthInvalidError();

    exists(id, "itemInBasketId  Id");
    const itemInBasket = await ItemInBasketRecord.getOne(id);
    isNull(itemInBasket, null, "item In Basket does not exists");

    if (quantity) {
      exists(quantity, "quantity");
      isTypeOf(quantity, "number", "quantity");
      isBetween(quantity, 0, 9999, "shop item quantity");
      itemInBasket.quantity = quantity;
    }

    if (shopItemId) {
      exists(shopItemId, "shopItem id");
      isTypeOf(shopItemId, "string", "shopItem Id");
      const shopItem = await ShopItemRecord.getOne(shopItemId);
      isNull(shopItem, null, "shop Item does not exists");
      itemInBasket.shopItemId = shopItemId;
    }

    if (userId) {
      exists(userId, "user id");
      isTypeOf(userId, "string", "user Id");
      const user = await UserRecord.getOne(userId);
      isNull(user, null, "user does not exists");
      itemInBasket.userId = userId;
    }

    await itemInBasket.updateFull();

    res.json(itemInBasket as ItemInBasketEntity);
  })

  .delete("/", adminToken, async (req: IsAdminRequest, res) => {
    const {
      body: { id },
    }: {
      body: DeleteItemInBasketRequest;
    } = req;

    if (!req.isAdmin) throw new AuthInvalidError();

    exists(id, "itemInBasket id");
    isTypeOf(id, "string", "Id");
    const itemInBasket = await ItemInBasketRecord.getOne(id);
    isNull(itemInBasket, null, "No item In Basket found for this ID.");

    await itemInBasket.delete();
    res.json({ message: "item in basket deleted successfully." });
  });
