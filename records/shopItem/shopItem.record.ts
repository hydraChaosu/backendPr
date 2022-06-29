import {pool} from "../../utils/db";
import {ValidationError} from "../../utils/errors";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {ShopItemEntity} from "../../types/shop";

type ShopItemRecordResults = [ShopItemEntity[], FieldPacket[]]

export class ShopItemRecord implements ShopItemEntity{

    id: string;
    name: string;
    quantity: number;
    price: number;

    constructor(obj: ShopItemEntity) {
        if (!obj.name || obj.name.length < 3 || obj.name.length > 50) {
            throw new ValidationError('nazwa produktu musi mieć od 3 do 50 znaków.');
        }

        if (obj.quantity > 9999) {
            throw new ValidationError('produktu nie moze być więcej niż 9999');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.quantity = obj.quantity;
        this.price = obj.price;
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `shopitems`(`id`, `name`, `quantity`, `price`) VALUES(:id, :name, :quantity, :price)", {
            id: this.id,
            name: this.name,
            quantity: this.quantity,
            price: this.price
        });

        return this.id;
    }

    async update() : Promise<void> {
        await pool.execute("UPDATE `shopitems` SET `name` = :name, `quantity` = :quantity, `price` = :price WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            quantity: this.quantity,
            price: this.price
        });
    }

    async delete() : Promise<void> {
        await pool.execute("DELETE FROM `shopitems` WHERE `id` = :id", {
            id: this.id
        })
    }

    static async listAll(): Promise<ShopItemRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `shopitems` ORDER BY `name` ASC")) as ShopItemRecordResults;
        return results.map(obj => new ShopItemRecord(obj));
    }

    static async getOne(id: string): Promise<ShopItemRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `shopitems` WHERE `id` = :id", {
            id,
        })) as ShopItemRecordResults;
        return results.length === 0 ? null : new ShopItemRecord(results[0]);
    }

    static async getByNameOne(name: string): Promise<ShopItemRecord[] | null> {
        const [results] = (await pool.execute("SELECT * FROM `shopitems` WHERE `name` LIKE %:name%", {
            name,
        })) as ShopItemRecordResults;
        return results.length === 0 ? null : results.map(obj => new ShopItemRecord(obj));
    }

}
