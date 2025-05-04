import {User, get, logout} from './db/userDB.js'
let users = []

window.addEventListener('load', async function(e) {
    users = await get();
    renderUsersTable();

    logOut.addEventListener('click', function (e) {
        logout();
        window.location.href = '../screens/login.html';
    })
})

  //Sidebar   
  const logOut = document.getElementById("logOut");

  // DOM Elements
  const userModal = document.getElementById("userModal");
  const deleteModal = document.getElementById("deleteModal");
  const addUserBtn = document.getElementById("addUserBtn");
  const modalTitle = document.getElementById("modalTitle");
  const userForm = document.getElementById("userForm");
  const usersTableBody = document.getElementById("usersTableBody");
  const saveUserBtn = document.getElementById("saveUserBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

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
  });

  // Initialize table with user data
  function renderUsersTable() {
    usersTableBody.innerHTML = "";

    users.forEach((user) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${capitalizeFirstLetter(user.role)}</td>
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
        const userId = this.getAttribute("data-id");
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
    document.getElementById("userId").value = "";

    // Clear error messages
    document.querySelectorAll(".error-message").forEach((el) => {
      el.style.display = "none";
    });

    // Show the modal
    userModal.classList.add("active");
  }

  // Open modal for editing a user
  function openEditUserModal(userId) {
    const user = users.find((u) => u.id == userId);
    if (!user) return;

    modalTitle.textContent = "Edit User";
    document.getElementById("userId").value = user.id;
    nameInput.value = user.name;
    emailInput.value = user.email;
    passwordInput.value = ""; // Don't show password for security
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
    if (!user) return;

    document.getElementById("deleteUserId").value = userId;
    deleteModal.classList.add("active");
  }

  // Close any modal
  function closeModals() {
    userModal.classList.remove("active");
    deleteModal.classList.remove("active");
  }

  // Validate form
  function validateForm() {
    let isValid = true;

    Object.keys(formFields).forEach((fieldName) => {
      const input = document.getElementById(fieldName);
      const field = formFields[fieldName];
      let fieldValid;

      if (field.regex) {
        fieldValid = field.regex.test(input.value);
      } else if (field.validate) {
        fieldValid = field.validate(input.value);
      }

      if (!fieldValid) {
        field.error.style.display = "block";
        isValid = false;
      } else {
        field.error.style.display = "none";
      }
    });

    // If editing, don't require password
    const userId = document.getElementById("userId").value;
    if (userId && passwordInput.value === "") {
      passwordError.style.display = "none";
      isValid = true;
    }

    return isValid;
  }

  // Save user (add or update)
  function saveUser() {
    if (!validateForm()) return;

    const userId = document.getElementById("userId").value;
    const user = {
      name: nameInput.value,
      email: emailInput.value,
      role: roleInput.value,
    };

    if (passwordInput.value) {
      // In a real app, we'd hash the password here
      user.pass = btoa(passwordInput.value);
    }

    if (userId) {
      // Update existing user
      const index = users.findIndex((u) => u.id == userId);
      if (index !== -1) {
        // Keep the password if not changed
        if (!user.pass) {
          user.pass = users[index].pass;
        }

        user.id = parseInt(userId);
        users[index] = user;
        showToast("success", "Success!", "User updated successfully");
      }
    } else {
      // Add new user
      user.id =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      users.push(user);
      showToast("success", "Success!", "User added successfully");
    }

    closeModals();
    renderUsersTable();
  }

  // Delete user
  function deleteUser() {
    const userId = document.getElementById("deleteUserId").value;
    const index = users.findIndex((u) => u.id == userId);

    if (index !== -1) {
      users.splice(index, 1);
      showToast("success", "Success!", "User deleted successfully");
    }

    closeModals();
    renderUsersTable();
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

  // Helper function to capitalize first letter
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Event Listeners
  addUserBtn.addEventListener("click", openAddUserModal);

  // Close modal when clicking on close button or outside the modal
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", closeModals);
  });

  userModal.addEventListener("click", function (e) {
    if (e.target === userModal) {
      closeModals();
    }
  });

  deleteModal.addEventListener("click", function (e) {
    if (e.target === deleteModal) {
      closeModals();
    }
  });

  saveUserBtn.addEventListener("click", saveUser);
  confirmDeleteBtn.addEventListener("click", deleteUser);

  // Initialize the users table
  renderUsersTable();