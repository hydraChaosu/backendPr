import {pool} from "../../utils/db";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {PersonalInfoEntity} from "../../types";
import {exists, isTypeOf} from "../../utils/dataCheck";


type PersonalInfoRecordResults = [PersonalInfoEntity[], FieldPacket[]]

export class PersonalInfoRecord implements PersonalInfoEntity {

    id?: string;
    userId: string;
    name?: string;
    surname?: string;
    city?: string;
    country?: string;
    street?: string;
    buildingNumber?: string;
    postalCode?: string;

    constructor(obj: PersonalInfoEntity) {

        exists(obj.userId, 'user Id')
        isTypeOf(obj.userId, 'string', 'user Id')

        this.id = obj.id;
        this.userId = obj.userId
        this.name = obj.name;
        this.surname = obj.surname
        this.city = obj.city
        this.country = obj.country
        this.street = obj.street
        this.buildingNumber = obj.buildingNumber
        this.postalCode = obj.postalCode

    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `personalinfo`(`id`, `userId`, `name`, `surname`, `city`, `country`, `street`, `buildingNumber`,`postalCode`) VALUES(:id, :userId, :name, :surname, :city, :country, :street, :buildingNumber, :postalCode)", {

            id: this.id,
            userId: this.userId,
            name: this.name,
            surname: this.surname,
            city: this.city,
            country: this.country,
            street: this.street,
            buildingNumber: this.buildingNumber,
            postalCode: this.postalCode

        });

        return this.id;
    }

    async update() : Promise<void> {

        await pool.execute("UPDATE `personalinfo` SET `name` = :name, `surname` = :surname, `city` = :city, `country` = :country, `street` = :street, `buildingNumber` = :buildingNumber, `postalCode` = :postalCode WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            surname: this.surname,
            city: this.city,
            country: this.country,
            street: this.street,
            buildingNumber: this.buildingNumber,
            postalCode: this.postalCode
        });
    }

    async delete() : Promise<void> {
        await pool.execute("DELETE FROM `personalinfo` WHERE `id` = :id", {
            id: this.id
        })
    }

    static async getUserInfo(userId: string) : Promise<PersonalInfoRecord> {
        const [results] = (await pool.execute("SELECT * FROM `personalinfo` WHERE `userId` = :userId", {
            userId,
        }))as PersonalInfoRecordResults;
        return results.length === 0 ? null : new PersonalInfoRecord(results[0]);
    }

    static async listAll(): Promise<PersonalInfoRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `personalinfo`")) as PersonalInfoRecordResults;
        return results.map(obj => new PersonalInfoRecord(obj));
    }

    static async getOne(id: string): Promise<PersonalInfoRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `personalinfo` WHERE `id` = :id", {
            id,
        })) as PersonalInfoRecordResults;
        return results.length === 0 ? null : new PersonalInfoRecord(results[0]);
    }

}
