import { Router } from "express";
import { adminToken } from "../../middleware/auth";
import {
  CategoryEntity,
  CreateCategoryReq,
  IsAdminRequest,
  SetCategoryForCategoryReq,
  UpdateCategoryForCategoryReq,
} from "../../types";
import { AuthInvalidError } from "../../utils/errors";
import {
  exists,
  isBetweenEqual,
  isNotNull,
  isNull,
  isTypeOf,
} from "../../utils/dataCheck";
import { CategoryRecord } from "../../records";
import { DeleteItemInBasketRequest } from "../../types";

export const adminCategoryRouter = Router();

adminCategoryRouter
  .get("/all", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    const categoryList = await CategoryRecord.listAll();

    res.json(categoryList as CategoryEntity[]);
  })

  .get("/:name", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    const { name } = req.params;
    exists(name, "name param");

    const category = await CategoryRecord.getOneByName(name);
    isNull(category, null, "category does not exists");

    res.json(category as CategoryEntity);
  })
  .get("/one/:id", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    const { id } = req.params;
    exists(id, "id param");

    const category = await CategoryRecord.getOne(id);
    isNull(category, null, "category does not exists");

    res.json(category as CategoryEntity);
  })
  .post("/", adminToken, async (req: IsAdminRequest, res) => {
    const {
      body: { name },
    }: {
      body: SetCategoryForCategoryReq;
    } = req;

    if (!req.isAdmin) throw new AuthInvalidError();

    const category = await CategoryRecord.getOneByName(name);
    isNotNull(category, null, "category with this name already exists");

    const newCategory = new CategoryRecord(req.body as CreateCategoryReq);
    await newCategory.insert();

    res.json(newCategory as CategoryEntity);
  })

  .patch("/", adminToken, async (req: IsAdminRequest, res) => {
    const {
      body: { name, id },
    }: {
      body: UpdateCategoryForCategoryReq;
    } = req;

    if (!req.isAdmin) throw new AuthInvalidError();

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

  .delete("/", adminToken, async (req: IsAdminRequest, res) => {
    const {
      body: { id },
    }: {
      body: DeleteItemInBasketRequest;
    } = req;

    if (!req.isAdmin) throw new AuthInvalidError();

    exists(id, "category Id");
    isTypeOf(id, "string", "category id");
    const category = await CategoryRecord.getOne(id);
    isNull(category, null, "No category found for this ID.");

    await category.delete();
    res.json({ message: "Category deleted successfully." });
  });
