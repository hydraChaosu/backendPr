import express from "express"
import 'express-async-errors';
import {personalInfoRouter, shopItemRouter} from "./routers";
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

app.use(handleError)

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});

//basket item
//getOneById category, shopitem, personal, iteminbasket
//user
//auth
//admin
// like
// statystyki recordow


