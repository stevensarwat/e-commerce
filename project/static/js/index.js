import * as userDB from './db/userDB.js'

window.addEventListener('load', async function(e) {
    let data = await userDB.get();
    console.log(data);
    for (const el of data) {
        console.log(el instanceof userDB.User);
    }
    updateCartCount();
    document.body.style.backgroundColor = "var(--background)";
    document.body.style.color = "var(--text-primary)";
});

var MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";

function menutoggle() {
    if (MenuItems.style.maxHeight == "0px") {
        MenuItems.style.maxHeight = "200px";
        MenuItems.style.backgroundColor = "var(--card-bg)";
    } else {
        MenuItems.style.maxHeight = "0px";
    }
}

// Ensure menu items have correct text color
document.querySelectorAll('nav ul li a').forEach(link => {
    link.style.color = 'var(--text-primary)';
});

// Make menutoggle function globally available
window.menutoggle = menutoggle;