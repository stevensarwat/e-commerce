import * as dbGate from './dbGate.js'
let mainURL = 'http://localhost:3000/users';


////////////////////////////////////////////////////////////////////// main functions
export const get = async function (id =null) {
    let users = []
    let data = await dbGate.get(mainURL, id);
    for (const el of data) {
        users.push(new User(el.name, el.email, atob(el.pass), el.role, el.id))
    }
    return users;
}

export const addUser = async function (user) {
    if(user instanceof User)
        await dbGate.post(mainURL,user)
}

export const UpdateUser = async function (user) {
    if(user instanceof User)
        await dbGate.update(mainURL,user.id,user)
}

export const DeleteUser = async function (user) {
    if(user instanceof User)
        await dbGate.del(mainURL,user.id)
}

////////////////////////////////////////////////////////////////////// derived functions

export const isFound = async function (email, pass) {
    let data = await get();
    for (const user of data) {
        if(user.email == email && user.pass == btoa(pass)){
            let u = new User(user.name, user.email, user.pass, user.role, user.id)
            return u;
        }
    }
    return null;
}

const getUserById = async function (id) {
    let data = await get(id);
    // for (const user of data) {
    //     if(user.id == id){
    //         let u = new User(user.name, user.email, user.pass, user.role, user.id)
    //         return u;
    //     }
    // }
    if(data){
        let user = data[0];
        return new User(user.name, user.email, user.pass, user.role, user.id)
    }
    return null;
}

export const getUserByOrderId = async function (orderID) {
    let data = await get();
    for (const user of data) {
        for (const order of user.orders) {
            if(order.orderID == orderID){
                let u = new User(user.name, user.email, user.pass, user.role, user.id)
                return u;
            }
        }
    }
    return null;
}

export const getUserByemail = async function (email, exclude) {
    let data = await get();
    for (const user of data) {
        if(user.email === exclude) continue;
        if(user.email == email.trim()){
            let u = new User(user.name, user.email, user.pass, user.role, user.id)
            return u;
        }
    }
    return null;
}

export const login = function (usr) {
    localStorage.setItem('login', btoa(usr.id));
}

export const logout= function () {
    localStorage.removeItem('login');
    window.location.href = '../../screens/login.html';
}

export const isLogged= async function () {
    let id = localStorage.getItem('login');
    if(id != null && await getUserById(atob(id)) != null){
        window.location.href = '../screens/panel/adminP.html';
        return true;
    }
    return false;
}

////////////////////////////////////////////////////////////////////// class
export class User {
    id;
    name; 
    email; 
    pass;
    role; 
    orders =[];

    constructor(_name, _email, _pass, _role, _id= null,_orders=[]) {
        this.id = _id == null?crypto.randomUUID():_id;
        this.name = _name;
        this.email = _email;
        this.pass = btoa(_pass);
        this.role = _role;
        this.orders = _orders;
    }
}
