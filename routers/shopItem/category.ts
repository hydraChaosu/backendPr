import {Router} from "express";
import {CategoryRecord} from "../../records";
import {exists, isNull} from "../../utils/dataCheck";

export const categoryRouter = Router();

categoryRouter

    .get('/all', async (req, res) => {
        const categoryList = await CategoryRecord.listAll();

        res.json({
            categoryList,
        })
    })
    .get('/one/:id', async (req, res) => {

        const {id} = req.params;
        exists(id, 'id param')
        const category = await CategoryRecord.getOne(id);
        isNull(category, null,'category does not exists')

        res.json({
            category,
        })
    })
