// --- Login Functionality --- //
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const messageContainer = document.getElementById("message-container");

function displayMessage(message, type) {
  if (!messageContainer) return;
  messageContainer.textContent = message;
  messageContainer.className = "";
  messageContainer.classList.add(type, "show");
}

function isValidEmail(email) {
  const emailRegEx = /\S+@\S+\.\S+/;
  return emailRegEx.test(email);
}

function isValidPassword(password) {
  return password.length >= 8;
}

async function handleLogin(event) {
  event.preventDefault();

  if (!emailInput || !passwordInput) return;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!isValidEmail(email)) {
    displayMessage("Invalid email format.", "error");
    return;
  }

  if (!isValidPassword(password)) {
    displayMessage("Password must be at least 8 characters.", "error");
    return;
  }

  try {
    const response = await fetch("api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
      displayMessage("Login successful! Redirecting...", "success");

      if (result.user) {
        localStorage.setItem("user_id", result.user.id);
        localStorage.setItem("user_name", result.user.name);
        localStorage.setItem("user_email", result.user.email);
      }

      setTimeout(() => {
        window.location.href = "src/admin/manage_users.html";
      }, 1500);
    } else {
      displayMessage(result.message || "Login failed.", "error");
    }
  } catch (error) {
    displayMessage("Network error. Please try again.", "error");
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

// --- Student Management ---
let students = [];

const studentTableBody = document.querySelector("#student-table tbody");
const addStudentForm = document.getElementById("add-student-form");
const changePasswordForm = document.getElementById("password-form");
const searchInput = document.getElementById("search-input");
const tableHeaders = document.querySelectorAll("#student-table thead th");

function createStudentRow(student) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${student.name}</td>
    <td>${student.student_id}</td>
    <td>${student.email}</td>
    <td>
      <button type="button" class="btn edit-btn" data-id="${student.student_id}">Edit</button>
      <button type="button" class="btn delete-btn" data-id="${student.student_id}">Delete</button>
    </td>
  `;
  return tr;
}

function renderTable(studentArray) {
  if (!studentTableBody) return;

  studentTableBody.innerHTML = "";
  studentArray.forEach(student => {
    studentTableBody.appendChild(createStudentRow(student));
  });
}

async function handleChangePassword(event) {
  event.preventDefault();
  if (!changePasswordForm) return;

  const currentPassword = document.getElementById("current-password")?.value.trim();
  const newPassword = document.getElementById("new-password")?.value.trim();
  const confirm = document.getElementById("confirm-password")?.value.trim();

  if (newPassword !== confirm) {
    alert("Passwords do not match.");
    return;
  }

  if (newPassword.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  try {
    const adminId = localStorage.getItem("user_id") || "ADMIN001";
    const response = await fetch("api/students_api.php?action=change_password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: adminId,
        current_password: currentPassword,
        new_password: newPassword
      })
    });

    const result = await response.json();

    if (result.success) {
      alert("Password updated successfully!");
      document.getElementById("current-password").value = "";
      document.getElementById("new-password").value = "";
      document.getElementById("confirm-password").value = "";
    } else {
      alert(result.message || "Failed to update password.");
    }
  } catch {
    alert("Network error. Please try again.");
  }
}

async function handleAddStudent(event) {
  event.preventDefault();
  if (!addStudentForm) return;

  const name = document.getElementById("student-name")?.value.trim();
  const studentId = document.getElementById("student-id")?.value.trim();
  const email = document.getElementById("student-email")?.value.trim();
  const defaultPassword =
    document.getElementById("default-password")?.value.trim() || "password123";

  if (!name || !studentId || !email) {
    alert("Please fill out all required fields.");
    return;
  }

  try {
    const response = await fetch("api/students_api.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        name,
        email,
        password: defaultPassword
      })
    });

    const result = await response.json();

    if (result.success) {
      students.push({ name, student_id: studentId, email });
      renderTable(students);
      alert("Student added successfully!");
    } else {
      alert(result.message || "Failed to add student.");
    }
  } catch {
    alert("Network error. Please try again.");
  }
}

function handleTableClick(event) {
  if (!studentTableBody) return;

  const target = event.target;
  const studentId = target.dataset.id;

  if (target.classList.contains("delete-btn")) {
    students = students.filter(s => s.student_id !== studentId);
    renderTable(students);
  }
}

function handleSearch(event) {
  const term = event.target.value.toLowerCase();
  if (!term) {
    renderTable(students);
    return;
  }

  renderTable(
    students.filter(s =>
      s.name.toLowerCase().includes(term) ||
      s.student_id.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term)
    )
  );
}

function handleSort(event) {
  const th = event.currentTarget;
  const index = th.cellIndex;
  const fields = ["name", "student_id", "email"];
  const field = fields[index];

  let dir = th.dataset.sortDir || "asc";
  dir = dir === "asc" ? "desc" : "asc";
  th.dataset.sortDir = dir;

  students.sort((a, b) =>
    dir === "asc"
      ? (a[field] || "").localeCompare(b[field] || "")
      : (b[field] || "").localeCompare(a[field] || "")
  );

  renderTable(students);
}

async function loadStudentsAndInitialize() {
  if (!studentTableBody) return;

  try {
    const response = await fetch("api/students_api.php");
    const result = await response.json();
    if (result.success && Array.isArray(result.data)) {
      students = result.data;
    }
  } catch {}

  renderTable(students);

  if (changePasswordForm)
    changePasswordForm.addEventListener("submit", handleChangePassword);

  if (addStudentForm)
    addStudentForm.addEventListener("submit", handleAddStudent);

  studentTableBody.addEventListener("click", handleTableClick);

  if (searchInput)
    searchInput.addEventListener("input", handleSearch);

  tableHeaders.forEach(th => th.addEventListener("click", handleSort));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadStudentsAndInitialize);
} else {
  loadStudentsAndInitialize();
}
