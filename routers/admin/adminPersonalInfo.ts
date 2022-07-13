import { Router } from "express";
import { PersonalInfoRecord, UserRecord } from "../../records";
import {
  AdminDeletePersonalInfoReq,
  AdminSetPersonalInfoReq,
  IsAdminRequest,
  PersonalInfoCreateReq,
  PersonalInfoEntity,
} from "../../types";
import {
  exists,
  isNotNull,
  isNull,
  isSmaller,
  isTypeOf,
} from "../../utils/dataCheck";
import { AuthInvalidError } from "../../utils/errors";
import { adminToken } from "../../middleware/auth";
export const adminPersonalInfoRouter = Router();

adminPersonalInfoRouter

  .get("/all", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    const personalInfoList = await PersonalInfoRecord.listAll();

    res.json(personalInfoList as PersonalInfoEntity[]);
  })
  .get("/one/:id", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    exists(req.params.id, "id param");
    const personalInfo = await PersonalInfoRecord.getOne(req.params.id);
    isNull(personalInfo, null, "shopItem does not exists");

    res.json(personalInfo as PersonalInfoEntity);
  })
  .post("/", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    const {
      body,
    }: {
      body: PersonalInfoCreateReq;
    } = req;

    exists(body.userId, "user id");
    isTypeOf(body.userId, "string", "user Id");
    const user = await UserRecord.getOne(body.userId);
    isNull(user, null, "user does not exists");

    const personalInfo = await PersonalInfoRecord.getUserInfo(body.userId);
    isNotNull(personalInfo, "", "this user already has personal info");

    if (body.name) {
      isTypeOf(body.name, "string", "name");
      isSmaller(body.name.length, 45, "", "name is longer than 45 characters");
    } else {
      body.name = null;
    }

    if (body.surname) {
      isTypeOf(body.surname, "string", "surname");
      isSmaller(
        body.surname.length,
        47,
        "",
        "surname is longer than 47 characters"
      );
    } else {
      body.surname = null;
    }

    if (body.city) {
      isTypeOf(body.city, "string", "city");
      isSmaller(
        body.city.length,
        85,
        "",
        "city name is longer than 85 characters"
      );
    } else {
      body.city = null;
    }

    if (body.country) {
      isTypeOf(body.country, "string", "country");
      isSmaller(
        body.country.length,
        56,
        "",
        "country nam is longer than 56 characters"
      );
    } else {
      body.country = null;
    }

    if (body.street) {
      isTypeOf(body.street, "string", "street");
      isSmaller(
        body.street.length,
        85,
        "",
        "street name is longer than 85 characters"
      );
    } else {
      body.street = null;
    }

    if (body.buildingNumber) {
      isTypeOf(body.buildingNumber, "string", "buildingNumber");
      isSmaller(
        body.buildingNumber.length,
        10,
        "",
        "building number is longer than 10 characters"
      );
    } else {
      body.buildingNumber = null;
    }

    if (body.postalCode) {
      isTypeOf(body.postalCode, "string", "postalCode");
      isSmaller(
        body.postalCode.length,
        6,
        "",
        "postal code number is longer than 6 characters"
      );
    } else {
      body.postalCode = null;
    }

    const newPersonalInfo = new PersonalInfoRecord(
      req.body as PersonalInfoCreateReq
    );
    await newPersonalInfo.insert();

    res.json(newPersonalInfo as PersonalInfoEntity);
  })

  .patch("/", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    const {
      body,
    }: {
      body: AdminSetPersonalInfoReq;
    } = req;

    exists(body.userId, "user id");
    isTypeOf(body.userId, "string", "user Id");
    const user = await UserRecord.getOne(body.userId);
    isNull(user, null, "user does not exists");

    const personalInfo = await PersonalInfoRecord.getUserInfo(user.id);
    isNull(personalInfo, null, "Personal Info does not exists");

    if (body.name) {
      isTypeOf(body.name, "string", "name");
      isSmaller(body.name.length, 45, "", "name is longer than 45 characters");
      personalInfo.name = body.name;
    }

    if (body.surname) {
      isTypeOf(body.surname, "string", "surname");
      isSmaller(
        body.surname.length,
        47,
        "",
        "surname is longer than 47 characters"
      );
      personalInfo.surname = body.surname;
    }

    if (body.city) {
      isTypeOf(body.city, "string", "city");
      isSmaller(
        body.city.length,
        85,
        "",
        "city name is longer than 85 characters"
      );
      personalInfo.city = body.city;
    }

    if (body.country) {
      isTypeOf(body.country, "string", "country");
      isSmaller(
        body.country.length,
        56,
        "",
        "country nam is longer than 56 characters"
      );
      personalInfo.country = body.country;
    }

    if (body.street) {
      isTypeOf(body.street, "string", "street");
      isSmaller(
        body.street.length,
        85,
        "",
        "street name is longer than 85 characters"
      );
      personalInfo.street = body.street;
    }

    if (body.buildingNumber) {
      isTypeOf(body.buildingNumber, "string", "buildingNumber");
      isSmaller(
        body.buildingNumber.length,
        10,
        "",
        "building number is longer than 10 characters"
      );
      personalInfo.buildingNumber = body.buildingNumber;
    }

    if (body.postalCode) {
      isTypeOf(body.postalCode, "string", "postalCode");
      isSmaller(
        body.postalCode.length,
        6,
        "",
        "postal code number is longer than 6 characters"
      );
      personalInfo.postalCode = body.postalCode;
    }

    await personalInfo.update();

    res.json(personalInfo as PersonalInfoEntity);
  })

  .delete("/", adminToken, async (req: IsAdminRequest, res) => {
    if (!req.isAdmin) throw new AuthInvalidError();

    const {
      body,
    }: {
      body: AdminDeletePersonalInfoReq;
    } = req;

    exists(body.id, "personal id");
    const personalInfo = await PersonalInfoRecord.getOne(body.id);

    isNull(personalInfo, null, "No personalInfo found for this ID.");

    await personalInfo.delete();
    res.json({ message: "personal Info deleted successfully." });
  });
