
// --- Login Functionality ---
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
    const response = await fetch('api/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      displayMessage("Login successful! Redirecting...", "success");
      // Store user data if needed
      if (result.user) {
        localStorage.setItem('user_id', result.user.id);
        localStorage.setItem('user_name', result.user.name);
        localStorage.setItem('user_email', result.user.email);
      }
      // Redirect after delay
      setTimeout(() => {
        window.location.href = 'src/admin/manage_users.html';
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
    </td>`;
  return tr;
}

function renderTable(studentArray) {
  studentTableBody.innerHTML = "";
  studentArray.forEach(student => {
    studentTableBody.appendChild(createStudentRow(student));
  });
}

// --- Password Change ---
async function handleChangePassword(event) {
  event.preventDefault();
  const currentPassword = document.getElementById("current-password").value.trim();
  const newPassword = document.getElementById("new-password").value.trim();
  const confirm = document.getElementById("confirm-password").value.trim();

  if (newPassword !== confirm) {
    alert("Passwords do not match.");
    return;
  }
  if (newPassword.length < 8) {
    alert("Password must be at least 8 characters.");
    return;
  }

  try {
    // Get admin ID - you should get this from session/localStorage
    const adminId = localStorage.getItem('user_id') || 'ADMIN001';
    
    const response = await fetch('api/students_api.php?action=change_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  } catch (error) {
    alert("Network error. Please try again.");
  }
}

// --- Add Student ---
async function handleAddStudent(event) {
  event.preventDefault();
  const name = document.getElementById("student-name").value.trim();
  const studentId = document.getElementById("student-id").value.trim();
  const email = document.getElementById("student-email").value.trim();
  const defaultPassword = document.getElementById("default-password").value.trim() || "password123";

  if (!name || !studentId || !email) {
    alert("Please fill out all required fields.");
    return;
  }

  try {
    const response = await fetch('api/students_api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: studentId,
        name: name,
        email: email,
        password: defaultPassword
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert("Student added successfully!");
      
      // Add to local array for immediate display
      const newStudent = { 
        name: name, 
        student_id: studentId, 
        email: email 
      };
      students.push(newStudent);
      renderTable(students);

      // Clear form
      document.getElementById("student-name").value = "";
      document.getElementById("student-id").value = "";
      document.getElementById("student-email").value = "";
      document.getElementById("default-password").value = "password123";
    } else {
      alert(result.message || "Failed to add student.");
    }
  } catch (error) {
    alert("Network error. Please try again.");
  }
}

// --- Edit/Delete Student ---
async function handleTableClick(event) {
  const target = event.target;
  const studentId = target.dataset.id;

  if (target.classList.contains("delete-btn")) {
    if (!confirm(`Are you sure you want to delete student ${studentId}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`api/students_api.php?student_id=${studentId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        students = students.filter(student => student.student_id !== studentId);
        renderTable(students);
        alert("Student deleted successfully!");
      } else {
        alert(result.message || "Failed to delete student.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  } else if (target.classList.contains("edit-btn")) {
    const student = students.find(s => s.student_id === studentId);
    if (student) {
      const newName = prompt("Edit student name:", student.name);
      const newEmail = prompt("Edit student email:", student.email);
      if (newName && newEmail) {
        try {
          const response = await fetch('api/students_api.php', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              student_id: studentId,
              name: newName.trim(),
              email: newEmail.trim()
            })
          });
          
          const result = await response.json();
          
          if (result.success) {
            student.name = newName.trim();
            student.email = newEmail.trim();
            renderTable(students);
            alert("Student updated successfully!");
          } else {
            alert(result.message || "Failed to update student.");
          }
        } catch (error) {
          alert("Network error. Please try again.");
        }
      }
    }
  }
}

// --- Search Students ---
function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  if (!searchTerm) {
    renderTable(students);
    return;
  }
  const filtered = students.filter(
    s => s.name.toLowerCase().includes(searchTerm) ||
         s.student_id.toLowerCase().includes(searchTerm) ||
         s.email.toLowerCase().includes(searchTerm)
  );
  renderTable(filtered);
}

// --- Sort Table ---
function handleSort(event) {
  const th = event.currentTarget;
  const index = th.cellIndex;
  const fields = ["name", "student_id", "email"];
  const field = fields[index];

  let direction = th.dataset.sortDir || "asc";
  direction = direction === "asc" ? "desc" : "asc";
  th.dataset.sortDir = direction;

  students.sort((a, b) => {
    let valA = (a[field] || "").toLowerCase();
    let valB = (b[field] || "").toLowerCase();

    if (field === "student_id") {
      valA = a[field] || "";
      valB = b[field] || "";
      return direction === "asc" 
        ? valA.localeCompare(valB, undefined, { numeric: true }) 
        : valB.localeCompare(valA, undefined, { numeric: true });
    }

    return direction === "asc" 
      ? valA.localeCompare(valB) 
      : valB.localeCompare(valA);
  });

  renderTable(students);
}

// --- Initialize ---
async function loadStudentsAndInitialize() {
  try {
    const response = await fetch('api/students_api.php');
    const result = await response.json();
    
    if (result.success && Array.isArray(result.data)) {
      students = result.data;
    } else {
      console.error("Failed to load students:", result.message);
    }

  } catch (error) {
    console.error("Error loading students:", error);
  }

  renderTable(students);

  if (changePasswordForm) changePasswordForm.addEventListener("submit", handleChangePassword);
  if (addStudentForm) addStudentForm.addEventListener("submit", handleAddStudent);
  if (studentTableBody) studentTableBody.addEventListener("click", handleTableClick);
  if (searchInput) searchInput.addEventListener("input", handleSearch);
  tableHeaders.forEach(th => th.addEventListener("click", handleSort));
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadStudentsAndInitialize);
} else {
  loadStudentsAndInitialize();
}