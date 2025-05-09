import * as dbGate from './dbGate.js'
let mainURL = 'http://localhost:3000/products';

export const get = async function(id=null){
    let products = []
    let data = await dbGate.get(mainURL,id);
    for (const el of data) {
        products.push(new Product(el.id, el.name, el.price, el.cat, el.img, el.sellerId))
    }
    return products
}

export const add = async function(product){
    if(product instanceof Product)
        await dbGate.post(mainURL,product);
}

export const Update = async function(product){
    if(product instanceof Product)
        await dbGate.update(mainURL,product.id,product);
}

export const Delete = async function(product){
    if(product instanceof Product)
        await dbGate.del(mainURL,product.id);
}
export class Product {
    id; //code
    name;
    price;
    cat;
    img;
    sellerId;
    constructor(_id,_name,_price,_cat,_img,_sellerId) {
        this.id = _id;
        this.name = _name;
        this.price = _price;
        this.cat = _cat;
        this.img = _img;
        this.sellerId = _sellerId;
    }
}