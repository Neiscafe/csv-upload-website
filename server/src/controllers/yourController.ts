import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { ProductReq } from '../model/product-request';
import { ProductEntity } from '../model/product-entity';
import { ValidationType } from '../model/response-type';
import { isNumber } from 'class-validator';
import { Pack } from '../model/pack';
import { config } from '../server-config.js';

const ERROR = "Error";
const SUCCESS = "Success";

const pool = mysql.createPool(config);

let updatedProduct: ProductEntity[] = [];

const yourController = {
    async validate(req: Request, res: Response) {
        try {
            const jsonData = req.body;
            const products = plainToClass(ProductReq, jsonData);
            const connection = await pool.getConnection();
            const [product_db] = await connection.execute<ProductEntity[] & RowDataPacket[]>('SELECT * FROM products');
            const productItems: ProductEntity[] = product_db;
            const [packs_db] = await connection.execute<Pack[] & RowDataPacket[]>('SELECT * FROM packs');
            connection.release();

            const packItems: Pack[] = packs_db;
            const validationStatus: ValidationType[] = validateItems(products, productItems, packItems);

            if (validationStatus[0].type == "Success") {
                res.status(200).json({ validationStatus })
            } else {
                res.status(500).json({ validationStatus });
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    },
    async update(req: Request, res: Response) {
        const connection = await pool.getConnection();
        for (let item of updatedProduct) {
            connection.execute('UPDATE products SET sales_price = ? WHERE code = ?', [item.sales_price, item.code]).catch(returnError);
        }
        connection.release();
        function returnError(message: string) {
            res.status(500).json({ message });
            return;
        }
        res.status(200).json({ message: "Sucesso!" });
    }
};

function validateItems(productsFromReq: ProductReq[], productsEntity: ProductEntity[], packItems: Pack[]): ValidationType[] {
    let totalErrors: ValidationType[] = [];
    for (let reqProduct of productsFromReq) {
        const a = itemHasValidFields(reqProduct);
        const b = itemExistsInDb(reqProduct, productsEntity);
        const c = respectsBusinessScenario(reqProduct, productsEntity, packItems);
        totalErrors = totalErrors.concat(a, b, c);
    }
    if (totalErrors.length > 0) {
        return totalErrors;
    } else {
        for (let reqProduct of productsFromReq) {
            updatedProduct = priceChange(reqProduct, productsEntity, packItems);
        }
        return [new ValidationType(SUCCESS, "Itens validados com sucesso!")];
    }
}

function itemHasValidFields(product: ProductReq): ValidationType[] {
    var errors: ValidationType[] = [];

    if (!isNumber(product.product_code)) {
        let error = new ValidationType(ERROR, "O item de id " + product.product_code + " têm um código em formato não permitido");
        errors.push(error);
    }
    if (!isNumber(product.new_price)) {
        let error = new ValidationType(ERROR, "O item de id " + product.product_code + " têm um preço em formato não permitido!");
        errors.push(error);
    }

    return errors;
}

function itemExistsInDb(newProduct: ProductReq, currentProducts: ProductEntity[]): ValidationType[] {
    let exists: number = 0;
    for (let cProduct of currentProducts) {
        if (cProduct.code == newProduct.product_code) {
            exists++;
        }
    };
    if (exists == 0) {
        return [new ValidationType(ERROR, "O item de id " + newProduct.product_code + " não existe na base de dados")];
    }
    return [];
}

function respectsBusinessScenario(reqProduct: ProductReq, oldProducts: ProductEntity[], packItems: Pack[]): ValidationType[] {
    let selected;
    let errors: ValidationType[] = [];

    for (let oProduct of oldProducts) {
        if (oProduct.code == reqProduct.product_code) {
            selected = oProduct;
        }
    }
    if (typeof (selected) == 'undefined') {
        errors.push(new ValidationType(ERROR, "Erro interno no servidor!"));
        return errors;
    }

    if (reqProduct.new_price < selected.cost_price) {
        errors.push(new ValidationType(ERROR, "O item de id " + reqProduct.product_code + " têm preço menor que custo de produção!"));
    }
    if (reqProduct.new_price > selected.sales_price * 1.1 || reqProduct.new_price < selected.sales_price * 0.9) {
        errors.push(new ValidationType(ERROR, "O item de id " + reqProduct.product_code + " têm preço 10% diferente do preço de venda!"));
    }
    return errors;
}

function priceChange(reqProduct: ProductReq, oldProducts: ProductEntity[], packItems: Pack[]): ProductEntity[] {
    let selectedPack: Pack | null = null;
    let relatedPacks: Pack[] = [];
    let relatedProducts: number = 0;
    let selected: ProductEntity | null = null;

    console.log(oldProducts);

    for (let oProduct of oldProducts) {
        if (oProduct.code == reqProduct.product_code) {
            selected = oProduct;
        }
    }

    for (let pack of packItems) {
        if (reqProduct.product_code == pack.product_id || reqProduct.product_code == pack.pack_id) {
            selectedPack = pack;
        }
    }

    if (selectedPack != null && selected != null) {
        console.log("Existe pacote relacionado")
        for (let pack of packItems) {
            if (selectedPack.pack_id == pack.pack_id) {
                relatedPacks.push(pack);
            }
        }

        for (let pack of relatedPacks) {
            for (let product of oldProducts) {
                if (product.code == pack.product_id) {
                    relatedProducts++;
                }
            }
        }
        console.log(relatedProducts);

        let priceOffset = (reqProduct.new_price - selected.sales_price) / relatedProducts;
        for (let product of oldProducts) {
            for (let pack of relatedPacks) {
                if (product.code == pack.product_id) {
                    console.log("old price = " + product.sales_price + " for product" + product.code);
                    product.sales_price = parseFloat((product.sales_price + priceOffset).toString());
                    console.log("New price = " + product.sales_price + " for product" + product.code);
                }
                if (pack.pack_id == product.code) {
                    console.log("old price = " + product.sales_price + " for product" + product.code);
                    product.sales_price = reqProduct.new_price;
                    console.log("New price = " + product.sales_price + " for product" + product.code);
                }
            }
        }
    } else if (selected != null) {
        selected.sales_price = reqProduct.new_price;
    }
    console.log(oldProducts);
    return oldProducts;
}

export default yourController;