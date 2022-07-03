import {Router} from "express";
import {CategoryRecord, ItemInBasketRecord, PersonalInfoRecord, ShopItemRecord, UserRecord} from "../../records";
import {PersonalInfoCreateReq, PersonalInfoEntity} from "../../types";
import {exists, isNotNull, isNull, isSmaller, isTypeOf} from "../../utils/dataCheck";
import {SetPersonalInfoReq} from "../../types";
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
            body: PersonalInfoCreateReq
        } = req

        exists(body.userId, 'user id')
        isTypeOf(body.userId, 'string', 'user Id')

        const user = await UserRecord.getOne(body.userId);
        isNull(user, null,'user does not exists')

        const personalInfo = await PersonalInfoRecord.getUserInfo(body.userId)
        isNotNull(personalInfo, '', 'this user already has personal info')

        if (body.name) {
            isTypeOf(body.name, 'string', 'name')
            isSmaller(body.name.length, 45,'', 'name is longer than 45 characters')
        } else {
            body.name = null
        }

        if (body.surname) {
            isTypeOf(body.surname, 'string', 'surname')
            isSmaller(body.surname.length, 47, '', 'surname is longer than 47 characters')
        } else {
            body.surname = null
        }

        if (body.city) {
            isTypeOf(body.city, 'string', 'city')
            isSmaller(body.city.length, 85, '', 'city name is longer than 85 characters')
        } else {
            body.city = null
        }

        if (body.country) {
            isTypeOf(body.country, 'string', 'country')
            isSmaller(body.country.length, 56, '', 'country nam is longer than 56 characters')
        } else {
            body.country = null
        }

        if (body.street) {
            isTypeOf(body.street, 'string', 'street')
            isSmaller(body.street.length, 85, '', 'street name is longer than 85 characters')
        } else {
            body.street = null
        }

        if (body.buildingNumber) {
            isTypeOf(body.buildingNumber, 'string', 'buildingNumber')
            isSmaller(body.buildingNumber.length, 10, '', 'building number is longer than 10 characters')
        } else {
            body.buildingNumber = null
        }

        if (body.postalCode) {
            isTypeOf(body.postalCode, 'string', 'postalCode')
            isSmaller(body.postalCode.length, 6, '', 'postal code number is longer than 6 characters')
        } else {
            body.postalCode = null
        }

        const newPersonalInfo = new PersonalInfoRecord(req.body as PersonalInfoCreateReq);
        await newPersonalInfo.insert();


        res.json(newPersonalInfo as PersonalInfoEntity);
    })

    .patch('/:personalInfoId', async (req, res) => {
        const { body } : {
            body: SetPersonalInfoReq
        } = req

        exists(req.params.personalInfoId, 'personal Info Id param')
        const personalInfo = await PersonalInfoRecord.getOne(req.params.personalInfoId);
        isNull(personalInfo, null,'Personal Info does not exists')

        console.log(body.name, 'name')

        if (body.name) {
            isTypeOf(body.name, 'string', 'name')
            isSmaller(body.name.length, 45,'', 'name is longer than 45 characters')
            personalInfo.name = body.name
        }

        if (body.surname) {
            isTypeOf(body.surname, 'string', 'surname')
            isSmaller(body.surname.length, 47, '', 'surname is longer than 47 characters')
            personalInfo.surname = body.surname
        }

        if (body.city) {
            isTypeOf(body.city, 'string', 'city')
            isSmaller(body.city.length, 85, '', 'city name is longer than 85 characters')
            personalInfo.city = body.city
        }

        if (body.country) {
            isTypeOf(body.country, 'string', 'country')
            isSmaller(body.country.length, 56, '', 'country nam is longer than 56 characters')
            personalInfo.country = body.country
        }

        if (body.street) {
            isTypeOf(body.street, 'string', 'street')
            isSmaller(body.street.length, 85, '', 'street name is longer than 85 characters')
            personalInfo.street = body.street
        }

        if (body.buildingNumber) {
            isTypeOf(body.buildingNumber, 'string', 'buildingNumber')
            isSmaller(body.buildingNumber.length, 10, '', 'building number is longer than 10 characters')
            personalInfo.buildingNumber = body.buildingNumber
        }

        if (body.postalCode) {
            isTypeOf(body.postalCode, 'string', 'postalCode')
            isSmaller(body.postalCode.length, 6, '', 'postal code number is longer than 6 characters')
            personalInfo.postalCode = body.postalCode
        }

        await personalInfo.update();

        res.json(personalInfo)
    })

    .delete('/:personalInfoId', async (req, res) => {

        exists(req.params.personalInfoId, 'shop item id param')
        const personalInfo = await PersonalInfoRecord.getOne(req.params.personalInfoId);

        isNull(personalInfo, null,'No shopItem found for this ID.')

        await personalInfo.delete();
        res.json({message: "personal Info deleted successfully."})
    });
