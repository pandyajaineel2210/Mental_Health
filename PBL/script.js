document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active")
      hamburger.classList.toggle("active")
    })
  }

  // Testimonial slider
  const testimonials = document.querySelectorAll(".testimonial")
  const dots = document.querySelectorAll(".slider-dot")
  let currentTestimonial = 0

  if (testimonials.length > 0 && dots.length > 0) {
    // Hide all testimonials except the first one
    for (let i = 1; i < testimonials.length; i++) {
      testimonials[i].style.display = "none"
    }

    // Add click event to dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showTestimonial(index)
      })
    })

    // Auto-rotate testimonials
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length
      showTestimonial(currentTestimonial)
    }, 5000)

    function showTestimonial(index) {
      // Hide all testimonials
      testimonials.forEach((testimonial) => {
        testimonial.style.display = "none"
      })

      // Remove active class from all dots
      dots.forEach((dot) => {
        dot.classList.remove("active")
      })

      // Show the selected testimonial and activate its dot
      testimonials[index].style.display = "block"
      dots[index].classList.add("active")
      currentTestimonial = index
    }
  }

  // Check if user is logged in (for demo purposes)
  if (!localStorage.getItem("userName") && window.location.pathname.includes("dashboard.html")) {
    // Set a default user name for demo
    localStorage.setItem("userName", "Demo User")
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })
})

