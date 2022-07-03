import {Router} from "express";
import {CategoryRecord, ShopItemRecord} from "../../records";
import { ShopItemEntity} from "../../types";
import {SetShopItemCategoryReq, ShopItemCreateReq} from "../../types/shop/shopItem";
import {exists, isNotNull, isNull, isTypeOf} from "../../utils/dataCheck";
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

        shopItem.name = body.name ? body.name : shopItem.name
        shopItem.quantity = body.quantity ? body.quantity : shopItem.quantity
        shopItem.price = body.price ? body.price : shopItem.price
        shopItem.categoryId = body.categoryId ? body.categoryId : shopItem.categoryId
        shopItem.img = body.img ? body.img : shopItem.img

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
