import {pool} from "../../utils/db";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {CategoryEntity} from "../../types";
import {isBetween} from "../../utils/dataCheck";

type CategoryRecordResults = [CategoryEntity[], FieldPacket[]]
const errorInfoName = 'category'

export class CategoryRecord implements CategoryEntity{

    id?: string;
    name: string;

    constructor(obj: CategoryEntity) {

        isBetween(obj.name, 3, 50, errorInfoName)

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

        isBetween(this.name, 3, 50, errorInfoName)

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

    static async getOneByName(name: string): Promise<CategoryRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `categories` WHERE `name` = :name", {
            name,
        })) as CategoryRecordResults;
        return results.length === 0 ? null : new CategoryRecord(results[0]);
    }

}
