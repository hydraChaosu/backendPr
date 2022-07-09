import {Router} from "express";
import {CategoryRecord, ShopItemRecord} from "../../records";
import { SetShopItemCategoryReq} from "../../types/shop/shopItem";
import {exists, isBetween, isNull, isTypeOf} from "../../utils/dataCheck";
import {authenticateToken} from "../../middleware/auth";
import {InvalidTokenError} from "../../utils/errors";
import {UserAuthReq} from "../../types";

export const shopItemRouter = Router();

shopItemRouter

    .get('/all', async (req, res) => {
        const shopItemList = await ShopItemRecord.listAll();

        res.json({
            shopItemList,
        })
    })
    .get('/category/:categoryId', async (req, res) => {

        const {categoryId} = req.params;
        exists(categoryId, 'id param')

        const category = await CategoryRecord.getOne(categoryId);
        isNull(category, null,'category does not exists')
        const shopItemList = await ShopItemRecord.listAllByCategory(categoryId);

        res.json({
            shopItemList,
        })
    })
    .get('/name/:name', async (req, res) => {

        const {name} = req.params;
        exists(name, 'name')

        const shopItemList = await ShopItemRecord.getOneByName(name);
        isNull(shopItemList, null,'shopItemList does not exists')

        res.json({
            shopItemList,
        })
    })
    .get('/one/:id', async (req, res) => {

        const {id} = req.params;
        exists(id, 'id param')

        const shopItem = await ShopItemRecord.getOne(id);
        isNull(shopItem, null,'shopItem does not exists')

        res.json({
            shopItem,
        })
    })
    .patch('/shopItem', authenticateToken, async (req: UserAuthReq, res) => {

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        const { body: {id, quantity} } : {
            body: SetShopItemCategoryReq
        } = req

        exists(id, 'shop item id param')
        isTypeOf(id, 'string', 'id')
        const shopItem = await ShopItemRecord.getOne(id);
        isNull(shopItem, null,'shop item does not exists')

        if (quantity || quantity === 0) {
            isTypeOf(quantity, 'number', 'quantity')
            isBetween(quantity, 0, 9999, 'quantity')
            shopItem.quantity = quantity
        }

        await shopItem.update();

        res.json(shopItem)
})





