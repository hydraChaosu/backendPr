import {pool} from "../../utils/db";
import {ValidationError} from "../../utils/errors";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {CategoryEntity } from "../../types";

type CategoryRecordResults = [CategoryEntity[], FieldPacket[]]

export class CategoryRecord implements CategoryEntity{

    id: string;
    name: string;

    constructor(obj: CategoryEntity) {
        if (!obj.name || obj.name.length < 3 || obj.name.length > 50) {
            throw new ValidationError('name should be beetwen 3 and 50 characters.');
        }


        this.id = obj.id;
        this.name = obj.name;

    }



    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `categories`(`id`, `name`) VALUES(:id, :name)", {
            id: this.id,
            name: this.name
        });

        return this.id;
    }

    async update() : Promise<void> {
        await pool.execute("UPDATE `categories` SET `name` = :name WHERE `id` = :id", {
            id: this.id,
            name: this.name
        });
    }

    async delete() : Promise<void> {
        await pool.execute("DELETE FROM `categories` WHERE `id` = :id", {
            id: this.id
        })
    }

    static async listAll(): Promise<CategoryRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `categories` ORDER BY `name` ASC")) as CategoryRecordResults;
        return results.map(obj => new CategoryRecord(obj));
    }

    static async getOne(id: string): Promise<CategoryRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `categories` WHERE `id` = :id", {
            id,
        })) as CategoryRecordResults;
        return results.length === 0 ? null : new CategoryRecord(results[0]);
    }

}
