window.addEventListener('load', function () {
    // Tab switching functionality
    const tabs = document.querySelectorAll(".tab");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabId = this.getAttribute("data-tab");

        // Remove active class from all tabs and panes
        tabs.forEach((t) => t.classList.remove("active"));
        tabPanes.forEach((p) => p.classList.remove("active"));

        // Add active class to current tab and pane
        this.classList.add("active");
        document.getElementById(tabId).classList.add("active");
      });
    });

    // Login form handling
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const nameInput = document.getElementById("name");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const nameError = document.getElementById("nameError");
    const loginSuccess = document.getElementById("loginSuccess");

    // Sample user data for validation
    const userData = {
      id: "012",
      email: "user1@ecom.com",
      name: "user1",
      pass: "MTIz", // Base64 encoded "123"
      role: "seller",
    };

    // Validation for login form
    emailInput.addEventListener("input", function () {
      if (!emailInput.validity.valid) {
        emailError.style.display = "block";
      } else {
        emailError.style.display = "none";
      }
    });

    passwordInput.addEventListener("input", function () {
      if (!passwordInput.validity.valid) {
        passwordError.style.display = "block";
      } else {
        passwordError.style.display = "none";
      }
    });

    nameInput.addEventListener("input", function () {
      if (!nameInput.validity.valid) {
        nameError.style.display = "block";
      } else {
        nameError.style.display = "none";
      }
    });

    // Login form submission
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Check if the form is valid
      if (!loginForm.checkValidity()) {
        return false;
      }

      // Check if the credentials match our sample user
      if (
        emailInput.value === userData.email &&
        nameInput.value === userData.name &&
        btoa(passwordInput.value) === userData.pass
      ) {
        loginSuccess.style.display = "block";

        // Simulate redirection after successful login
        setTimeout(function () {
          alert("Login successful! Welcome to the Seller Portal.");
        }, 2000);
      } else {
        alert("Invalid credentials. Please try again.");
      }
    });

    // Register form handling
    const registerForm = document.getElementById("registerForm");
    const regPasswordInput = document.getElementById("regPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const registerSuccess = document.getElementById("registerSuccess");

    // Password match validation
    confirmPasswordInput.addEventListener("input", function () {
      const confirmError = document.getElementById("confirmPasswordError");
      if (this.value !== regPasswordInput.value) {
        confirmError.style.display = "block";
        this.setCustomValidity("Passwords do not match");
      } else {
        confirmError.style.display = "none";
        this.setCustomValidity("");
      }
    });

    regPasswordInput.addEventListener("input", function () {
      if (confirmPasswordInput.value) {
        if (confirmPasswordInput.value !== this.value) {
          document.getElementById("confirmPasswordError").style.display =
            "block";
          confirmPasswordInput.setCustomValidity("Passwords do not match");
        } else {
          document.getElementById("confirmPasswordError").style.display =
            "none";
          confirmPasswordInput.setCustomValidity("");
        }
      }
    });

    // Register form submission
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Check if the form is valid
      if (!registerForm.checkValidity()) {
        return false;
      }

      // Simulate successful registration
      registerSuccess.style.display = "block";

      // Reset form after successful submission
      setTimeout(function () {
        registerForm.reset();
        registerSuccess.style.display = "none";

        // Switch to login tab
        tabs[0].click();

        alert(
          "Registration successful! Please check your email to verify your account."
        );
      }, 2000);
    });
  });