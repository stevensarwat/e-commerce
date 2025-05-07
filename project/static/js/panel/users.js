import {User, get, addUser, UpdateUser, DeleteUser, getUserByemail} from '../db/userDB.js'
let users = []
let searchUsers = []

  // DOM Elements
  const userModal = document.getElementById("userModal");
  const deleteModal = document.getElementById("deleteModal");
  const addUserBtn = document.getElementById("addUserBtn");
  const modalTitle = document.getElementById("modalTitle");
  const userForm = document.getElementById("userForm"); //userModal from
  const usersTableBody = document.getElementById("usersTableBody"); //where generate the body of the table
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const pagination = document.getElementById("pagination");
  const search = document.getElementById("search-input");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const roleInput = document.getElementById("role");

  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const roleError = document.getElementById("roleError");

  // Form field validation
  const formFields = {
    name: {
      regex: /^.{2,}$/,
      error: nameError,
    },
    email: {
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      error: emailError,
    },
    password: {
      regex: /^.{3,}$/,
      error: passwordError,
    },
    role: {
      validate: (value) => value !== "",
      error: roleError,
    },
  };

  const init =  async function () {
    await paging();
    await Events();
  }

  // all events in the page 
  const Events = async function(){

      // Set up validation for each field
      Object.keys(formFields).forEach((fieldName) => {
          const input = document.getElementById(fieldName);
          const field = formFields[fieldName];

          input.addEventListener("input", function () {
              let isValid;

              if (field.regex) {
              isValid = field.regex.test(this.value);
              } else if (field.validate) {
              isValid = field.validate(this.value);
              }

              if (isValid || this.value === "") {
              field.error.style.display = "none";
              } else {
              field.error.style.display = "block";
              }
          });

          emailInput.addEventListener("input", function () {
            emailInput.setCustomValidity('');
          });
      });

      userForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        await saveUser();
      })

          // Event Listeners
      addUserBtn.addEventListener("click", openAddUserModal);

      // Close modal when clicking on close button or outside the modal
      document.querySelectorAll(".close-modal").forEach((btn) => {
        btn.addEventListener("click", closeModals);
      });

      userModal.addEventListener("click", function (e) {
      if (e.target === userModal) { //it's tack the full width and hights
        closeModals();
      }
      });

      deleteModal.addEventListener("click", function (e) {
      if (e.target === deleteModal) { //it's tack the full width and hights
        closeModals();
      }
      });

      search.addEventListener('input',function(e){
        if(search.value.trim() == '') 
          searchUsers = users; 
        else
          searchUsers = users.filter(us => ( us.email.includes(search.value.trim()) || us.name.includes(search.value.trim()) || us.role.includes(search.value.trim())));
        paging(true);
      })

      // saveUserBtn.addEventListener("click", await saveUser);
      confirmDeleteBtn.addEventListener("click", await deleteUser);
  }

  const paging = async function(search=false){
    if(users.length ==0 && !search)
    {
      users = await get();
      searchUsers = [...users];
    }
    let prc = 5; // page record count
    let bc = Math.ceil(searchUsers.length / prc) //button count
    renderPaging(prc,bc);
    await renderUsersTable(0,prc);
  }

  const renderPaging = async function(prc,bc){
    let html = ''
    for (let i = 1; i <= bc; i++) {
      let from =(i-1)*prc
      html=html+`
      <button class="page-btn ${i==1?'active':''}" frc=${from}>${i}</button>
      `;
    }
    pagination.innerHTML=html;
    //events
    document.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click',async function (e) {
        let from = this.getAttribute('frc');
        console.log(from);
        renderUsersTable(from,parseInt(from)+5);
        
        document.querySelectorAll('.page-btn').forEach(cbtn => {
          // remove class active
          cbtn.classList.remove('active');
        });
        
        //add class active
        btn.classList.add('active');
        
      });
    });
  }

  // Initialize table with user data
  async function renderUsersTable(from=null, to=null) {
    from = from ==null ? 0 : from;
    from = from<0?0:from;
    to = to ==null ? searchUsers.length : to;
    usersTableBody.innerHTML = "";
    searchUsers.slice(from, to).forEach((user) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <div class="action-btns">
                        <button class="btn btn-sm btn-outline edit-btn" data-id="${
                          user.id
                        }">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline delete-btn" data-id="${
                          user.id
                        }">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </td>
            `;
      usersTableBody.appendChild(tr);
    });

    // Add event listeners to the edit and delete buttons
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const userId = this.getAttribute("data-id"); //we added custom attribute - we made it here
        openEditUserModal(userId);
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const userId = this.getAttribute("data-id");
        openDeleteModal(userId);
      });
    });
  }

  // Open modal for adding a new user
  function openAddUserModal() {
    modalTitle.textContent = "Add New User";
    userForm.reset();
    document.getElementById("userId").value = ""; //because this is add new not update

    // Clear error messages
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
    });

    // Show the modal
    userModal.classList.add("active");
  }
  
let oldemail='';
  // Open modal for editing a user
  function openEditUserModal(userId) {
    //get the user
    const user = searchUsers.find((u) => u.id == userId);
    // if (!user) return;

    //complete user informations
    modalTitle.textContent = "Edit User";
    document.getElementById("userId").value = user.id;
    nameInput.value = user.name;
    oldemail = emailInput.value = user.email;
    passwordInput.value = atob(user.pass);
    roleInput.value = user.role;

    // Clear error messages
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
    });

    // Show the modal
    userModal.classList.add("active");
  }

  // Open delete confirmation modal
  function openDeleteModal(userId) {
    const user = searchUsers.find((u) => u.id == userId);
    // if (!user) return;

    document.getElementById("deleteUserId").value = userId;
    deleteModal.classList.add("active");
  }

  // Close any modal
  function closeModals() {
    userModal.classList.remove("active");
    deleteModal.classList.remove("active");
  }

  // Save user (add or update)
  async function saveUser() {
 
    const userId = document.getElementById("userId").value;
    let u = new User(nameInput.value, emailInput.value, passwordInput.value, roleInput.value)

    if(await getUserByemail(emailInput.value, oldemail) instanceof User)
      {
          emailInput.setCustomValidity('this email is taken');
          return;   
      }
    if (userId) {
        u = new User(nameInput.value, emailInput.value, passwordInput.value, roleInput.value, userId)

        //update user function
        UpdateUser(u);
    } else {
      // Add new user
      await addUser(u);
    }

    closeModals();
    
    await renderUsersTable();
  }

  // Delete user
  async function deleteUser() {
    const userId = document.getElementById("deleteUserId").value;
    let u = new User('','','','',userId)
    DeleteUser(u)
    closeModals();
    await renderUsersTable();
  }


  //await init(); // must put in the end of the file
  if(document.readyState == "complete"){
    await init()
  }else{
    window.addEventListener('load', async function(e) {
      await init()
    });
  }