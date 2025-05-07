import * as dbGate from './dbGate.js'

let mainURL = 'http://localhost:3000/products';

const f = async function(){

}

export const getProducts = async function(id=null){
    let products = []
    let data = await dbGate.get(mainURL,id);
    for (const el of data) {
        products.push(new Product(el.id, el.name, el.price, el.cat, el.images, el.sellerId))
    }
    return products
}

export const addProduct = async function(product){
    if(product instanceof Product)
        await dbGate.post(mainURL,product);
}


export const updateProduct = async function(product){
    if(product instanceof Product)
        await dbGate.update(mainURL,product.id,product);
}


export const delProduct = async function(product){
    if(product instanceof Product)
        await dbGate.del(mainURL,product.id);
}
class Product {
    id; //code
    name;
    price;
    cat;
    images;
    sellerId;
    constructor(_id,_name,_price,_cat,_images,_sellerId) {
        this.id = _id;
        this.name = _name;
        this.price = _price;
        this.cat = _cat;
        this.images = _images;
        this.sellerId = _sellerId;
    }
}