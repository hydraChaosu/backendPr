import {Router} from "express";
import {PersonalInfoRecord, UserRecord} from "../../records";
import {exists, isBetween, isNull, isTypeOf} from "../../utils/dataCheck";
import {
    AdminLoginUserReq,
    AdminSetUserCategoryReq,
    DeleteOneUserReq,
    IsAdminRequest, PersonalInfoCreateReq,
    UserEntity
} from "../../types";
import {CreateUserReq} from "../../types";
import {AuthInvalidError, ValidationError} from "../../utils/errors";
import {generateAccessToken} from "../../utils/generateToken";
import {adminToken} from '../../middleware/auth'
const bcrypt = require('bcrypt');
const saltRounds = 10;

export const adminUserRouter = Router();

adminUserRouter

    .get('/user/all', adminToken,async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const userList = await UserRecord.listAll();

        res.json({
            userList,
        })
    })
    .get('/user/one/:id', adminToken, async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const {id} = req.params;
        exists(id, 'id param')

        const user = await UserRecord.getOne(id);
        isNull(user, null,'user does not exists')

        res.json({
            user,
        })
    })
    .post('/user/register', adminToken, async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const { body } : {
            body: CreateUserReq
        } = req

        exists(body.login, 'login')
        isTypeOf(body.login, 'string', 'login')
        const isLoginUsed = await UserRecord.isLoginUsed(body.login);
        if (isLoginUsed) {
            throw new ValidationError('login is already in use')
        }

        exists(body.email, 'email')
        isTypeOf(body.email, 'string', 'email')
        const isEmailUsed = await UserRecord.isEmailUsed(body.email);
        if (isEmailUsed) {
            throw new ValidationError('email is already in use')
        }
        exists(body.password, 'password')
        isTypeOf(body.password, 'string', 'password')
        isBetween(body.password.length, 3, 60, 'password length')
        const hashedPassword = await bcrypt.hash(body.password, saltRounds).then(function(hash:string) {
            body.password = hash
        });

        const user = new UserRecord(req.body as CreateUserReq);
        await user.insert();

        const personalInfoTemp = {
            userId: user.id,
            name: null,
            surname: null,
            city: null,
            country: null,
            street: null,
            buildingNumber: null,
            postalCode: null
        } as PersonalInfoCreateReq
        const newPersonalInfo = new PersonalInfoRecord(personalInfoTemp);
        await newPersonalInfo.insert();

        res.json(user as UserEntity);
    })
    .post('/user/login',adminToken, async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const { body: { id} } : {
            body: AdminLoginUserReq
        } = req

        exists(id, 'id')
        isTypeOf(id, 'string', 'id')
        const user = await UserRecord.getOne(id);
        isNull(user, null,'user does not exists')

        const token = generateAccessToken( {id: user.id, email: user.email} )
        res.json({token});

    })


    .patch('/user', adminToken, async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const { body } : {
            body: AdminSetUserCategoryReq
        } = req

        exists(body.id, 'user id param')
        const user = await UserRecord.getOne(body.id);
        isNull(user, null,'user does not exists')

        if (body.login) {
            isTypeOf(body.login, 'string', 'login')
            isBetween(body.login.length, 3, 20, 'login length')
            const isLoginUsed = await UserRecord.isLoginUsed(body.login);
            if (isLoginUsed) {
                throw new ValidationError('login is already in use')
            }
            user.login = body.login
        }

        if (body.password) {
            isTypeOf(body.password, 'string', 'password')
            isBetween(body.password.length, 3, 60, 'password length')
            const hashedPassword = await bcrypt.hash(body.password, saltRounds).then(function(hash:string) {
                body.password = hash
            });
            user.password = body.password
        }

        if (body.email) {
            isTypeOf(body.email, 'string', 'email')
            if (!body.email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )) {
                throw new ValidationError('email is not correct');
            }
            isBetween(body.email.length, 3, 40, 'email length')
            const isEmailUsed = await UserRecord.isEmailUsed(body.email);
            if (isEmailUsed) {
                throw new ValidationError('email is already in use')
            }
            user.email = body.email
        }

        await user.update();

        res.json(user)
    })

    .delete('/user', adminToken,async (req: IsAdminRequest, res) => {

        if (!req.isAdmin) throw new AuthInvalidError()

        const { body: {id} } : {
            body: DeleteOneUserReq
        } = req

        exists(id, 'user id param')
        const user = await UserRecord.getOne(id);
        isNull(user, null,'No user found for this ID.')

        await user.delete();
        res.json({message: "user deleted successfully."})
    });
