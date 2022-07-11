import express from "express"
import 'express-async-errors';
import {
    adminCategoryRouter, adminItemInBasketRouter,
    adminRouter, adminShopItemRouter,
    itemInBasketRouter,
    personalInfoRouter,
    shopItemRouter,
    userRouter
} from "./routers";
import {categoryRouter} from "./routers";
import cors from "cors";
import {handleError} from "./utils/errors";
import 'dotenv/config'
import { adminUserRouter } from "./routers/admin/adminUser";
import { adminPersonalInfoRouter } from "./routers/admin/adminPersonalInfo";
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json()); // Content-type: application/json

app.use('/category', categoryRouter);
app.use('/shopItem', shopItemRouter);
app.use('/personalInfo', personalInfoRouter);
app.use('/itemInBasket', itemInBasketRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/admin/category', adminCategoryRouter);
app.use('/admin/shopItem', adminShopItemRouter)
app.use('/admin/user', adminUserRouter);
app.use('/admin/personalInfo', adminPersonalInfoRouter)
app.use('/admin/itemInBasket', adminItemInBasketRouter);

app.use(handleError)

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});

//PN
//basketinitems
// export tests

//more response info

//WT
// readme
//prettier
//eslint

//SR
// normalne testy

//CZ
//send proj
// statystyki recordow

//TODO express validator
//TODO passport
//wlasne validatory szczegolowe

//react

//catch mysql2 errors

//tokens in db
//cashe in db

//logout

//refresh token

//payload standarization

//nest
