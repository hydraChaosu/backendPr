import {NextFunction} from "express";
import {Request, Response} from "express/ts4.0";
import {AuthInvalidError, TokenError} from "../utils/errors";

const jwt = require('jsonwebtoken');

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[0]

    if (token == null) {
        throw new TokenError()
    }

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        console.log(err)

        if (err) throw new AuthInvalidError()

        // @ts-ignore
        req.user = user

        next()
    })
}

export function adminToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['admin-authorization']
    let token = null
    if (typeof authHeader === "string") {
        token = authHeader && authHeader.split(' ')[0]
    }

    if (token == null) {
        throw new TokenError()
    }

    jwt.verify(token, process.env.ADMIN_SECRET as string, (err: any, user: any) => {
        console.log(err)

        if (err) throw new AuthInvalidError()

        // @ts-ignore
        req.isAdmin = true

        next()
    })
}
