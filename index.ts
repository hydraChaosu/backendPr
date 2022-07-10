import express from "express"
import 'express-async-errors';
import {
    adminCategoryRouter,
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

app.use(handleError)

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});

//shopitem
//user
//personal info
//basketinitems

// export tests
// readme

// normalne testy

// statystyki recordow

//eslint

//prettier

//TODO express validator
//TODO passport

//react
