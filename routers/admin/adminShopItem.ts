import {Router} from "express";
import {adminToken} from "../../middleware/auth";
import {CategoryRecord, ShopItemRecord} from "../../records";
import {exists, isBetween, isBigger, isNotNull, isNull, isSmaller, isTypeOf} from "../../utils/dataCheck";
import {
    DeleteOneShopItemReq,
    SetShopItemCategoryReq,
    ShopItemCreateReq
} from "../../types";
import {IsAdminRequest, ShopItemEntity} from "../../types";
import {AuthInvalidError} from "../../utils/errors";

export const adminShopItemRouter = Router();

adminShopItemRouter
    .get('/all', adminToken, async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const shopItemList = await ShopItemRecord.listAll();

        res.json(shopItemList)
    })
    .get('/all/category/:categoryId',adminToken, async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const {categoryId} = req.params;
        exists(categoryId, 'id param')

        const category = await CategoryRecord.getOne(categoryId);
        isNull(category, null,'category does not exists')
        const shopItemList = await ShopItemRecord.listAllByCategory(categoryId);

        res.json(shopItemList)
    })
    .get('/all/name/:name', adminToken,async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const {name} = req.params;
        exists(name, 'name')

        const shopItemList = await ShopItemRecord.getOneByName(name);
        isNull(shopItemList, null,'shopItemList does not exists')

        res.json(shopItemList)
    })
    .get('/one/:id',adminToken, async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const {id} = req.params;
        exists(id, 'id param')

        const shopItem = await ShopItemRecord.getOne(id);
        isNull(shopItem, null,'shopItem does not exists')

        res.json(shopItem)
    })
    .post('/',adminToken, async (req: IsAdminRequest, res) => {
        let { body: {categoryId, name, quantity, price, img} } : {
            body: ShopItemCreateReq
        } = req

        if (!req.isAdmin) throw new AuthInvalidError()

        exists(name, 'name')
        isTypeOf(name, 'string', 'name')
        const shopItem = await ShopItemRecord.getOneByName(name);
        isNotNull(shopItem, null,'shop item with this name already exists')

        exists(categoryId, 'category id')
        isTypeOf(categoryId, 'string', 'category id')
        const category = await CategoryRecord.getOne(categoryId);
        isNull(category, null,'category does not exists')

        name = name ? name : null
        quantity = quantity ? quantity : null
        price = price ? price : null
        categoryId = categoryId ? categoryId : null
        img = img ? img : null

        const newShopItem = new ShopItemRecord({name, quantity, price, categoryId, img} as ShopItemCreateReq);
        await newShopItem.insert();

        res.json(newShopItem as ShopItemEntity);
    })

    .patch('/', adminToken, async (req: IsAdminRequest, res) => {
        const { body: {categoryId, img, name, price, quantity, id} } : {
            body: SetShopItemCategoryReq
        } = req

        if (!req.isAdmin) throw new AuthInvalidError()

        exists(id, 'shop item id')
        isTypeOf(id, 'string', 'id')
        const shopItem = await ShopItemRecord.getOne(id);
        isNull(shopItem, null,'shop item does not exists')

        if (name) {
            isTypeOf(name, 'string', 'name')
            isBetween(name, 3, 50, 'name')
            const shopItemCheck = await ShopItemRecord.getOneByName(name);
            isNotNull(shopItemCheck, null,'shop item with this name already exists')
            shopItem.name = name
        }

        if (img) {
            isTypeOf(img, 'string', 'img')
            isSmaller(img.length, 50, 'img')
            shopItem.img = img
        }

        if (quantity || quantity === 0) {
            isTypeOf(quantity, 'number', 'quantity')
            isBetween(quantity, 0, 9999, 'quantity')
            shopItem.quantity = quantity
        }

        if (price || price === 0) {
            isTypeOf(price, 'number', 'price')
            isBigger(price, 0, 'price')
            shopItem.price = price
        }

        if (categoryId) {
            isTypeOf(categoryId, 'string', 'category id')
            const category = await CategoryRecord.getOne(categoryId);
            isNull(category, null,'category does not exists')
            shopItem.categoryId = categoryId
        }

        await shopItem.update();

        res.json(shopItem)
    })

    .delete('/', adminToken,async (req: IsAdminRequest, res) => {

        const { body: { id } } : {
            body: DeleteOneShopItemReq
        } = req

        if (!req.isAdmin) throw new AuthInvalidError()

        exists(id, 'shop item id')
        isTypeOf(id, 'string', 'id')
        const shopItem = await ShopItemRecord.getOne(id);

        isNull(shopItem, null,'No shopItem found for this ID.')

        await shopItem.delete();
        res.json({message: "shop item deleted successfully."})
    });
