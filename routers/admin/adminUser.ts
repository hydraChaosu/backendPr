import { Response, Router } from "express";
import { PersonalInfoRecord, UserRecord } from "../../records";
import { exists, isBetween, isNull, isTypeOf } from "../../utils/dataCheck";
import {
  AdminLoginUserReq,
  AdminSetUserCategoryReq,
  CreateUserReq,
  DeleteOneUserReq,
  PersonalInfoCreateReq,
  UserAuthReq,
  UserEntity,
} from "../../types";
import { ValidationError } from "../../utils/errors";
import { generateAuthToken } from "../../utils/generateToken";

const bcrypt = require("bcrypt");
const saltRounds = 10;

export const adminUserRouter = Router();

adminUserRouter

  .get("/all", async (req: UserAuthReq, res: Response) => {
    const userList = await UserRecord.listAll();

    res.json(userList as UserEntity[]);
  })
  .get("/one/:id", async (req: UserAuthReq, res: Response) => {
    const { id } = req.params;
    exists(id, "id param");

    const user = await UserRecord.getOne(id);
    isNull(user, null, "user does not exists");

    res.json(user as UserEntity);
  })
  .post("/register", async (req: UserAuthReq, res: Response) => {
    const {
      body,
    }: {
      body: CreateUserReq;
    } = req;

    exists(body.login, "login");
    isTypeOf(body.login, "string", "login");
    const isLoginUsed = await UserRecord.isLoginUsed(body.login);
    if (isLoginUsed) {
      throw new ValidationError("login is already in use");
    }

    exists(body.email, "email");
    isTypeOf(body.email, "string", "email");
    const isEmailUsed = await UserRecord.isEmailUsed(body.email);
    if (isEmailUsed) {
      throw new ValidationError("email is already in use");
    }
    exists(body.password, "password");
    isTypeOf(body.password, "string", "password");
    isBetween(body.password.length, 3, 60, "password length");
    const hashedPassword = await bcrypt
      .hash(body.password, saltRounds)
      .then(function (hash: string) {
        body.password = hash;
      });

    const user = new UserRecord(req.body as CreateUserReq);
    await user.insert();

    const personalInfoTemp = {
      userId: user.id,
      name: null,
      surname: null,
      city: null,
      country: null,
      street: null,
      buildingNumber: null,
      postalCode: null,
    } as PersonalInfoCreateReq;
    const newPersonalInfo = new PersonalInfoRecord(personalInfoTemp);
    await newPersonalInfo.insert();

    res.json(user as UserEntity);
  })
  .post("/login", async (req: UserAuthReq, res: Response) => {
    const {
      body: { id },
    }: {
      body: AdminLoginUserReq;
    } = req;

    exists(id, "id");
    isTypeOf(id, "string", "id");
    const user = await UserRecord.getOne(id);
    isNull(user, null, "user does not exists");

    const token = generateAuthToken(user);
    res.json({ token });
  })

  .patch("/", async (req: UserAuthReq, res: Response) => {
    const {
      body,
    }: {
      body: AdminSetUserCategoryReq;
    } = req;

    exists(body.id, "user id");
    const user = await UserRecord.getOne(body.id);
    isNull(user, null, "user does not exists");

    if (body.login) {
      isTypeOf(body.login, "string", "login");
      isBetween(body.login.length, 3, 20, "login length");
      const isLoginUsed = await UserRecord.isLoginUsed(body.login);
      if (isLoginUsed) {
        throw new ValidationError("login is already in use");
      }
      user.login = body.login;
    }

    if (body.password) {
      isTypeOf(body.password, "string", "password");
      isBetween(body.password.length, 3, 60, "password length");
      const hashedPassword = await bcrypt
        .hash(body.password, saltRounds)
        .then(function (hash: string) {
          body.password = hash;
        });
      user.password = body.password;
    }

    if (body.email) {
      isTypeOf(body.email, "string", "email");
      if (!body.email.match(/@/)) {
        throw new ValidationError("email is not correct");
      }
      isBetween(body.email.length, 3, 40, "email length");
      const isEmailUsed = await UserRecord.isEmailUsed(body.email);
      if (isEmailUsed) {
        throw new ValidationError("email is already in use");
      }
      user.email = body.email;
    }

    await user.update();

    res.json(user as UserEntity);
  })

  .delete("/", async (req: UserAuthReq, res: Response) => {
    const {
      body: { id },
    }: {
      body: DeleteOneUserReq;
    } = req;

    exists(id, "user id");
    const user = await UserRecord.getOne(id);
    isNull(user, null, "No user found for this ID.");

    await user.delete();
    res.json({ message: "user deleted successfully." });
  });
