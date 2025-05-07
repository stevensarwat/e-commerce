import {logout} from '../db/userDB.js'

//Sidebar   
const logOut = document.getElementById("logOut");
const navUser = document.getElementById("users");
const navProducts = document.getElementById("products");
const mainNavigation = document.getElementById("mainNavigation");

window.onhashchange = renderPage;
window.addEventListener('load', function(e) { 
  
  logOut.addEventListener('click', function (e) {
    logout();
  });
  navUser.addEventListener('click', function (e) {
    navigateTo('users');
    
  });
  navProducts.addEventListener('click', function (e) {
    navigateTo('products');
  });
  this.document.querySelectorAll('.nav-link').forEach(element => {
      element.addEventListener('click',function() {
        // location.reload(true);
      })
    }); 
  renderPage(); //for intail state
})


const pages = {
  users: "../../screens/panel/users.html",
  products: "../../screens/panel/products.html",
};

function navigateTo(page) {
  window.location.href = `#${page}`;
}


async function renderPage() {
  const AfterHash = window.location.hash.slice(1) || "users";
  const url = pages[AfterHash];
  let navs = document.getElementsByClassName('nav-link');
  for (const element of navs) {
    element.classList.remove('active');
  };
    let choosenNav = document.getElementById(AfterHash);
    choosenNav.classList.add('active');
  try {
    let included = document.getElementsByClassName('included');
    if(included.length>0){
      for (const sc of included) {
          sc.remove();
      }
    }
    const response = await fetch(url);
    const content = await response.text();
    mainNavigation.innerHTML = content;
    let scripts = document.querySelectorAll('#mainNavigation script');
    for (const el of scripts) {
      let newScript = document.createElement('script');
      newScript.type = "module";
      newScript.className = "included";
      newScript.src = el.src + "?v="+Date.now() ;
      document.head.appendChild(newScript);
    }
  } catch (error) {     
    mainNavigation.innerHTML =
      `<h1>404</h1><p>Page not found!</p><p>${error}</p>`;
  }
}
/////////////////////////////////////////////////