import {pool} from "../../utils/db";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {ShopItemEntity} from "../../types";
import {exists, isBetween, isBigger, isNull, isSmaller, isTypeOf} from "../../utils/dataCheck";
import {CategoryRecord} from "../category";

type ShopItemRecordResults = [ShopItemEntity[], FieldPacket[]]
const errorInfoName = 'shop item'

export class ShopItemRecord implements ShopItemEntity{

    id?: string;
    name: string;
    quantity: number;
    price: number;
    img?: string;
    categoryId: string;

    constructor(obj: ShopItemEntity) {

        exists(obj.name, 'name')
        isBetween(obj.name, 3, 50, 'shop item name')

        exists(obj.quantity, 'quantity')
        isTypeOf(obj.quantity, 'number', 'quantity')
        isBetween(obj.quantity, 0, 9999, 'shop item quantity')

        exists(obj.categoryId, 'category')

        isTypeOf(obj.price, 'number', 'price')
        isBigger(obj.price, 0, 'price')
        // exists(obj.price, 'price')

        this.id = obj.id;
        this.name = obj.name;
        this.quantity = obj.quantity;
        this.price = obj.price;
        this.img = obj.img;
        this.categoryId = obj.categoryId;
    }



    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        if (!this.img) {
            this.img = '';
        }

        await pool.execute("INSERT INTO `shopitems`(`id`, `name`, `quantity`, `price`, `img`, `categoryId`) VALUES(:id, :name, :quantity, :price, :img, :categoryId)", {
            id: this.id,
            name: this.name,
            quantity: this.quantity,
            price: this.price,
            img: this.img,
            categoryId: this.categoryId
        });

        return this.id;
    }

    async update() : Promise<void> {

        isTypeOf(this.categoryId, 'string', 'category id')
        const category = await CategoryRecord.getOne(this.categoryId);
        isNull(category, null,'category does not exists')

        isTypeOf(this.name, 'string', 'name')
        isBetween(this.name, 3, 50, 'name')

        isTypeOf(this.quantity, 'number', 'quantity')
        isBetween(this.quantity, 0, 9999, 'quantity')

        isTypeOf(this.price, 'number', 'price')
        isBigger(this.price, 0, 'price')

        isTypeOf(this.img, 'string', 'img')

        await pool.execute("UPDATE `shopitems` SET `name` = :name, `quantity` = :quantity, `price` = :price, `img` = :img, `categoryId` = :categoryId WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            quantity: this.quantity,
            price: this.price,
            categoryId: this.categoryId,
            img: this.img
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

    static async listAllByCategory(categoryId: string): Promise<ShopItemRecord[]> {
        const [results] = (await pool.execute("SELECT * FROM `shopitems` WHERE `categoryId` = :categoryId ORDER BY `name` ASC", {
            categoryId
        })) as ShopItemRecordResults;
        return results.map(obj => new ShopItemRecord(obj));
    }

    static async getOne(id: string): Promise<ShopItemRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `shopitems` WHERE `id` = :id", {
            id,
        })) as ShopItemRecordResults;
        return results.length === 0 ? null : new ShopItemRecord(results[0]);
    }

    static async getOneByName(name: string): Promise<ShopItemRecord[] | null> {
        const [results] = (await pool.execute("SELECT * FROM `shopitems` WHERE `name` = :name ", {
            name,
        })) as ShopItemRecordResults;
        return results.length === 0 ? null : results.map(obj => new ShopItemRecord(obj));
    }

    static async getOneBySimilarName(name: string): Promise<ShopItemRecord[] | null> {
        const [results] = (await pool.execute("SELECT * FROM `shopitems` WHERE `name` LIKE :name", {
            name,
        })) as ShopItemRecordResults;
        return results.length === 0 ? null : results.map(obj => new ShopItemRecord(obj));
    }

}
