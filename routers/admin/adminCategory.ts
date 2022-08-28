import { Response, Router } from "express";
import {
  CategoryEntity,
  CreateCategoryReq,
  DeleteItemInBasketRequest,
  SetCategoryForCategoryReq,
  UpdateCategoryForCategoryReq,
  UserAuthReq,
} from "../../types";
import {
  exists,
  isBetweenEqual,
  isNotNull,
  isNull,
  isTypeOf,
} from "../../utils/dataCheck";
import { CategoryRecord } from "../../records";

export const adminCategoryRouter = Router();

adminCategoryRouter
  .get("/all", async (req: UserAuthReq, res: Response) => {
    const categoryList = await CategoryRecord.listAll();

    res.json(categoryList as CategoryEntity[]);
  })

  .get("/:name", async (req: UserAuthReq, res: Response) => {
    const { name } = req.params;
    exists(name, "name param");

    const category = await CategoryRecord.getOneByName(name);
    isNull(category, null, "category does not exists");

    res.json(category as CategoryEntity);
  })
  .get("/one/:id", async (req: UserAuthReq, res: Response) => {
    const { id } = req.params;
    exists(id, "id param");

    const category = await CategoryRecord.getOne(id);
    isNull(category, null, "category does not exists");

    res.json(category as CategoryEntity);
  })
  .post("/", async (req: UserAuthReq, res: Response) => {
    const {
      body: { name },
    }: {
      body: SetCategoryForCategoryReq;
    } = req;

    const category = await CategoryRecord.getOneByName(name);
    isNotNull(category, null, "category with this name already exists");

    const newCategory = new CategoryRecord(req.body as CreateCategoryReq);
    await newCategory.insert();

    res.json(newCategory as CategoryEntity);
  })

  .patch("/", async (req: UserAuthReq, res: Response) => {
    const {
      body: { name, id },
    }: {
      body: UpdateCategoryForCategoryReq;
    } = req;

    exists(id, "category Id");
    isTypeOf(id, "string", "category id");
    const category = await CategoryRecord.getOne(id);
    isNull(category, null, "No category found for this ID.");

    exists(name, "name");
    isTypeOf(name, "string", "name");
    const categoryName = await CategoryRecord.getOneByName(name);
    isNotNull(categoryName, null, "category with this name already exists");
    isBetweenEqual(name.length, 3, 20, "category");

    category.name = name;
    await category.update();

    res.json(category as CategoryEntity);
  })

  .delete("/", async (req: UserAuthReq, res: Response) => {
    const {
      body: { id },
    }: {
      body: DeleteItemInBasketRequest;
    } = req;

    exists(id, "category Id");
    isTypeOf(id, "string", "category id");
    const category = await CategoryRecord.getOne(id);
    isNull(category, null, "No category found for this ID.");

    await category.delete();
    res.json({ message: "Category deleted successfully." });
  });
