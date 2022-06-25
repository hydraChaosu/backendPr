import express from "express"
import 'express-async-errors';
import {giftRouter} from "./routers/gift";
import cors from "cors";
import {handleError} from "./utils/errors";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json()); // Content-type: application/json

app.use('/gift', giftRouter);

app.use(handleError)

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});
