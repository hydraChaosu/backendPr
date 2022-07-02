import {Router} from "express";
import {CategoryRecord} from "../../records";
import {CategoryEntity, CreateCategoryReq, SetCategoryForCategoryReq} from "../../types";
import {ValidationError} from "../../utils/errors";
export const categoryRouter = Router();

categoryRouter

    .get('/', async (req, res) => {
        const categoryList = await CategoryRecord.listAll();

        res.json({
            categoryList,
        })
    })

    .post('/', async (req, res) => {
        const newCategory = new CategoryRecord(req.body as CreateCategoryReq);
        await newCategory.insert();

        res.json(newCategory as CategoryEntity);
    })

    .patch('/:categoryId', async (req, res) => {
        const { body } : {
            body: SetCategoryForCategoryReq
        } = req

        const category = await CategoryRecord.getOne(req.params.categoryId);

        if (category === null) {
            throw new ValidationError('No category found for this ID.');
        }

        category.name = body.name;
        await category.update();

        res.json(category)
    })

    .delete('/:categoryId', async (req, res) => {
    const category = await CategoryRecord.getOne(req.params.categoryId);

    if (category === null) {
        throw new ValidationError('No category found for this ID.');
    }

    await category.delete();
    res.json({message: "Category deleted successfully."})
});
