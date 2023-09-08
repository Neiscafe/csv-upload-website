import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2/promise';
import { ProductForm } from '../model/productForm';
import { Validator } from 'jsonschema';
import { Product, ProductResponse } from '../model/product-response';
import {ResponseType} from '../model/response-type';

const jsonValidator = new Validator();

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
      const products = plainToClass(ProductForm, jsonData);

      const connection = await pool.getConnection();
      const [product_db] = await connection.execute<Product[] & RowDataPacket[]>('SELECT * FROM products');
      console.log(product_db);
      let items = new ProductResponse(product_db);

      // const [packs_db] = await connection.execute<Product[] & RowDataPacket[]>('SELECT * FROM packs');
      const validationStatus: ResponseType = validateItems(products, items);
      if(validationStatus.type=="Success"){
        res.json(validationStatus.message)
      }else{
        res.json(validationStatus.message);
      }
      // res.json(jsonData);
    } catch (error) {
      console.error('Erro:', error);
      // res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

function validateItems(products: ProductForm[], items: ProductResponse): ResponseType{
  products.forEach(element => {
    ////
    ////  ANTES DO RETURN COLOCAR OS RES.ERROR CORRESPONDENTES A CADA ERRO!!!!
    ////  SE DER TEMPO, SUBSTITUIR OS INTEIROS POR OBJETOS DE EXCESSAO~!!!!
    ////

    switch (element.isValid()) {
      case 0: return new ResponseType("Error", "O item de id " + element.product_code + " têm um código em formato não permitido");
      case 1: return new ResponseType("Error", "O item de id " + element.product_code + " têm um preço em formato não permitido!");
      default:
    }

    if (items.containsCode(element) == false) {
      return new ResponseType("Error", "O item de id " + element.product_code + " não existe!!");
    }

    switch (items.respectsBusiness(element)) {
      case 0:
        return new ResponseType("Error", "O item de id " + element.product_code + " Não existe no banco de dados!");
      case 1:
        return new ResponseType("Error", "O item de id " + element.product_code + " têm preço menor que custo de produção!");
      case 2:
        return new ResponseType("Error", "O item de id " + element.product_code + " têm preço 10% diferente do preço de venda!");
      default:
        break;
    }
  });
  return new ResponseType("Success", "Itens validados com sucesso!");
}

export default yourController;