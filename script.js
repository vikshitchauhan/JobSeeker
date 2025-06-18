// Global variables
let currentUser = null
let jobApplications = []
let allUsers = []
let notifications = []
let currentEditingJob = null

// Mock data
const mockJobs = [
  {
    id: 1,
    company: "Google",
    role: "Software Engineer",
    status: "Interview",
    appliedDate: "2024-01-15",
    notes: "Technical interview scheduled for next week",
    salary: "$120,000",
    location: "Mountain View, CA",
    jobUrl: "https://careers.google.com/jobs/123",
    contactPerson: "John Smith",
    contactEmail: "john@google.com",
    userId: 1,
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Frontend Developer",
    status: "Applied",
    appliedDate: "2024-01-10",
    notes: "Applied through LinkedIn",
    salary: "$110,000",
    location: "Seattle, WA",
    jobUrl: "https://careers.microsoft.com/jobs/456",
    contactPerson: "Jane Doe",
    contactEmail: "jane@microsoft.com",
    userId: 1,
  },
  {
    id: 3,
    company: "Apple",
    role: "iOS Developer",
    status: "Offer",
    appliedDate: "2024-01-05",
    notes: "Received offer, negotiating salary",
    salary: "$130,000",
    location: "Cupertino, CA",
    jobUrl: "https://jobs.apple.com/jobs/789",
    contactPerson: "Bob Wilson",
    contactEmail: "bob@apple.com",
    userId: 2,
  },
  {
    id: 4,
    company: "Amazon",
    role: "Full Stack Developer",
    status: "Rejected",
    appliedDate: "2024-01-01",
    notes: "Did not pass technical assessment",
    salary: "$115,000",
    location: "Seattle, WA",
    jobUrl: "https://amazon.jobs/jobs/101",
    contactPerson: "Alice Brown",
    contactEmail: "alice@amazon.com",
    userId: 1,
  },
]

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "applicant",
    joinDate: "2024-01-01",
    lastActive: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "applicant",
    joinDate: "2024-01-05",
    lastActive: "2024-01-14",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    joinDate: "2024-01-01",
    lastActive: "2024-01-16",
  },
]

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("jobTracker_user")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    showDashboard()
  } else {
    showAuthPage()
  }

  // Initialize mock data
  jobApplications = [...mockJobs]
  allUsers = [...mockUsers]

  // Set up event listeners
  setupEventListeners()

  // Start real-time notifications
  startNotificationSystem()
})

function setupEventListeners() {
  // Auth form submission
  const authForm = document.getElementById("auth-form")
  if (authForm) {
    authForm.addEventListener("submit", handleAuthSubmit)
  }

  // Job form submission
  const jobForm = document.getElementById("job-form")
  if (jobForm) {
    jobForm.addEventListener("submit", handleJobSubmit)
  }

  // Close modal when clicking outside
  const modal = document.getElementById("job-modal")
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeJobModal()
      }
    })
  }

  // Close notifications when clicking outside
  document.addEventListener("click", (e) => {
    const notificationsPanel = document.getElementById("notifications-panel")
    const notificationBell = document.querySelector(".notification-bell")

    if (notificationsPanel && !notificationsPanel.contains(e.target) && !notificationBell.contains(e.target)) {
      notificationsPanel.style.display = "none"
    }
  })
}

// Authentication functions
function switchTab(tab) {
  const loginTab = document.querySelector(".tab-btn:first-child")
  const signupTab = document.querySelector(".tab-btn:last-child")
  const nameField = document.getElementById("name-field")
  const authTitle = document.getElementById("auth-title")
  const authSubtitle = document.getElementById("auth-subtitle")
  const authBtnText = document.getElementById("auth-btn-text")

  if (tab === "login") {
    loginTab.classList.add("active")
    signupTab.classList.remove("active")
    nameField.style.display = "none"
    authTitle.textContent = "Welcome Back"
    authSubtitle.textContent = "Sign in to your account to continue"
    authBtnText.textContent = "Sign In"
  } else {
    signupTab.classList.add("active")
    loginTab.classList.remove("active")
    nameField.style.display = "block"
    authTitle.textContent = "Create Account"
    authSubtitle.textContent = "Sign up to start tracking your applications"
    authBtnText.textContent = "Create Account"
  }
}

function togglePassword() {
  const passwordInput = document.getElementById("password")
  const passwordIcon = document.getElementById("password-icon")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    passwordIcon.className = "fas fa-eye-slash"
  } else {
    passwordInput.type = "password"
    passwordIcon.className = "fas fa-eye"
  }
}

function handleAuthSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const email = formData.get("email")
  const password = formData.get("password")
  const name = formData.get("name")
  const role = formData.get("role")

  const isSignup = document.querySelector(".tab-btn.active").textContent === "Sign Up"

  // Clear previous errors
  clearErrors()

  // Validate form
  if (!validateAuthForm(email, password, name, isSignup)) {
    return
  }

  // Show loading state
  const submitBtn = document.getElementById("auth-submit-btn")
  const btnText = document.getElementById("auth-btn-text")
  const loading = document.getElementById("auth-loading")

  submitBtn.disabled = true
  btnText.style.display = "none"
  loading.style.display = "inline-block"

  // Simulate API call
  setTimeout(() => {
    if (isSignup) {
      // Create new user
      const newUser = {
        id: allUsers.length + 1,
        name: name,
        email: email,
        role: role,
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString().split("T")[0],
      }
      allUsers.push(newUser)
      currentUser = newUser
    } else {
      // Find existing user (mock authentication)
      const user = allUsers.find((u) => u.email === email)
      if (user) {
        currentUser = user
      } else {
        // Create mock user for demo
        currentUser = {
          id: 1,
          name: "Demo User",
          email: email,
          role: role,
          joinDate: "2024-01-01",
          lastActive: new Date().toISOString().split("T")[0],
        }
      }
    }

    // Save user to localStorage
    localStorage.setItem("jobTracker_user", JSON.stringify(currentUser))

    // Show dashboard
    showDashboard()

    // Reset form
    submitBtn.disabled = false
    btnText.style.display = "inline"
    loading.style.display = "none"

    // Show success notification
    addNotification(`Welcome ${currentUser.name}! You've successfully ${isSignup ? "signed up" : "signed in"}.`)
  }, 1500)
}

function validateAuthForm(email, password, name, isSignup) {
  let isValid = true

  // Email validation
  if (!email || !isValidEmail(email)) {
    showError("email-error", "Please enter a valid email address")
    isValid = false
  }

  // Password validation
  if (!password || password.length < 6) {
    showError("password-error", "Password must be at least 6 characters long")
    isValid = false
  }

  // Name validation for signup
  if (isSignup && (!name || name.trim().length < 2)) {
    showError("name-error", "Please enter your full name")
    isValid = false
  }

  return isValid
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)
  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"
  }
}

function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message")
  errorElements.forEach((element) => {
    element.style.display = "none"
    element.textContent = ""
  })
}

// Dashboard functions
function showAuthPage() {
  document.getElementById("auth-page").style.display = "block"
  document.getElementById("dashboard-page").style.display = "none"
  document.getElementById("admin-page").style.display = "none"
}

function showDashboard() {
  if (currentUser.role === "admin") {
    showAdminDashboard()
  } else {
    showApplicantDashboard()
  }
}

function showApplicantDashboard() {
  document.getElementById("auth-page").style.display = "none"
  document.getElementById("dashboard-page").style.display = "block"
  document.getElementById("admin-page").style.display = "none"

  // Update user info
  document.getElementById("user-name").textContent = currentUser.name

  // Load user's jobs
  loadUserJobs()
  updateStats()
}

function showAdminDashboard() {
  document.getElementById("auth-page").style.display = "none"
  document.getElementById("dashboard-page").style.display = "none"
  document.getElementById("admin-page").style.display = "block"

  // Update admin info
  document.getElementById("admin-name").textContent = currentUser.name

  // Load admin data
  loadAdminData()
}

function loadUserJobs() {
  const userJobs = jobApplications.filter((job) => job.userId === currentUser.id)
  displayJobs(userJobs)
}

function displayJobs(jobs) {
  const jobsList = document.getElementById("jobs-list")
  const emptyState = document.getElementById("empty-state")

  if (jobs.length === 0) {
    jobsList.innerHTML = ""
    emptyState.style.display = "block"
    return
  }

  emptyState.style.display = "none"

  jobsList.innerHTML = jobs
    .map(
      (job) => `
        <div class="job-card" data-job-id="${job.id}">
            <div class="job-header">
                <div class="job-title">
                    <h3>${job.role}</h3>
                    <span class="status-badge status-${job.status.toLowerCase()}">${job.status}</span>
                </div>
                <div class="job-actions">
                    <button class="action-btn" onclick="viewJob(${job.id})" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" onclick="editJob(${job.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteJob(${job.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="job-details">
                <div class="job-detail">
                    <i class="fas fa-building"></i>
                    <span>${job.company}</span>
                </div>
                <div class="job-detail">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Applied: ${formatDate(job.appliedDate)}</span>
                </div>
                ${job.salary ? `<div class="job-detail job-salary">${job.salary}</div>` : ""}
                ${job.location ? `<div class="job-detail"><i class="fas fa-map-marker-alt"></i><span>${job.location}</span></div>` : ""}
            </div>
            
            ${job.notes ? `<div class="job-notes">${job.notes}</div>` : ""}
        </div>
    `,
    )
    .join("")
}

function updateStats() {
  const userJobs = jobApplications.filter((job) => job.userId === currentUser.id)

  document.getElementById("total-applications").textContent = userJobs.length
  document.getElementById("interview-count").textContent = userJobs.filter((job) => job.status === "Interview").length
  document.getElementById("offer-count").textContent = userJobs.filter((job) => job.status === "Offer").length

  const successfulJobs = userJobs.filter((job) => job.status === "Offer" || job.status === "Accepted").length
  const successRate = userJobs.length > 0 ? Math.round((successfulJobs / userJobs.length) * 100) : 0
  document.getElementById("success-rate").textContent = successRate + "%"
}

function filterJobs() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase()
  const statusFilter = document.getElementById("status-filter").value

  let filteredJobs = jobApplications.filter((job) => job.userId === currentUser.id)

  if (searchTerm) {
    filteredJobs = filteredJobs.filter(
      (job) => job.company.toLowerCase().includes(searchTerm) || job.role.toLowerCase().includes(searchTerm),
    )
  }

  if (statusFilter !== "All") {
    filteredJobs = filteredJobs.filter((job) => job.status === statusFilter)
  }

  displayJobs(filteredJobs)
}

// Job management functions
function showAddJobModal() {
  currentEditingJob = null
  document.getElementById("modal-title").textContent = "Add Job Application"
  document.getElementById("save-btn-text").textContent = "Save Application"

  // Reset form
  document.getElementById("job-form").reset()
  document.getElementById("job-date").value = new Date().toISOString().split("T")[0]

  document.getElementById("job-modal").style.display = "flex"
}

function editJob(jobId) {
  const job = jobApplications.find((j) => j.id === jobId)
  if (!job) return

  currentEditingJob = job
  document.getElementById("modal-title").textContent = "Edit Job Application"
  document.getElementById("save-btn-text").textContent = "Update Application"

  // Populate form
  document.getElementById("job-company").value = job.company
  document.getElementById("job-role").value = job.role
  document.getElementById("job-status").value = job.status
  document.getElementById("job-date").value = job.appliedDate
  document.getElementById("job-salary").value = job.salary || ""
  document.getElementById("job-location").value = job.location || ""
  document.getElementById("job-url").value = job.jobUrl || ""
  document.getElementById("job-contact").value = job.contactPerson || ""
  document.getElementById("job-contact-email").value = job.contactEmail || ""
  document.getElementById("job-notes").value = job.notes || ""

  document.getElementById("job-modal").style.display = "flex"
}

function viewJob(jobId) {
  const job = jobApplications.find((j) => j.id === jobId)
  if (!job) return

  // For now, just edit the job. In a real app, this would show a read-only view
  editJob(jobId)
}

function deleteJob(jobId) {
  if (confirm("Are you sure you want to delete this job application?")) {
    jobApplications = jobApplications.filter((job) => job.id !== jobId)
    loadUserJobs()
    updateStats()
    addNotification("Job application deleted successfully")
  }
}

function closeJobModal() {
  document.getElementById("job-modal").style.display = "none"
  currentEditingJob = null
}

function handleJobSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const jobData = {
    company: formData.get("company"),
    role: formData.get("role"),
    status: formData.get("status"),
    appliedDate: formData.get("appliedDate"),
    salary: formData.get("salary"),
    location: formData.get("location"),
    jobUrl: formData.get("jobUrl"),
    contactPerson: formData.get("contactPerson"),
    contactEmail: formData.get("contactEmail"),
    notes: formData.get("notes"),
  }

  // Validate required fields
  if (!jobData.company || !jobData.role || !jobData.appliedDate) {
    alert("Please fill in all required fields")
    return
  }

  if (currentEditingJob) {
    // Update existing job
    const index = jobApplications.findIndex((job) => job.id === currentEditingJob.id)
    if (index !== -1) {
      jobApplications[index] = { ...currentEditingJob, ...jobData }
      addNotification(`Job application for ${jobData.role} at ${jobData.company} updated successfully`)
    }
  } else {
    // Add new job
    const newJob = {
      id: Date.now(),
      ...jobData,
      userId: currentUser.id,
    }
    jobApplications.push(newJob)
    addNotification(`Job application for ${jobData.role} at ${jobData.company} added successfully`)
  }

  closeJobModal()
  loadUserJobs()
  updateStats()
}

// Admin functions
function loadAdminData() {
  updateAdminStats()
  loadRecentApplications()
  loadAllUsers()
  loadAllApplications()
}

function updateAdminStats() {
  document.getElementById("admin-total-users").textContent = allUsers.filter((u) => u.role === "applicant").length
  document.getElementById("admin-total-apps").textContent = jobApplications.length
  document.getElementById("users-count").textContent = allUsers.filter((u) => u.role === "applicant").length
  document.getElementById("admin-apps-count").textContent = jobApplications.length

  const successfulJobs = jobApplications.filter((job) => job.status === "Offer" || job.status === "Accepted").length
  const successRate = jobApplications.length > 0 ? Math.round((successfulJobs / jobApplications.length) * 100) : 0
  document.getElementById("admin-success-rate").textContent = successRate + "%"

  // Calculate active users (mock - users active in last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const activeUsers = allUsers.filter((user) => {
    const lastActive = new Date(user.lastActive)
    return lastActive > weekAgo
  }).length
  document.getElementById("admin-active-users").textContent = activeUsers
}

function loadRecentApplications() {
  const recentApps = jobApplications.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 5)

  const recentApplicationsContainer = document.getElementById("recent-applications")
  recentApplicationsContainer.innerHTML = recentApps
    .map((job) => {
      const user = allUsers.find((u) => u.id === job.userId)
      return `
            <div class="activity-item">
                <div class="activity-info">
                    <div class="activity-icon">
                        <i class="fas fa-briefcase"></i>
                    </div>
                    <div class="activity-details">
                        <h4>${user ? user.name : "Unknown User"}</h4>
                        <p>Applied to ${job.company} for ${job.role}</p>
                    </div>
                </div>
                <div class="activity-meta">
                    <span class="status-badge status-${job.status.toLowerCase()}">${job.status}</span>
                    <span>${formatDate(job.appliedDate)}</span>
                </div>
            </div>
        `
    })
    .join("")
}

function loadAllUsers() {
  const applicants = allUsers.filter((user) => user.role === "applicant")
  const usersContainer = document.getElementById("users-list")

  usersContainer.innerHTML = applicants
    .map((user) => {
      const userJobs = jobApplications.filter((job) => job.userId === user.id)
      return `
            <div class="user-card">
                <div class="user-info-section">
                    <div class="user-avatar">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="user-details">
                        <h3>${user.name}</h3>
                        <div class="user-meta">
                            <div class="user-meta-item">
                                <i class="fas fa-envelope"></i>
                                <span>${user.email}</span>
                            </div>
                            <div class="user-meta-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>Joined ${formatDate(user.joinDate)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="user-stats">
                    <p><span class="stat-number">${userJobs.length}</span> <span class="stat-label">Applications</span></p>
                    <p><span class="stat-label">Last active:</span> ${formatDate(user.lastActive)}</p>
                </div>
            </div>
        `
    })
    .join("")
}

function loadAllApplications() {
  displayAdminJobs(jobApplications)
}

function displayAdminJobs(jobs) {
  const jobsList = document.getElementById("admin-jobs-list")

  jobsList.innerHTML = jobs
    .map((job) => {
      const user = allUsers.find((u) => u.id === job.userId)
      return `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <div class="job-title">
                        <h3>${job.role}</h3>
                        <span class="status-badge status-${job.status.toLowerCase()}">${job.status}</span>
                    </div>
                    <div class="job-actions">
                        <button class="action-btn" onclick="viewJob(${job.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" onclick="editJob(${job.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteJob(${job.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="job-details">
                    <div class="job-detail">
                        <i class="fas fa-user"></i>
                        <span>${user ? user.name : "Unknown User"}</span>
                    </div>
                    <div class="job-detail">
                        <i class="fas fa-building"></i>
                        <span>${job.company}</span>
                    </div>
                    <div class="job-detail">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formatDate(job.appliedDate)}</span>
                    </div>
                    ${job.salary ? `<div class="job-detail job-salary">${job.salary}</div>` : ""}
                </div>
                
                ${job.location ? `<div class="job-detail"><i class="fas fa-map-marker-alt"></i><span>${job.location}</span></div>` : ""}
                ${job.notes ? `<div class="job-notes">${job.notes}</div>` : ""}
            </div>
        `
    })
    .join("")
}

function switchAdminTab(tab) {
  // Update tab buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.remove("active"))
  event.target.classList.add("active")

  // Show/hide tab content
  document.querySelectorAll(".admin-tab-content").forEach((content) => {
    content.style.display = "none"
  })
  document.getElementById(`admin-${tab}`).style.display = "block"

  // Load data for the selected tab
  if (tab === "overview") {
    loadRecentApplications()
  } else if (tab === "users") {
    loadAllUsers()
  } else if (tab === "applications") {
    loadAllApplications()
  }
}

function filterAdminJobs() {
  const searchTerm = document.getElementById("admin-search-input").value.toLowerCase()
  const statusFilter = document.getElementById("admin-status-filter").value

  let filteredJobs = [...jobApplications]

  if (searchTerm) {
    filteredJobs = filteredJobs.filter((job) => {
      const user = allUsers.find((u) => u.id === job.userId)
      return (
        job.company.toLowerCase().includes(searchTerm) ||
        job.role.toLowerCase().includes(searchTerm) ||
        (user && user.name.toLowerCase().includes(searchTerm))
      )
    })
  }

  if (statusFilter !== "All") {
    filteredJobs = filteredJobs.filter((job) => job.status === statusFilter)
  }

  displayAdminJobs(filteredJobs)
}

function exportData() {
  const data = {
    users: allUsers.filter((u) => u.role === "applicant"),
    applications: jobApplications,
    exportDate: new Date().toISOString(),
  }

  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: "application/json" })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement("a")
  link.href = url
  link.download = `job-tracker-export-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  addNotification("Data exported successfully")
}

// Notification functions
function startNotificationSystem() {
  // Simulate real-time notifications
  const notificationMessages = [
    "New job matching your profile available!",
    "Interview reminder: Google interview tomorrow",
    "Application status updated for Microsoft",
    "Salary negotiation tips available",
    "New company added to job board",
    "Weekly application summary ready",
  ]

  setInterval(() => {
    if (currentUser && Math.random() > 0.7) {
      // 30% chance every 10 seconds
      const randomMessage = notificationMessages[Math.floor(Math.random() * notificationMessages.length)]
      addNotification(randomMessage)
    }
  }, 10000)
}

function addNotification(message) {
  const notification = {
    id: Date.now(),
    message: message,
    timestamp: new Date(),
    read: false,
  }

  notifications.unshift(notification)

  // Keep only last 10 notifications
  if (notifications.length > 10) {
    notifications = notifications.slice(0, 10)
  }

  updateNotificationCount()
  updateNotificationsList()

  // Show toast notification
  showToast(message)
}

function updateNotificationCount() {
  const unreadCount = notifications.filter((n) => !n.read).length
  const countElement = document.getElementById("notification-count")
  if (countElement) {
    countElement.textContent = unreadCount
    countElement.style.display = unreadCount > 0 ? "block" : "none"
  }
}

function updateNotificationsList() {
  const notificationsList = document.getElementById("notifications-list")
  if (!notificationsList) return

  notificationsList.innerHTML = notifications
    .map(
      (notification) => `
        <div class="notification-item ${notification.read ? "read" : "unread"}">
            <div class="notification-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="notification-content">
                <div class="notification-text">${notification.message}</div>
                <div class="notification-time">${formatTimeAgo(notification.timestamp)}</div>
            </div>
        </div>
    `,
    )
    .join("")
}

function toggleNotifications() {
  const panel = document.getElementById("notifications-panel")
  const isVisible = panel.style.display === "block"

  if (isVisible) {
    panel.style.display = "none"
  } else {
    panel.style.display = "block"
    // Mark all notifications as read
    notifications.forEach((n) => (n.read = true))
    updateNotificationCount()
    updateNotificationsList()
  }
}

function clearNotifications() {
  notifications = []
  updateNotificationCount()
  updateNotificationsList()
  document.getElementById("notifications-panel").style.display = "none"
}

function showToast(message) {
  // Create toast element
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `

  // Add toast styles
  toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `

  document.body.appendChild(toast)

  // Animate in
  setTimeout(() => {
    toast.style.transform = "translateX(0)"
  }, 100)

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatTimeAgo(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("jobTracker_user")
    currentUser = null
    notifications = []
    showAuthPage()
  }
}

// Initialize date input with today's date
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("job-date")
  if (dateInput) {
    dateInput.value = new Date().toISOString().split("T")[0]
  }
})
