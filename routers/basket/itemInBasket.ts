import {Router} from "express";
import { ItemInBasketRecord, ShopItemRecord, UserRecord} from "../../records";
import {ItemInBasketEntity} from "../../types";
import {exists, isBetween, isNull, isTypeOf} from "../../utils/dataCheck";
import {ItemInBasketCreateReq, SetItemInBasketReq} from "../../types/itemInBasket/itemInBasket";
export const itemInBasketRouter = Router();

itemInBasketRouter

    .get('/all', async (req, res) => {
        const itemsInBasketList = await ItemInBasketRecord.listAll();

        res.json({
            itemsInBasketList,
        })
    })
    .get('/all/user/:userId', async (req, res) => {
        exists(req.params.userId, 'user Id param')
        const user = await UserRecord.getOne(req.params.userId);
        isNull(user, null,'user does not exists')
        const itemsInBasketList = await ItemInBasketRecord.listAllItemsForUser(req.params.userId);

        res.json({
            itemsInBasketList,
        })
    })
    .get('/all/items/:itemId', async (req, res) => {
        exists(req.params.itemId, 'item Id')
        const shopItem = await ShopItemRecord.getOne(req.params.itemId);
        isNull(shopItem, null,'Item does not exists')
        const itemsInBasketList = await ItemInBasketRecord.listAllSameShopItems(req.params.itemId);

        res.json({
            itemsInBasketList,
        })
    })
    .get('/one/:id', async (req, res) => {
        exists(req.params.id, 'id param')
        const itemsInBasketList = await ItemInBasketRecord.getOne(req.params.id);
        isNull(itemsInBasketList, null,'Item does not exists')

        res.json({
            itemsInBasketList,
        })
    })
    .post('/', async (req, res) => {
        const { body } : {
            body: ItemInBasketCreateReq
        } = req

        exists(body.userId, 'user id')
        isTypeOf(body.userId, 'string', 'user Id')
        const user = await UserRecord.getOne(body.userId);
        isNull(user, null,'user does not exists')

        exists(body.shopItemId, 'shopItem id')
        isTypeOf(body.shopItemId, 'string', 'shopItem Id')
        const shopItem = await ShopItemRecord.getOne(body.shopItemId);
        isNull(shopItem, null,'shop Item does not exists')

        const newItemInBasket = new ItemInBasketRecord(req.body as ItemInBasketCreateReq);
        await newItemInBasket.insert();

        res.json(newItemInBasket as ItemInBasketEntity);
    })

    .patch('/:itemInBasketId', async (req, res) => {
        const { body } : {
            body: SetItemInBasketReq
        } = req

        exists(req.params.itemInBasketId, 'itemInBasketId  Id param')
        const itemInBasket = await ItemInBasketRecord.getOne(req.params.itemInBasketId);
        isNull(itemInBasket, null,'item In Basket does not exists')

        exists(body.quantity, 'quantity')
        isTypeOf(body.quantity, 'number', 'quantity')
        isBetween(body.quantity, 0, 9999, 'shop item quantity')

        itemInBasket.quantity = body.quantity
        await itemInBasket.update();

        res.json(itemInBasket)
    })

    .delete('/:itemInBasket', async (req, res) => {

        exists(req.params.itemInBasket, 'itemInBasket id param')
        const itemInBasket = await ItemInBasketRecord.getOne(req.params.itemInBasket);

        isNull(itemInBasket, null,'No item In Basket found for this ID.')

        await itemInBasket.delete();
        res.json({message: "personal Info deleted successfully."})
    });
