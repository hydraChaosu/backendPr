import {Router} from "express";
import {PersonalInfoRecord} from "../../records";
import {PersonalInfoEntity, UserAuthReq} from "../../types";
import { isNull, isSmaller, isTypeOf} from "../../utils/dataCheck";
import {SetPersonalInfoReq} from "../../types";
import {authenticateToken} from "../../middleware/auth";
import {AuthInvalidError, InvalidTokenError} from "../../utils/errors";
export const personalInfoRouter = Router();

personalInfoRouter

    .get('/', authenticateToken,async (req: UserAuthReq, res) => {

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        const personalInfo = await PersonalInfoRecord.getUserInfo(reqUserId);
        isNull(personalInfo, null,'personalInfo does not exists')

        if (personalInfo.userId !== reqUserId) throw new AuthInvalidError()

        res.json(personalInfo as PersonalInfoEntity)
    })
       .patch('/',authenticateToken, async (req: UserAuthReq, res) => {
        const { body } : {
            body: SetPersonalInfoReq
        } = req

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        const personalInfo = await PersonalInfoRecord.getUserInfo(reqUserId);
        isNull(personalInfo, null,'Personal Info does not exists')

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

        res.json(personalInfo as PersonalInfoEntity)
    })
