import {Router} from "express";
import {CategoryRecord, ShopItemRecord} from "../../records";
import { ShopItemEntity} from "../../types";
import {SetShopItemCategoryReq, ShopItemCreateReq} from "../../types/shop/shopItem";
import {exists, isBetween, isBigger, isNotNull, isNull, isSmaller, isTypeOf} from "../../utils/dataCheck";
export const shopItemRouter = Router();

shopItemRouter

    .get('/all', async (req, res) => {
        const shopItemList = await ShopItemRecord.listAll();

        res.json({
            shopItemList,
        })
    })
    .get('/category/:categoryId', async (req, res) => {
        exists(req.params.categoryId, 'categoryId param')
        const category = await CategoryRecord.getOne(req.params.categoryId);
        isNull(category, null,'category does not exists')
        const shopItemList = await ShopItemRecord.listAllByCategory(req.params.categoryId);

        res.json({
            shopItemList,
        })
    })
    .get('/name/:name', async (req, res) => {
        exists(req.params.name, 'name')
        isTypeOf(req.params.name, 'string', 'name')
        const shopItemList = await ShopItemRecord.getOneBySimilarName(req.params.name);
        isNull(shopItemList, null,'shopItemList does not exists')

        res.json({
            shopItemList,
        })
    })
    .get('/one/:id', async (req, res) => {
        exists(req.params.id, 'id param')
        const shopItem = await ShopItemRecord.getOne(req.params.id);
        isNull(shopItem, null,'shopItem does not exists')

        res.json({
            shopItem,
        })
    })
    .post('/', async (req, res) => {
        const { body } : {
            body: ShopItemCreateReq
        } = req

        exists(body.name, 'name')
        isTypeOf(body.name, 'string', 'name')
        const shopItem = await ShopItemRecord.getOneByName(body.name);
        isNotNull(shopItem, null,'shop item with this name already exists')

        exists(body.categoryId, 'category id')
        isTypeOf(body.categoryId, 'string', 'category id')
        const category = await CategoryRecord.getOne(body.categoryId);
        isNull(category, null,'category does not exists')

        body.name = body.name ? body.name : null
        body.quantity = body.quantity ? body.quantity : null
        body.price = body.price ? body.price : null
        body.categoryId = body.categoryId ? body.categoryId : null
        body.img = body.img ? body.img : null

        const newShopItem = new ShopItemRecord(req.body as ShopItemCreateReq);
        await newShopItem.insert();


        res.json(newShopItem as ShopItemEntity);
    })

    .patch('/:shopItemId', async (req, res) => {
        const { body } : {
            body: SetShopItemCategoryReq
        } = req

        exists(req.params.shopItemId, 'shop item id param')
        const shopItem = await ShopItemRecord.getOne(req.params.shopItemId);
        isNull(shopItem, null,'shop item does not exists')

        if (body.name) {
            isTypeOf(body.name, 'string', 'name')
            isBetween(body.name, 3, 50, 'name')
            const shopItemCheck = await ShopItemRecord.getOneByName(body.name);
            isNotNull(shopItemCheck, null,'shop item with this name already exists')
            shopItem.name = body.name
        }

        if (body.img) {
            isTypeOf(body.img, 'string', 'img')
            isSmaller(body.img.length, 50, 'img')
            shopItem.img = body.img
        }

        if (body.quantity || body.quantity === 0) {
            isTypeOf(body.quantity, 'number', 'quantity')
            isBetween(body.quantity, 0, 9999, 'quantity')
            shopItem.quantity = body.quantity
        }

        if (body.price || body.price === 0) {
            isTypeOf(body.price, 'number', 'price')
            isBigger(body.price, 0, 'price')
            shopItem.price = body.price
        }

        if (body.categoryId) {
            isTypeOf(body.categoryId, 'string', 'category id')
            const category = await CategoryRecord.getOne(body.categoryId);
            isNull(category, null,'category does not exists')
            shopItem.categoryId = body.categoryId
        }

        console.log(body.price, 'price')

        await shopItem.update();

        res.json(shopItem)
    })

    .delete('/:shopItemId', async (req, res) => {

        exists(req.params.shopItemId, 'shop item id param')
        const shopItem = await ShopItemRecord.getOne(req.params.shopItemId);

        isNull(shopItem, null,'No shopItem found for this ID.')

        await shopItem.delete();
        res.json({message: "shop item deleted successfully."})
    });
