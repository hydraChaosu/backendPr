import {Router} from "express";
import {CategoryRecord} from "../../records";
import {CategoryEntity, CreateCategoryReq, SetCategoryForCategoryReq} from "../../types";
import {exists, isBetweenEqual, isNotNull, isNull} from "../../utils/dataCheck";
export const categoryRouter = Router();
const errorInfoName = 'category'

categoryRouter

    .get('/all', async (req, res) => {
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
        const categoryName = await CategoryRecord.getOneByName(body.name);
        isNotNull(categoryName, null,'category with this name already exists')
        isBetweenEqual(body.name.length, 3, 20, errorInfoName)

        category.name = body.name;
        await category.update();

        res.json(category)
    })

    .delete('/:categoryId', async (req, res) => {
        exists(req.params.categoryId, 'categoryId')
        const category = await CategoryRecord.getOne(req.params.categoryId);
        isNull(category, null,'No category found for this ID.')

        await category.delete();
    res.json({message: "Category deleted successfully."})
});
