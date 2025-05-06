import {User, get, addUser, UpdateUser, DeleteUser, logout, getUserByemail} from './db/userDB.js'
let users = []

  //Sidebar   
  const logOut = document.getElementById("logOut");

  // DOM Elements
  const userModal = document.getElementById("userModal");
  const deleteModal = document.getElementById("deleteModal");
  const addUserBtn = document.getElementById("addUserBtn");
  const modalTitle = document.getElementById("modalTitle");
  const userForm = document.getElementById("userForm"); //userModal from
  const usersTableBody = document.getElementById("usersTableBody"); //where generate the body of the table
  const saveUserBtn = document.getElementById("saveUserBtn"); //userModal from save btn
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const roleInput = document.getElementById("role");

  const nameError = document.getElementById("nameError");
  const emailTakenError = document.getElementById("emailTakenError");
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

  window.addEventListener('load', async function(e) {
    await renderUsersTable();

    logOut.addEventListener('click', function (e) {
        logout();
        window.location.href = '../screens/login.html';
    })

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
                emailTakenError.style.display = 'none';
            });
        });
})

  // Initialize table with user data
  async function renderUsersTable() {
    users = await get();
    usersTableBody.innerHTML = "";

    users.forEach((user) => {
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

  // Open modal for editing a user
  function openEditUserModal(userId) {
    //get the user
    const user = users.find((u) => u.id == userId);
    // if (!user) return;

    //complete user informations
    modalTitle.textContent = "Edit User";
    document.getElementById("userId").value = user.id;
    nameInput.value = user.name;
    emailInput.value = user.email;
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
    const user = users.find((u) => u.id == userId);
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

    if(await getUserByemail(emailInput.value, u.email) instanceof User)
      {
          // emailInput.setCustomValidity('this email is taken try to login');
          emailTakenError.style.display = 'block';
          return;   
      }
    if (userId) {
        u = new User(nameInput.value, emailInput.value, passwordInput.value, roleInput.value, userId)

        //update user function
        UpdateUser(u);
        showToast("success", "Success!", "User updated successfully");
    } else {
        
      // Add new user
      await addUser(u);

      showToast("success", "Success!", "User added successfully");
    }

    closeModals();
    
    await renderUsersTable();
  }

  // Delete user
  async function deleteUser() {
    const userId = document.getElementById("deleteUserId").value;
    let u = new User('','','','',userId)
    DeleteUser(u)
    showToast("success", "Success!", "User deleted successfully");
    closeModals();
    await renderUsersTable();
  }

  // Show toast notification
  function showToast(type, title, message) {
    const toastContainer = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${
                  type === "success" ? "check-circle" : "exclamation-circle"
                }"></i>
            </div>
            <div class="toast-content">
                <h4 class="toast-title">${title}</h4>
                <p class="toast-message">${message}</p>
            </div>
            <button class="toast-close">&times;</button>
        `;

    toastContainer.appendChild(toast);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 300);
    }, 3000);

    // Close toast on click
    toast
      .querySelector(".toast-close")
      .addEventListener("click", function () {
        toast.style.opacity = "0";
        setTimeout(() => {
          toastContainer.removeChild(toast);
        }, 300);
      });
  }

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

  saveUserBtn.addEventListener("click", await saveUser);
  confirmDeleteBtn.addEventListener("click", await deleteUser);