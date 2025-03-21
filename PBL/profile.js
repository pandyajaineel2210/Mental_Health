import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser || !currentUser.isLoggedIn) {
    window.location.href = "login.html"
    return
  }

  // Set user information
  setUserInfo(currentUser)

  // Handle tab navigation
  const tabLinks = document.querySelectorAll(".profile-nav-item")
  const tabContents = document.querySelectorAll(".profile-tab")

  tabLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const tabId = this.getAttribute("data-tab")

      // Update active tab link
      tabLinks.forEach((link) => link.classList.remove("active"))
      this.classList.add("active")

      // Show active tab content
      tabContents.forEach((tab) => tab.classList.remove("active"))
      document.getElementById(tabId).classList.add("active")

      // Update URL hash
      window.location.hash = tabId
    })
  })

  // Check URL hash on page load
  if (window.location.hash) {
    const hash = window.location.hash.substring(1)
    const tabLink = document.querySelector(`.profile-nav-item[data-tab="${hash}"]`)
    if (tabLink) {
      tabLink.click()
    }
  }

  // Handle edit profile button
  document.getElementById("edit-profile-btn").addEventListener("click", () => {
    document.querySelector('.edit-section-btn[data-section="personal"]').click()
  })

  // Handle section edit buttons
  const editButtons = document.querySelectorAll(".edit-section-btn")
  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const section = this.getAttribute("data-section")
      document.getElementById(`${section}-view`).classList.add("hidden")
      document.getElementById(`${section}-edit`).classList.remove("hidden")
    })
  })

  // Handle cancel edit buttons
  const cancelButtons = document.querySelectorAll(".cancel-edit")
  cancelButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const section = this.getAttribute("data-section")
      document.getElementById(`${section}-edit`).classList.add("hidden")
      document.getElementById(`${section}-view`).classList.remove("hidden")
    })
  })

  // Handle personal info form submission
  const personalInfoForm = document.getElementById("personal-info-form")
  if (personalInfoForm) {
    personalInfoForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("edit-name").value
      const email = document.getElementById("edit-email").value
      const dob = document.getElementById("edit-dob").value
      const location = document.getElementById("edit-location").value

      // Update display values
      document.getElementById("display-name").textContent = name
      document.getElementById("display-email").textContent = email
      document.getElementById("display-dob").textContent = formatDate(dob)
      document.getElementById("display-location").textContent = location

      // Update profile header
      document.getElementById("profile-name").textContent = name
      document.getElementById("profile-email").textContent = email

      // Update avatar initials
      updateAvatarInitials(name)

      // Update user in localStorage
      updateUserInfo({
        name: name,
        email: email,
        dob: dob,
        location: location,
      })

      // Hide edit form
      document.getElementById("personal-info-edit").classList.add("hidden")
      document.getElementById("personal-info-view").classList.remove("hidden")
    })
  }

  // Handle about form submission
  const aboutForm = document.getElementById("about-form")
  if (aboutForm) {
    aboutForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const about = document.getElementById("edit-about").value

      // Update display value
      document.getElementById("display-about").textContent = about

      // Update user in localStorage
      updateUserInfo({
        about: about,
      })

      // Hide edit form
      document.getElementById("about-edit").classList.add("hidden")
      document.getElementById("about-view").classList.remove("hidden")
    })
  }

  // Handle interests form submission
  const interestsForm = document.getElementById("interests-form")
  if (interestsForm) {
    interestsForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const interestCheckboxes = document.querySelectorAll('input[name="interests[]"]:checked')
      const interests = Array.from(interestCheckboxes).map((checkbox) => checkbox.value)

      // Update display value
      const interestsTags = document.querySelector(".interests-tags")
      interestsTags.innerHTML = ""
      interests.forEach((interest) => {
        const tag = document.createElement("span")
        tag.className = "interest-tag"
        tag.textContent = interest
        interestsTags.appendChild(tag)
      })

      // Update user in localStorage
      updateUserInfo({
        interests: interests,
      })

      // Hide edit form
      document.getElementById("interests-edit").classList.add("hidden")
      document.getElementById("interests-view").classList.remove("hidden")
    })
  }

  // Handle goals
  const addGoalBtn = document.getElementById("add-goal-btn")
  const cancelGoalBtn = document.getElementById("cancel-goal-btn")
  const goalForm = document.getElementById("goal-form")

  if (addGoalBtn) {
    addGoalBtn.addEventListener("click", function () {
      document.getElementById("add-goal-form").classList.remove("hidden")
      this.classList.add("hidden")
    })
  }

  if (cancelGoalBtn) {
    cancelGoalBtn.addEventListener("click", () => {
      document.getElementById("add-goal-form").classList.add("hidden")
      document.getElementById("add-goal-btn").classList.remove("hidden")
      goalForm.reset()
    })
  }

  if (goalForm) {
    goalForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const title = document.getElementById("goal-title").value
      const description = document.getElementById("goal-description").value
      const startDate = document.getElementById("goal-start-date").value
      const target = document.getElementById("goal-target").value

      // Create new goal card
      const goalsList = document.getElementById("goals-list")
      const goalCard = document.createElement("div")
      goalCard.className = "goal-card"
      goalCard.innerHTML = `
                <div class="goal-header">
                    <h3>${title}</h3>
                    <div class="goal-actions">
                        <button class="btn-icon edit-goal-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-goal-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="goal-content">
                    <p>${description}</p>
                    <div class="goal-progress">
                        <div class="progress-bar">
                            <div class="progress" style="width: 0%"></div>
                        </div>
                        <span class="progress-text">0% Complete</span>
                    </div>
                    <div class="goal-meta">
                        <span class="goal-date"><i class="fas fa-calendar"></i> Started: ${formatDate(startDate)}</span>
                        <span class="goal-target"><i class="fas fa-bullseye"></i> Target: ${formatTarget(target)}</span>
                    </div>
                </div>
            `

      goalsList.appendChild(goalCard)

      // Add event listeners to new goal card buttons
      const editGoalBtn = goalCard.querySelector(".edit-goal-btn")
      const deleteGoalBtn = goalCard.querySelector(".delete-goal-btn")

      editGoalBtn.addEventListener("click", () => {
        // In a real app, this would open an edit form for the goal
        alert("Edit goal functionality would be implemented here.")
      })

      deleteGoalBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this goal?")) {
          goalCard.remove()
        }
      })

      // Hide form and show add button
      document.getElementById("add-goal-form").classList.add("hidden")
      document.getElementById("add-goal-btn").classList.remove("hidden")
      goalForm.reset()
    })
  }

  // Handle preferences forms
  const preferenceForms = document.querySelectorAll("#notifications-form, #display-form, #privacy-form")
  preferenceForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("Settings saved successfully!")
    })
  })

  // Handle special buttons
  const exportDataBtn = document.getElementById("export-data-btn")
  const deleteAccountBtn = document.getElementById("delete-account-btn")

  if (exportDataBtn) {
    exportDataBtn.addEventListener("click", () => {
      alert("Your data export has been initiated. You will receive an email with your data shortly.")
    })
  }

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        alert("Your account has been scheduled for deletion. You will be logged out now.")
        logout()
      }
    })
  }

  // Handle logout
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      logout()
    })
  }

  // Initialize charts
  initCharts()

  // Helper functions
  function setUserInfo(user) {
    // Set profile header info
    document.getElementById("profile-name").textContent = user.name || "User"
    document.getElementById("profile-email").textContent = user.email || ""
    document.getElementById("profile-date").textContent = "January 2023" // Demo data

    // Set personal info
    document.getElementById("display-name").textContent = user.name || "User"
    document.getElementById("display-email").textContent = user.email || ""
    document.getElementById("display-dob").textContent = user.dob ? formatDate(user.dob) : "January 15, 1990" // Demo data
    document.getElementById("display-location").textContent = user.location || "New York, USA" // Demo data

    // Set form values
    document.getElementById("edit-name").value = user.name || ""
    document.getElementById("edit-email").value = user.email || ""
    document.getElementById("edit-dob").value = user.dob || "1990-01-15" // Demo data
    document.getElementById("edit-location").value = user.location || "New York, USA" // Demo data

    // Set about info
    const aboutText =
      user.about ||
      "I'm on a journey to improve my mental wellbeing and track my moods. I enjoy meditation, hiking, and reading self-improvement books."
    document.getElementById("display-about").textContent = aboutText
    document.getElementById("edit-about").value = aboutText

    // Set avatar initials
    updateAvatarInitials(user.name)
  }

  function updateAvatarInitials(name) {
    const initials = name ? getInitials(name) : "U"
    document.getElementById("avatar-initials").textContent = initials
    document.getElementById("profile-avatar-initials").textContent = initials
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  function updateUserInfo(updates) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    const updatedUser = { ...currentUser, ...updates }
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Update users array if it exists
    const users = JSON.parse(localStorage.getItem("users")) || []
    const userIndex = users.findIndex((user) => user.id === currentUser.id)
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem("users", JSON.stringify(users))
    }
  }

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  function formatTarget(target) {
    switch (target) {
      case "daily":
        return "Daily"
      case "weekly":
        return "3x Weekly"
      case "monthly":
        return "Monthly"
      case "custom":
        return "Custom"
      default:
        return target
    }
  }

  function logout() {
    // Update current user in localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    if (currentUser) {
      currentUser.isLoggedIn = false
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
    }

    // Redirect to login page
    window.location.href = "login.html"
  }

  function initCharts() {
    // Mood trends chart
    const moodTrendsCtx = document.getElementById("moodTrendsChart")
    if (moodTrendsCtx) {
      const moodTrendsChart = new Chart(moodTrendsCtx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Mood Level",
              data: [3, 2, 4, 3, 5, 4, 4],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: "rgba(75, 192, 192, 1)",
              pointRadius: 4,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 5,
              ticks: {
                stepSize: 1,
                callback: (value) => {
                  const labels = ["", "Bad", "Low", "Okay", "Good", "Great"]
                  return labels[value]
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      })
    }
  }
})

