document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser || !currentUser.isLoggedIn) {
    window.location.href = "login.html"
    return
  }

  // Set initial progress
  updateProgress(1)

  // Handle next step buttons
  const nextButtons = document.querySelectorAll(".next-step")
  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const nextStep = Number.parseInt(this.getAttribute("data-next"))

      // Validate current step
      if (!validateStep(nextStep - 1)) {
        return
      }

      // Save data from current step
      saveStepData(nextStep - 1)

      // Show next step
      showStep(nextStep)

      // Update progress
      updateProgress(nextStep)
    })
  })

  // Handle previous step buttons
  const prevButtons = document.querySelectorAll(".prev-step")
  prevButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const prevStep = Number.parseInt(this.getAttribute("data-prev"))

      // Show previous step
      showStep(prevStep)

      // Update progress
      updateProgress(prevStep)
    })
  })

  // Pre-fill form with user data if available
  if (currentUser.name) {
    document.getElementById("setup-name").value = currentUser.name
  }

  // Set today's date as default for date inputs
  const today = new Date().toISOString().split("T")[0]
  document.getElementById("setup-dob").value = today
  document.getElementById("goal-start-date").value = today

  // Helper functions
  function showStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll(".setup-step")
    steps.forEach((step) => step.classList.remove("active"))

    // Show the selected step
    document.getElementById(`step-${stepNumber}`).classList.add("active")

    // Update progress steps
    const progressSteps = document.querySelectorAll(".progress-step")
    progressSteps.forEach((step) => {
      const stepNum = Number.parseInt(step.getAttribute("data-step"))
      if (stepNum < stepNumber) {
        step.classList.add("completed")
        step.classList.remove("active")
      } else if (stepNum === stepNumber) {
        step.classList.add("active")
        step.classList.remove("completed")
      } else {
        step.classList.remove("active", "completed")
      }
    })

    // Scroll to top of the step
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  function updateProgress(stepNumber) {
    const progressBar = document.getElementById("setup-progress")
    const percentage = ((stepNumber - 1) / 3) * 100
    progressBar.style.width = `${percentage}%`
  }

  function validateStep(stepNumber) {
    switch (stepNumber) {
      case 1:
        // Validate profile step
        const name = document.getElementById("setup-name").value
        if (!name) {
          alert("Please enter your name to continue.")
          return false
        }
        return true

      case 2:
        // Validate preferences step
        const interests = document.querySelectorAll('input[name="interests[]"]:checked')
        if (interests.length === 0) {
          alert("Please select at least one interest to continue.")
          return false
        }
        return true

      case 3:
        // Validate goals step
        const goals = document.querySelectorAll('input[name="goals[]"]:checked')
        if (goals.length === 0) {
          alert("Please select at least one goal to continue.")
          return false
        }
        return true

      default:
        return true
    }
  }

  function saveStepData(stepNumber) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    let userData = { ...currentUser }

    switch (stepNumber) {
      case 1:
        // Save profile data
        userData = {
          ...userData,
          name: document.getElementById("setup-name").value,
          dob: document.getElementById("setup-dob").value,
          gender: document.getElementById("setup-gender").value,
          location: document.getElementById("setup-location").value,
          about: document.getElementById("setup-about").value,
        }
        break

      case 2:
        // Save preferences data
        const interestCheckboxes = document.querySelectorAll('input[name="interests[]"]:checked')
        const interests = Array.from(interestCheckboxes).map((checkbox) => checkbox.value)

        const reminderCheckboxes = document.querySelectorAll('input[name="reminders[]"]:checked')
        const reminders = Array.from(reminderCheckboxes).map((checkbox) => checkbox.value)

        userData = {
          ...userData,
          interests: interests,
          reminders: reminders,
          reminderTime: document.getElementById("reminder-time").value,
        }
        break

      case 3:
        // Save goals data
        const goalCheckboxes = document.querySelectorAll('input[name="goals[]"]:checked')
        const goals = Array.from(goalCheckboxes).map((checkbox) => checkbox.value)

        const customGoal = document.getElementById("custom-goal").value
        if (customGoal) {
          goals.push(customGoal)
        }

        userData = {
          ...userData,
          goals: goals,
          goalTimeframe: document.getElementById("goal-timeframe").value,
          goalMotivation: document.getElementById("goal-motivation").value,
          isNewUser: false, // Mark user as no longer new after completing onboarding
        }
        break
    }

    // Update localStorage
    localStorage.setItem("currentUser", JSON.stringify(userData))

    // Update users array if it exists
    const users = JSON.parse(localStorage.getItem("users")) || []
    const userIndex = users.findIndex((user) => user.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData }
      localStorage.setItem("users", JSON.stringify(users))
    }
  }
})

