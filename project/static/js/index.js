import {User, get} from './db/userDB.js'

window.addEventListener('load', async function(e) {
    let data = await get();
    console.log(data);
    for (const el of data) {
        console.log(el instanceof User);
        
    }
})