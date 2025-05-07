import * as userDB from './userDB.js'
import * as productDB from './productDB.js'

const f = function(){

}
/*
get all orders from all users => getOrders();
get orders by userId => getOrders(userId);
get orders by sellerId => getOrders(null,sellerId);
get orders in specific user and sellerId => getOrders(userId,sellerId);
*/
export const getOrders = async function(userId=null, sellerId=null){
    let allOrders = []; 
    let allProducts = await productDB.getProducts();
    let users = await userDB.get(userId);
    for (const user of users) {
        let userOlders =user.orders;
        //fileter by sellerId if not null
        if(sellerId) userOlders = userOlders.filter(order=>order.sellerId == sellerId);
        for (const order of userOlders) {
            let product = allProducts.find(pr=>pr.id == order.productId && pr.sellerId == order.sellerId);
            allOrders.push(new Order(order.orderID, product.name, order.quantity,order.status,order.sellerId));
        }
    }
    return allOrders;
}

export const EditOrder =async function(orderId, method, order=null){
    //search for user
    let user = await userDB.getUserByOrderId(orderId);
    if(user){
        //delete order
        if(method == 'd' || method == 'u')user.orders = user.orders.filter(or=>or !== orderId);
        
        if((method == 'u' || method == 'a') && order && order instanceof Order){
            user.orders.push(order);
        }    
        
        await userDB.UpdateUser(user);
    }
}


export class Order {
    orderId;
    productName;
    quantity;
    status;
    sellerId;
    constructor(_orderId,_productName,_quantity,_status,_sellerId) {
        this.orderId = _orderId;
        this.productName = _productName;
        this.quantity = _quantity;
        this.status = _status;
        this.sellerId = _sellerId;
    }
}