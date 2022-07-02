import {Router} from "express";
import {CategoryRecord} from "../../records";
import {CategoryEntity, CreateCategoryReq, SetCategoryForCategoryReq} from "../../types";
import {exists, isBetween, isNotNull, isNull, isTypeOf} from "../../utils/dataCheck";
export const categoryRouter = Router();
const errorInfoName = 'category'

categoryRouter

    .get('/', async (req, res) => {
        const categoryList = await CategoryRecord.listAll();

        res.json({
            categoryList,
        })
    })

    .post('/', async (req, res) => {
        const { body } : {
            body: SetCategoryForCategoryReq
        } = req

        exists(body.name, 'name')
        const category = await CategoryRecord.getOneByName(body.name);

        isNotNull(category, null,'category with this name already exists')
        isBetween(body.name, 3, 50, errorInfoName)

        const newCategory = new CategoryRecord(req.body as CreateCategoryReq);
        await newCategory.insert();

        res.json(newCategory as CategoryEntity);
    })

    .patch('/:categoryId', async (req, res) => {
        const { body } : {
            body: SetCategoryForCategoryReq
        } = req

        exists(req.params.categoryId, 'category Id')
        const category = await CategoryRecord.getOne(req.params.categoryId);
        isNull(category, null,'No category found for this ID.')
        exists(body.name, 'name')
        isBetween(body.name, 3, 50, errorInfoName)

        category.name = body.name;
        await category.update();

        res.json(category)
    })

    .delete('/:categoryId', async (req, res) => {
    const category = await CategoryRecord.getOne(req.params.categoryId);

        exists(req.params.categoryId, 'categoryId')
        isNull(category, null,'No category found for this ID.')

        await category.delete();
    res.json({message: "Category deleted successfully."})
});
