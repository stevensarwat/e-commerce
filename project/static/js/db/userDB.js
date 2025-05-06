import {db} from './dbGate.js'
let mainURL = 'http://localhost:3000/users';


////////////////////////////////////////////////////////////////////// main functions
export const get = async function () {
    let users = []
    let data = await db(mainURL, 'GET');
    for (const el of data) {
        users.push(new User(el.name, el.email, atob(el.pass), el.role, el.id))
    }
    return users;
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
    let data = await get();
    for (const user of data) {
        if(user.id == id){
            let u = new User(user.name, user.email, user.pass, user.role, user.id)
            return u;
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

export const addUser = async function (user) {
    if(user instanceof User)
    await post(user);
}

export const UpdateUser = async function (user) {
    if(user instanceof User)
    await update(user);
}

export const DeleteUser = async function (user) {
    if(user instanceof User)
    await del(user);
}

export const login = function (usr) {
    localStorage.setItem('login', btoa(usr.id));
}

export const logout= function () {
    localStorage.removeItem('login');
}

export const isLogged= async function () {
    let id = localStorage.getItem('login');
    if(id != null && await getUserById(atob(id)) != null){
        window.location.href = '../screens/panels/adminP.html';
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

    constructor(_name, _email, _pass, _role, _id= null) {
        this.id = _id == null?crypto.randomUUID():_id;
        this.name = _name;
        this.email = _email;
        this.pass = btoa(_pass);
        this.role = _role;
    }
}
