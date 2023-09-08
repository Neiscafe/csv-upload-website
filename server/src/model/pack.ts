import { ProductEntity } from "./product-entity";

export class Pack {
    pack_id: number;
    product_id: number;
    qty: number;
    constructor(packId: number, productId: number, qty: number) {
        this.pack_id = packId;
        this.product_id = productId;
        this.qty = qty;
    }
}