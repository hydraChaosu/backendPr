import {Router} from "express";
import { UserRecord} from "../../records";
import {exists, isBetween, isNull, isTypeOf} from "../../utils/dataCheck";
import {UserEntity} from "../../types";
import {CreateUserReq, LoginUserReq, SetUserCategoryReq} from "../../types/user/user";
import {ValidationError} from "../../utils/errors";
const bcrypt = require('bcrypt');
const saltRounds = 10;

export const userRouter = Router();

userRouter

    .get('/all', async (req, res) => {
        const userList = await UserRecord.listAll();

        res.json({
            userList,
        })
    })
    .get('/one/:id', async (req, res) => {
        exists(req.params.id, 'id param')
        const user = await UserRecord.getOne(req.params.id);
        isNull(user, null,'user does not exists')

        res.json({
            user,
        })
    })
    .post('/register', async (req, res) => {
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

        const newShopItem = new UserRecord(req.body as CreateUserReq);
        await newShopItem.insert();

        res.json(newShopItem as UserEntity);
    })
    .post('/login', async (req, res) => {
        const { body } : {
            body: LoginUserReq
        } = req

        exists(body.login, 'login')
        isTypeOf(body.login, 'string', 'login')
        const user = await UserRecord.getOneByLogin(body.login);
        isNull(user, null,'shopItem does not exists')

        exists(body.password, 'password')
        isTypeOf(body.password, 'string', 'password')
        isBetween(body.password.length, 3, 60, 'password length')

        const match = await bcrypt.compare(body.password, user.password);
        if (match) {
            res.json({loggin: true});
        } else {
            throw new ValidationError('Password does not match')
        }

    })


    .patch('/:userId', async (req, res) => {
        const { body } : {
            body: SetUserCategoryReq
        } = req

        exists(req.params.userId, 'user id param')
        const user = await UserRecord.getOne(req.params.userId);
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

    .delete('/:userId', async (req, res) => {

        exists(req.params.userId, 'user id param')
        const user = await UserRecord.getOne(req.params.userId);

        isNull(user, null,'No user found for this ID.')

        await user.delete();
        res.json({message: "user deleted successfully."})
    });
