var MenuItems = document.getElementById("MenuItems");
MenuItems.style.maxHeight = "0px";

function menutoggle() {
    if (MenuItems.style.maxHeight == "0px") {
        MenuItems.style.maxHeight = "200px";
        MenuItems.style.backgroundColor = "var(--card-bg)";
        MenuItems.style.boxShadow = "var(--shadow)";
    } else {
        MenuItems.style.maxHeight = "0px";
    }
}