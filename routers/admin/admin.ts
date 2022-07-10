import {Router} from "express";
import {exists, isTypeOf} from "../../utils/dataCheck";
import { AdminLoginRequest } from "../../types";
import {generateAdminAccessToken} from "../../utils/generateToken";
import { ValidationError} from "../../utils/errors";

export const adminRouter = Router();

adminRouter
    .post('/login',
        async (req, res) => {
        const { body: {login, password} } : { body: AdminLoginRequest } = req
        exists(login, 'admin login')
        isTypeOf(login, 'string', 'login')
        exists(password, 'admin password')
        isTypeOf(password, 'string', 'password')

        if (login !== process.env.ADMIN_USER) {
            throw new ValidationError('wrong login')
        }

        if (password !== process.env.ADMIN_PASSWORD) {
            throw new ValidationError('wrong password')
        }

        const token = generateAdminAccessToken( {id: process.env.ADMIN_ID} )
        res.json({token});
    })
    .post('/logout', async (req, res) => {

    })

//TODO logout
