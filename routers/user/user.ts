import {Router} from "express";
import {PersonalInfoRecord, UserRecord} from "../../records";
import {exists, isBetween, isNull, isTypeOf} from "../../utils/dataCheck";
import { PersonalInfoCreateReq, UserAuthReq, UserEntity} from "../../types";
import {CreateUserReq, LoginUserReq, SetUserCategoryReq} from "../../types";
import {AuthInvalidError, InvalidTokenError, ValidationError} from "../../utils/errors";
import {generateAccessToken} from "../../utils/generateToken";
import {authenticateToken} from '../../middleware/auth'
const bcrypt = require('bcrypt');
const saltRounds = 10;

export const userRouter = Router();

userRouter

    .get('/one', authenticateToken, async (req: UserAuthReq, res) => {

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        exists(reqUserId, 'id param')
        isTypeOf(reqUserId, 'string', 'user id')
        const user = await UserRecord.getOne(reqUserId);
        isNull(user, null,'user does not exists')

        if (user.id !== reqUserId) throw new AuthInvalidError()

        res.json({
            user,
        })
    })
    .post('/register', async (req: UserAuthReq, res) => {
        const { body } : {
            body: CreateUserReq
        } = req

        if (req.user) {
            res.json({"message": "already logged in"})
        }

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
    .post('/login', async (req: UserAuthReq, res) => {
        const { body } : {
            body: LoginUserReq
        } = req

        if (req.user) {
            res.json({"message": "already logged in"})
        }

        exists(body.login, 'login')
        isTypeOf(body.login, 'string', 'login')
        const user = await UserRecord.getOneByLogin(body.login);
        isNull(user, null,'shopItem does not exists')

        exists(body.password, 'password')
        isTypeOf(body.password, 'string', 'password')
        isBetween(body.password.length, 3, 60, 'password length')

        const match = await bcrypt.compare(body.password, user.password);
        if (match) {
            const token = generateAccessToken( {id: user.id, email: user.email} )
            res.json({token});
        } else {
            throw new ValidationError('Password does not match')
        }

    })


    .patch('/',authenticateToken, async (req: UserAuthReq, res) => {
        const { body } : {
            body: SetUserCategoryReq
        } = req

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        exists(reqUserId, 'user id param')
        const user = await UserRecord.getOne(reqUserId);
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

    .delete('/', authenticateToken, async (req: UserAuthReq, res) => {

        const { id: reqUserId } = req.user
        if (!reqUserId) throw new InvalidTokenError()

        exists(reqUserId, 'user id param')
        const user = await UserRecord.getOne(reqUserId);

        isNull(user, null,'No user found for this ID.')

        if (user.id !== reqUserId) throw new AuthInvalidError()

        await user.delete();
        res.json({message: "user deleted successfully."})
    });
