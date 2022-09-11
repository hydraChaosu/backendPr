import { Request, Response, Router } from "express";
import { CategoryRecord } from "../../records";
import { exists, isNull } from "../../utils/dataCheck";
import { CategoryEntity } from "../../types";

export const categoryRouter = Router();

categoryRouter

  .get("/all", async (req: Request, res: Response) => {
    const categoryList = await CategoryRecord.listAll();
    res.json(categoryList as CategoryEntity[]);
  })
  .get("/one/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    exists(id, "id param");
    const category = await CategoryRecord.getOne(id);
    isNull(category, null, "category does not exists");

    res.json(category as CategoryEntity);
  });
