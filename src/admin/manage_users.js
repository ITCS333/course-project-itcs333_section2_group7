/*
  Requirement: Add interactivity and data management to the Admin Portal.

  Instructions:
  1. Link this file to your HTML using a <script> tag with the 'defer' attribute.
     Example: <script src="manage_users.js" defer></script>
  2. Implement the JavaScript functionality as described in the TODO comments.
  3. All data management will be done by manipulating the 'students' array
     and re-rendering the table.
*/

// --- Global Data Store ---
let students = [];

// --- Element Selections ---
const studentTableBody = document.querySelector("#student-table tbody");
const addStudentForm = document.getElementById("add-student-form");
const changePasswordForm = document.getElementById("password-form");
const searchInput = document.getElementById("search-input");
const tableHeaders = document.querySelectorAll("#student-table thead th");

// --- Functions ---

function createStudentRow(student) {
  const tr = document.createElement("tr");

  tr.innerHTML = `<td>${student.name}</td>
    <td>${student.id}</td>
    <td>${student.email}</td>
    <td>
      <button class="btn edit-btn" data-id="${student.id}">Edit</button>
      <button class="btn delete-btn" data-id="${student.id}">Delete</button>
    </td>`;
  return tr;
}

function renderTable(studentArray) {
  if (!studentTableBody) return;

  studentTableBody.innerHTML = "";
  for (let i = 0; i < studentArray.length; i++) {
    const row = createStudentRow(studentArray[i]);
    studentTableBody.appendChild(row);
  }
}

function handleChangePassword(event) {
  event.preventDefault();

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

  alert("Password updated successfully!");

  document.getElementById("current-password").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("confirm-password").value = "";
}

function handleAddStudent(event) {
  event.preventDefault();

  const name = document.getElementById("student-name")?.value.trim();
  const id = document.getElementById("student-id")?.value.trim();
  const email = document.getElementById("student-email")?.value.trim();

  if (!name || !id || !email) {
    alert("Please fill out all required fields.");
    return;
  }

  const existingStudent = students.find(student => student.id === id);
  if (existingStudent) {
    alert("A student with this ID already exists.");
    return;
  }

  let newStudent = { name, id, email };
  students.push(newStudent);

  renderTable(students);

  document.getElementById("student-name").value = "";
  document.getElementById("student-id").value = "";
  document.getElementById("student-email").value = "";
  const defaultPassword = document.getElementById("default-password");
  if (defaultPassword) defaultPassword.value = "";
}

function handleTableClick(event) {
  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.dataset.id;
    students = students.filter(student => student.id !== id);
    renderTable(students);
  } else if (event.target.classList.contains("edit-btn")) {
    const id = event.target.dataset.id;
    const student = students.find(s => s.id === id);
    if (student) {
      const newName = prompt("Edit student name:", student.name);
      const newEmail = prompt("Edit student email:", student.email);
      if (newName && newEmail) {
        student.name = newName.trim();
        student.email = newEmail.trim();
        renderTable(students);
      }
    }
  }
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase();
  if (!searchTerm) {
    renderTable(students);
    return;
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm)
  );
  renderTable(filtered);
}

function handleSort(event) {
  const th = event.currentTarget;
  const index = th.cellIndex;
  const fields = ["name", "id", "email"];
  const field = fields[index];

  let direction = th.dataset.sortDir || "asc";
  direction = direction === "asc" ? "desc" : "asc";
  th.dataset.sortDir = direction;

  students.sort((a, b) => {
    let comparison = 0;
    if (field === "id") {
      comparison = Number(a.id) - Number(b.id);
    } else {
      comparison = (a[field] || "").localeCompare(b[field] || "");
    }
    return direction === "asc" ? comparison : -comparison;
  });

  renderTable(students);
}

async function loadStudentsAndInitialize() {
  try {
    const response = await fetch("api/students.json");
    if (!response.ok) {
      console.error("Failed to load students.json");
      return;
    }
    students = await response.json();
  } catch (error) {
    console.error("Error loading students.json:", error);
  }

  renderTable(students);

  if (changePasswordForm)
    changePasswordForm.addEventListener("submit", handleChangePassword);

  if (addStudentForm)
    addStudentForm.addEventListener("submit", handleAddStudent);

  if (studentTableBody)
    studentTableBody.addEventListener("click", handleTableClick);

  if (searchInput)
    searchInput.addEventListener("input", handleSearch);

  tableHeaders.forEach(th => {
    if (th) th.addEventListener("click", handleSort);
  });
}

// --- Initial Page Load ---
loadStudentsAndInitialize();
