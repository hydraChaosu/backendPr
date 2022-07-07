import express from "express"
import 'express-async-errors';
import {itemInBasketRouter, personalInfoRouter, shopItemRouter, userRouter} from "./routers";
import {categoryRouter} from "./routers";
import cors from "cors";
import {handleError} from "./utils/errors";

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

app.use(handleError)

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});

//auth
//admin
// statystyki recordow


