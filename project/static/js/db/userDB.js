import {db} from './dbGate.js'
let mainURL = 'http://localhost:3000/users';

const get = async function () {
    return await db(mainURL, 'GET');
}

const post = async function (user) {
    await db(mainURL, 'POST', user).then((data) => {
        console.log(data);
    }).catch((error) => {
        console.error('Error:', error);
    });
}

const del = async function (user) {
    await db(mainURL+`/${user.id}`, 'DELETE').then((data) => {
        console.log(data);
    }).catch((error) => {
        console.error('Error:', error);
    });
}

const update = async function (user) {
    await db(mainURL+`/${user.id}`, 'PUT', user).then((data) => {
        console.log(data);
    }).catch((error) => {
        console.error('Error:', error);
    });
}

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

export const getUserById = async function (id) {
    let data = await get();
    for (const user of data) {
        if(user.id == atob(id)){
            let u = new User(user.name, user.email, user.pass, user.role, user.id)
            return u;
        }
    }
    return null;
}

export const getUserByemail = async function (email) {
    let data = await get();
    for (const user of data) {
        if(user.email == email){
            let u = new User(user.name, user.email, user.pass, user.role, user.id)
            return u;
        }
    }
    return null;
}

export const addUser = async function (user) {
    if(user instanceof User)
    await post(user);
}



export class User {
    id;
    name; 
    email; 
    pass;
    role; 

    constructor(_name, _email, _pass, _role, _id= null) {
        this.id = _id == null?crypto.randomUUID():_id;
        this.name = _name;
        this.email = _email;
        this.pass = btoa(_pass);
        this.role = _role;
    }
}
