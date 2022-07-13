import { PersonalInfoEntity } from "./personalInfo.entity";

export type PersonalInfoCreateReq = Omit<PersonalInfoEntity, "id">;

export interface SetPersonalInfoReq {
  userId: string;
  name?: string;
  surname?: string;
  street?: string;
  buildingNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
}
