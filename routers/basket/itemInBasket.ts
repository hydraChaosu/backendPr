import {Router} from "express";
import { ItemInBasketRecord, ShopItemRecord, UserRecord} from "../../records";
import {ItemInBasketEntity, UserAuthReq} from "../../types";
import {exists, isBetween, isNull, isTypeOf} from "../../utils/dataCheck";
import {
    DeleteItemInBasketRequest,
    ItemInBasketCreateReq,
    SetItemInBasketReq
} from "../../types";
import {authenticateToken} from "../../middleware/auth";
import {AuthInvalidError, InvalidTokenError} from "../../utils/errors";
export const itemInBasketRouter = Router();

itemInBasketRouter

    .get('/all/user', authenticateToken, async (req: UserAuthReq, res) => {

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        exists(reqUserId, 'user Id param')
        isTypeOf(reqUserId, 'string', 'user id')
        const user = await UserRecord.getOne(reqUserId);
        isNull(user, null,'user does not exists')
        const itemsInBasketList = await ItemInBasketRecord.listAllItemsForUser(reqUserId);

        res.json({
            itemsInBasketList,
        })
    })
    .get('/one/:id',authenticateToken, async (req: UserAuthReq, res) => {

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        const {id} = req.params;
        exists(id, 'id param')

        const user = await UserRecord.getOne(reqUserId);
        isNull(user, null,'user does not exists')

        exists(id, 'item id')
        isTypeOf(id, 'string', 'item id')
        const itemInBasketList = await ItemInBasketRecord.getOne(id);
        isNull(itemInBasketList, null,'Item does not exists')

        if (itemInBasketList.userId !== reqUserId) throw new AuthInvalidError()

        res.json({
            itemInBasketList,
        })
    })
    .post('/', authenticateToken,async (req: UserAuthReq, res) => {
        const { body: {shopItemId} } : {
            body: ItemInBasketCreateReq
        } = req

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        exists(reqUserId, 'user id')
        isTypeOf(reqUserId, 'string', 'user Id')
        const user = await UserRecord.getOne(reqUserId);
        isNull(user, null,'user does not exists')

        exists(shopItemId, 'shopItem id')
        isTypeOf(shopItemId, 'string', 'shopItem Id')
        const shopItem = await ShopItemRecord.getOne(shopItemId);
        isNull(shopItem, null,'shop Item does not exists')

        req.body.userId = reqUserId

        const newItemInBasket = new ItemInBasketRecord(req.body as ItemInBasketCreateReq);
        await newItemInBasket.insert();

        res.json(newItemInBasket as ItemInBasketEntity);
    })

    .patch('/', authenticateToken, async (req: UserAuthReq, res) => {
        const { body: {id, quantity} } : {
            body: SetItemInBasketReq
        } = req

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        exists(id, 'itemInBasketId  Id param')
        isTypeOf(id, 'string', 'basket item id')
        const itemInBasket = await ItemInBasketRecord.getOne(id);
        isNull(itemInBasket, null,'item In Basket does not exists')

        exists(quantity, 'quantity')
        isTypeOf(quantity, 'number', 'quantity')
        isBetween(quantity, 0, 9999, 'shop item quantity')

        itemInBasket.quantity = quantity

        if (itemInBasket.userId !== reqUserId) throw new AuthInvalidError()

        await itemInBasket.update();
        res.json(itemInBasket)
    })

    .delete('/', authenticateToken, async (req: UserAuthReq, res) => {

        const { body: {id} } : { body: DeleteItemInBasketRequest} = req

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        exists(id, 'itemInBasket id param')
        isTypeOf(id, 'string', 'basket item id')
        const itemInBasket = await ItemInBasketRecord.getOne(id)
        isNull(itemInBasket, null,'No item In Basket found for this ID.')
        if (itemInBasket.userId !== reqUserId) throw new AuthInvalidError()

        await itemInBasket.delete();
        res.json({message: "personal Info deleted successfully."})
    });
