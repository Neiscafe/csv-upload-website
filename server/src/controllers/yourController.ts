import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { ProductReq } from '../model/product-request';
import { ProductEntity } from '../model/product-entity';
import { ValidationType } from '../model/response-type';
import { isNumber } from 'class-validator';

const ERROR = "Error";
const SUCCESS = "Success";

const pool = mysql.createPool({
  host: '127.0.0.1:3306',
  user: 'new',
  password: '1234',
  database: 'db',
});

const yourController = {
  async get(req: Request, res: Response) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.execute('SELECT * FROM products');
      connection.release();
      res.json(rows);
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const jsonData = req.body;
      const products = plainToClass(ProductReq, jsonData);
      const connection = await pool.getConnection();
      const [product_db] = await connection.execute<ProductEntity[] & RowDataPacket[]>('SELECT * FROM products');
      let items: ProductEntity[] = product_db;

      // const [packs_db] = await connection.execute<Product[] & RowDataPacket[]>('SELECT * FROM packs');
      const validationStatus: ValidationType[] = validateItems(products, items);
      if (validationStatus[0].type == "Success") {
        res.status(200).json({ validationStatus })
      } else {
        res.status(500).json({ validationStatus });
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }
};

function validateItems(productsFromReq: ProductReq[], productsEntity: ProductEntity[]): ValidationType[] {
  let totalErrors: ValidationType[] = [];
  for (let reqProduct of productsFromReq) {
    const a = itemHasValidFields(reqProduct);
    const b = itemExistsInDb(reqProduct, productsEntity);
    const c = respectsBusinessScenario(reqProduct, productsEntity);
    totalErrors = totalErrors.concat(a, b, c);
  }
  if (totalErrors.length > 0) {
    return totalErrors;
  } else {
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

function respectsBusinessScenario(cProduct: ProductReq, oldProducts: ProductEntity[]): ValidationType[] {
  let selected, errors: ValidationType[] = [];
  for (let oProduct of oldProducts) {
    if (oProduct.code == cProduct.product_code) {
      selected = oProduct;
    }
  }
  if (typeof (selected) == 'undefined') {
    errors.push(new ValidationType(ERROR, "O item de id " + cProduct.product_code + " é indefinido na base de dados!"));
    return errors;
  }
  if (cProduct.new_price < selected.cost_price) {
    errors.push(new ValidationType(ERROR, "O item de id " + cProduct.product_code + " têm preço menor que custo de produção!"));
  }
  if (cProduct.new_price > selected.sales_price * 1.1 || cProduct.new_price < selected.sales_price * 0.9) {
    errors.push(new ValidationType(ERROR, "O item de id " + cProduct.product_code + " têm preço 10% diferente do preço de venda!"));
  }
  return errors;
}

export default yourController;