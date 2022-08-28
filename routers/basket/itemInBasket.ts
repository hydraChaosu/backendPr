import { Response, Router } from "express";
import { ItemInBasketRecord, ShopItemRecord } from "../../records";
import {
  DeleteItemInBasketRequest,
  ItemInBasketCreateReq,
  ItemInBasketEntity,
  SetItemInBasketReq,
  UserAuthReq,
} from "../../types";
import { exists, isBetween, isNull, isTypeOf } from "../../utils/dataCheck";
import {
  authenticateToken,
  checkIfCorrectUserRole,
} from "../../middleware/auth";
import { AuthInvalidError } from "../../utils/errors";

export const itemInBasketRouter = Router();

itemInBasketRouter

  .get(
    "/all",
    [authenticateToken, checkIfCorrectUserRole([0])],
    async (req: UserAuthReq, res: Response) => {
      const { user } = req;

      const itemsInBasketList = await ItemInBasketRecord.listAllItemsForUser(
        user.id
      );

      res.json(itemsInBasketList as ItemInBasketEntity[]);
    }
  )
  .get(
    "/one/:id",
    [authenticateToken, checkIfCorrectUserRole([0])],
    async (req: UserAuthReq, res: Response) => {
      const { user } = req;

      const { id } = req.params;

      exists(id, "item id");
      isTypeOf(id, "string", "item id");
      const itemInBasket = await ItemInBasketRecord.getOne(id);
      isNull(itemInBasket, null, "Item does not exists");

      if (itemInBasket.userId !== user.id) throw new AuthInvalidError();

      res.json(itemInBasket as ItemInBasketEntity);
    }
  )
  .post(
    "/",
    [authenticateToken, checkIfCorrectUserRole([0])],
    async (req: UserAuthReq, res: Response) => {
      const {
        body: { shopItemId },
      }: {
        body: ItemInBasketCreateReq;
      } = req;

      const { user } = req;

      exists(shopItemId, "shopItem id");
      isTypeOf(shopItemId, "string", "shopItem Id");
      const shopItem = await ShopItemRecord.getOne(shopItemId);
      isNull(shopItem, null, "shop Item does not exists");

      req.body.userId = user.id;

      const newItemInBasket = new ItemInBasketRecord(
        req.body as ItemInBasketCreateReq
      );
      await newItemInBasket.insert();

      res.json(newItemInBasket as ItemInBasketEntity);
    }
  )

  .patch(
    "/",
    [authenticateToken, checkIfCorrectUserRole([0])],
    async (req: UserAuthReq, res: Response) => {
      const {
        body: { id, quantity },
      }: {
        body: SetItemInBasketReq;
      } = req;

      const { user } = req;

      exists(id, "itemInBasketId  Id param");
      isTypeOf(id, "string", "basket item id");
      const itemInBasket = await ItemInBasketRecord.getOne(id);
      isNull(itemInBasket, null, "item In Basket does not exists");

      exists(quantity, "quantity");
      isTypeOf(quantity, "number", "quantity");
      isBetween(quantity, 0, 9999, "shop item quantity");

      itemInBasket.quantity = quantity;

      if (itemInBasket.userId !== user.id) throw new AuthInvalidError();

      await itemInBasket.update();
      res.json(itemInBasket as ItemInBasketEntity);
    }
  )

  .delete(
    "/",
    [authenticateToken, checkIfCorrectUserRole([0])],
    async (req: UserAuthReq, res: Response) => {
      const {
        body: { id },
      }: { body: DeleteItemInBasketRequest } = req;

      const { user } = req;

      exists(id, "itemInBasket id param");
      isTypeOf(id, "string", "basket item id");
      const itemInBasket = await ItemInBasketRecord.getOne(id);
      isNull(itemInBasket, null, "No item In Basket found for this ID.");
      if (itemInBasket.userId !== user.id) throw new AuthInvalidError();

      await itemInBasket.delete();
      res.json({ message: "item deleted successfully." });
    }
  );
