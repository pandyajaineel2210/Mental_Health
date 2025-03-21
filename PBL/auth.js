document.addEventListener("DOMContentLoaded", () => {
  // Toggle password visibility
  const togglePasswordButtons = document.querySelectorAll(".toggle-password")
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const passwordInput = this.parentElement.querySelector("input")
      const icon = this.querySelector("i")

      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        icon.classList.remove("fa-eye")
        icon.classList.add("fa-eye-slash")
      } else {
        passwordInput.type = "password"
        icon.classList.remove("fa-eye-slash")
        icon.classList.add("fa-eye")
      }
    })
  })

  // Password strength meter
  const passwordInput = document.getElementById("password")
  const strengthBar = document.getElementById("strength-bar")
  const strengthText = document.getElementById("strength-text")

  if (passwordInput && strengthBar && strengthText) {
    passwordInput.addEventListener("input", function () {
      const password = this.value
      let strength = 0

      // Check password length
      if (password.length >= 8) {
        strength += 1
      }

      // Check for lowercase and uppercase letters
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 1
      }

      // Check for numbers
      if (password.match(/[0-9]/)) {
        strength += 1
      }

      // Check for special characters
      if (password.match(/[^a-zA-Z0-9]/)) {
        strength += 1
      }

      // Update strength bar and text
      switch (strength) {
        case 0:
          strengthBar.className = "strength-bar"
          strengthBar.style.width = "0"
          strengthText.textContent = "Password strength"
          break
        case 1:
          strengthBar.className = "strength-bar weak"
          strengthText.textContent = "Weak"
          break
        case 2:
          strengthBar.className = "strength-bar medium"
          strengthText.textContent = "Medium"
          break
        case 3:
          strengthBar.className = "strength-bar strong"
          strengthText.textContent = "Strong"
          break
        case 4:
          strengthBar.className = "strength-bar very-strong"
          strengthText.textContent = "Very Strong"
          break
      }
    })
  }

  // Login form submission
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const remember = document.getElementById("remember")?.checked || false

      // Simple validation
      if (!email || !password) {
        showAuthMessage("Please fill in all fields.", "error")
        return
      }

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users")) || []
      const user = users.find((u) => u.email === email)

      if (!user || user.password !== password) {
        showAuthMessage("Invalid email or password.", "error")
        return
      }

      // Set current user in localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          isLoggedIn: true,
        }),
      )

      // Redirect to dashboard or getting started page
      if (user.isNewUser) {
        window.location.href = "getting-started.html"
      } else {
        window.location.href = "dashboard.html"
      }
    })
  }

  // Signup form submission
  const signupForm = document.getElementById("signup-form")
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const fullname = document.getElementById("fullname").value
      const email = document.getElementById("email").value
      const password = document.getElementById("password").value
      const confirmPassword = document.getElementById("confirm-password").value
      const terms = document.getElementById("terms")?.checked || false

      // Simple validation
      if (!fullname || !email || !password || !confirmPassword) {
        showAuthMessage("Please fill in all fields.", "error")
        return
      }

      if (password !== confirmPassword) {
        showAuthMessage("Passwords do not match.", "error")
        return
      }

      if (!terms) {
        showAuthMessage("Please agree to the Terms of Service and Privacy Policy.", "error")
        return
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users")) || []
      if (users.some((user) => user.email === email)) {
        showAuthMessage("Email already in use. Please use a different email or log in.", "error")
        return
      }

      // Create new user
      const newUser = {
        id: generateUserId(),
        name: fullname,
        email: email,
        password: password,
        isNewUser: true,
        createdAt: new Date().toISOString(),
      }

      // Add user to localStorage
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // Set current user in localStorage
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          isLoggedIn: true,
        }),
      )

      // Redirect to getting started page
      window.location.href = "getting-started.html"
    })
  }

  // Social login buttons
  const socialButtons = document.querySelectorAll(".social-btn")
  socialButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // In a real app, this would integrate with OAuth providers
      // For demo purposes, we'll create a demo user
      const demoUser = {
        id: generateUserId(),
        name: "Demo User",
        email: "demo@example.com",
        isLoggedIn: true,
      }

      localStorage.setItem("currentUser", JSON.stringify(demoUser))
      window.location.href = "dashboard.html"
    })
  })

  // Helper functions
  function showAuthMessage(message, type) {
    const messageElement = document.getElementById("auth-message")
    if (messageElement) {
      messageElement.textContent = message
      messageElement.className = `auth-message ${type}`
    }
  }

  function generateUserId() {
    return "user_" + Math.random().toString(36).substr(2, 9)
  }
})

