import {Router} from "express";
import {adminToken} from "../../middleware/auth";
import {
    AdminAddItemToUserItemInBasketRequest,
    AdminAllItemsInBasketByTypeRequest,
    AdminAllItemsInBasketUserRequest, AdminDeleteItemInBasketRequest,
    AdminEditItemInBasketRequest,
    AdminGetOneItemInBasketRequest,
    IsAdminRequest,
    ItemInBasketEntity
} from "../../types";
import {AuthInvalidError} from "../../utils/errors";
import {exists, isBetween, isNull, isTypeOf} from "../../utils/dataCheck";
import {ItemInBasketRecord, ShopItemRecord, UserRecord} from "../../records";
import {ItemInBasketCreateReq} from "../../types/itemInBasket/itemInBasket";

export const adminBasketRouter = Router();

adminBasketRouter
    .get('/itemInBasket/all', adminToken,async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const itemsInBasketList = await ItemInBasketRecord.listAll();

        res.json({
            itemsInBasketList,
        })

    })
    .get('/itemInBasket/all/user', adminToken,async (req: IsAdminRequest, res) => {
        const { body: {userId} } : {
            body: AdminAllItemsInBasketUserRequest
        } = req

        if (!req.isAdmin) throw new AuthInvalidError()

        exists(userId, 'user Id param')
        isTypeOf(userId, 'string', 'userId')
        const user = await UserRecord.getOne(userId);
        isNull(user, null,'user does not exists')
        const itemsInBasketList = await ItemInBasketRecord.listAllItemsForUser(userId);

        res.json({
            itemsInBasketList,
        })
    })
    .get('/itemInBasket/all/items', adminToken, async (req: IsAdminRequest, res) => {
        const { body: {shopItemId} } : {
            body: AdminAllItemsInBasketByTypeRequest
        } = req

        if (!req.isAdmin) throw new AuthInvalidError()

        exists(shopItemId, 'item Id')
        isTypeOf(shopItemId, 'string', 'itemId')
        const shopItem = await ShopItemRecord.getOne(shopItemId);
        isNull(shopItem, null,'Item does not exists')
        const itemsInBasketList = await ItemInBasketRecord.listAllSameShopItems(shopItemId);

        res.json({
            itemsInBasketList,
        })
    })
    .get('/itemInBasket/one', adminToken, async (req: IsAdminRequest, res) => {
        const { body: {itemId} } : {
            body: AdminGetOneItemInBasketRequest
        } = req

        if (!req.isAdmin) throw new AuthInvalidError()

        exists(itemId, 'item Id')
        isTypeOf(itemId, 'string', 'itemId')
        const itemsInBasketList = await ItemInBasketRecord.getOne(itemId);
        isNull(itemsInBasketList, null,'Item does not exists')

        res.json({
            itemsInBasketList,
        })
    })
    .post('/', adminToken , async (req: IsAdminRequest, res) => {
        const { body: {shopItemId, userId} } : {
            body: AdminAddItemToUserItemInBasketRequest
        } = req

        if (!req.isAdmin) throw new AuthInvalidError()

        exists(userId, 'user id')
        isTypeOf(userId, 'string', 'user Id')
        const user = await UserRecord.getOne(userId);
        isNull(user, null,'user does not exists')

        exists(shopItemId, 'shopItem id')
        isTypeOf(shopItemId, 'string', 'shopItem Id')
        const shopItem = await ShopItemRecord.getOne(shopItemId);
        isNull(shopItem, null,'shop Item does not exists')

        const newItemInBasket = new ItemInBasketRecord(req.body as ItemInBasketCreateReq);
        await newItemInBasket.insert();

        res.json(newItemInBasket as ItemInBasketEntity);
    })

    .patch('/', adminToken , async (req: IsAdminRequest, res) => {
        const { body: {quantity, id,shopItemId, userId} } : {
            body: AdminEditItemInBasketRequest
        } = req

        if (!req.isAdmin) throw new AuthInvalidError()

        exists(id, 'itemInBasketId  Id param')
        const itemInBasket = await ItemInBasketRecord.getOne(id);
        isNull(itemInBasket, null,'item In Basket does not exists')

        if (quantity) {
            exists(quantity, 'quantity')
            isTypeOf(quantity, 'number', 'quantity')
            isBetween(quantity, 0, 9999, 'shop item quantity')
            itemInBasket.quantity = quantity
        }

        if (shopItemId) {
            exists(shopItemId, 'shopItem id')
            isTypeOf(shopItemId, 'string', 'shopItem Id')
            const shopItem = await ShopItemRecord.getOne(shopItemId);
            isNull(shopItem, null,'shop Item does not exists')
            itemInBasket.shopItemId = shopItemId
        }

        if (userId) {
            exists(userId, 'user id')
            isTypeOf(userId, 'string', 'user Id')
            const user = await UserRecord.getOne(userId);
            isNull(user, null,'user does not exists')
            itemInBasket.userId = userId
        }

        await itemInBasket.updateFull();

        res.json(itemInBasket)
    })

    .delete('/', adminToken, async (req: IsAdminRequest, res) => {
        const { body: {id} } : {
            body: AdminDeleteItemInBasketRequest
        } = req

        if (!req.isAdmin) throw new AuthInvalidError()

        exists(id, 'itemInBasket id param')
        isTypeOf(id, 'string', 'Id')
        const itemInBasket = await ItemInBasketRecord.getOne(id);
        isNull(itemInBasket, null,'No item In Basket found for this ID.')

        await itemInBasket.delete();
        res.json({message: "personal Info deleted successfully."})
    });

//TODO delete all for an user
//TODO delete all for a shopitemtype
//TODO delete all
