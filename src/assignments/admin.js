/*
  Requirement: Make the "Manage Assignments" page interactive.

  Instructions:
  1. Link this file to `admin.html` using:
     <script src="admin.js" defer></script>
  
  2. In `admin.html`, add an `id="assignments-tbody"` to the <tbody> element
     so you can select it.
  
  3. Implement the TODOs below.
*/

// --- Global Data Store ---
// This will hold the assignments loaded from the JSON file.
let assignments = [];

// --- Element Selections ---
// TODO: Select the assignment form ('#assignment-form').
const assignmentForm = document.querySelector('#assignment-form');

// TODO: Select the assignments table body ('#assignments-tbody').
const assignmentsTableBody = document.querySelector('#assignments-tbody');
console.log('From element:',assignmentForm);
console.log('Table body:',assignmentsTableBody);
// --- Functions ---

/**
 * TODO: Implement the createAssignmentRow function.
 * It takes one assignment object {id, title, dueDate}.
 * It should return a <tr> element with the following <td>s:
 * 1. A <td> for the `title`.
 * 2. A <td> for the `dueDate`.
 * 3. A <td> containing two buttons:
 * - An "Edit" button with class "edit-btn" and `data-id="${id}"`.
 * - A "Delete" button with class "delete-btn" and `data-id="${id}"`.
 */
function createAssignmentRow(assignment) {
  const row = document.createElement('tr');

  // Create and append title cell
  const titleCell = document.createElement('td');
  titleCell.textContent = assignment.title;
  row.appendChild(titleCell);

  // Create and append due date cell
  const dueDateCell = document.createElement('td');
  dueDateCell.textContent = assignment.dueDate;
  row.appendChild(dueDateCell);

  // Create and append actions cell
  const actionsCell = document.createElement('td');
  const editButton = document.createElement('button');
  editButton.classList.add('edit-btn');
  editButton.setAttribute('data-id', assignment.id);
  editButton.textContent = 'Edit';
  actionsCell.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');
  deleteButton.setAttribute('data-id', assignment.id);
  deleteButton.textContent = 'Delete';
  actionsCell.appendChild(deleteButton);

  row.appendChild(actionsCell);
  return row;
}

/**
 * TODO: Implement the renderTable function.
 * It should:
 * 1. Clear the `assignmentsTableBody`.
 * 2. Loop through the global `assignments` array.
 * 3. For each assignment, call `createAssignmentRow()`, and
 * append the resulting <tr> to `assignmentsTableBody`.
 */
function renderTable() {
  // ... your implementation here ...
  // Clear the table body
  if(!assignmentsTableBody)
console.error('assignmentsTableBody is null');
  return;
  assignmentsTableBody.innerHTML = '';

  // Loop through assignments and append rows
  assignments.forEach(assignment => {
    const row = createAssignmentRow(assignment);
    assignmentsTableBody.appendChild(row);
  });

/**
 * TODO: Implement the handleAddAssignment function.
 * This is the event handler for the form's 'submit' event.
 * It should:
 * 1. Prevent the form's default submission.
 * 2. Get the values from the title, description, due date, and files inputs.
 * 3. Create a new assignment object with a unique ID (e.g., `id: \`asg_${Date.now()}\``).
 * 4. Add this new assignment object to the global `assignments` array (in-memory only).
 * 5. Call `renderTable()` to refresh the list.
 * 6. Reset the form.
 */
function handleAddAssignment(event) {
  // ... your implementation here ...
  event.preventDefault();
console.log('Form submitted');
  // Get form values
  const title = document.getElementById['title'].value;
  const description = document.getElementById['description'].value;
  const dueDate = document.getElementById['due-date'].value;
  const files = document.getElementById['files'].files;

  console.log('From values:', title, description, dueDate, files);

  if (!title || !dueDate) {
    alert('Title and Due Date are required.');
    return;
  }
  // Create new assignment object
  const newAssignment = {
    id: `asg_${Date.now()}`,
    title: title,
    description: description,
    dueDate: dueDate,
    files: files
  };

  // Add to assignments array
  assignments.push(newAssignment);
  console.log('New assignment added:', newAssignment);

  // Refresh the table
  renderTable();

  // Reset the form
  assignmentForm.reset();
}

/**
 * TODO: Implement the handleTableClick function.
 * This is an event listener on the `assignmentsTableBody` (for delegation).
 * It should:
 * 1. Check if the clicked element (`event.target`) has the class "delete-btn".
 * 2. If it does, get the `data-id` attribute from the button.
 * 3. Update the global `assignments` array by filtering out the assignment
 * with the matching ID (in-memory only).
 * 4. Call `renderTable()` to refresh the list.
 */
function handleTableClick(event) {
  console.log('Table clicked:', event.target);
  // ... your implementation here ...
  if (event.target.classList.contains('delete-btn')) {
    const idToDelete = event.target.getAttribute('data-id');
    console.log('Delete button clicked for ID:', idToDelete);

    // Filter out the assignment with the matching ID
    assignments = assignments.filter(assignment => assignment.id !== idToDelete);
    console.log('Updated assignments list:', assignments);

    // Refresh the table
    renderTable();
  }
}

if (event.target.classList.contains('delete-btn')) {
  const idToDelete = event.target.getAttribute('data-id');
  console.log('Delete button clicked for ID:', idToDelete);
  alert('Delete functionality not implemented yet. ID: ' + idToDelete);
  /**
   * TODO: Implement the loadAndInitialize function.
   * This function needs to be 'async'.
   */
async function loadAndInitialize() {
try {
  console.log('Loading assignments...');
  // Fetch data from 'assignments.json'
  const response = await fetch('assignments.json');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('Assignments loaded:', data);

  // Store the result in the global `assignments` array
  assignments = data;

  // Call `renderTable()` to populate the table for the first time
  renderTable();

  if (assignmentForm) {
    assignmentForm.addEventListener('submit', handleAddAssignment);
    console.log('Event listener added to assignmentForm');  
  } else {
    console.error('assignmentForm is null');
  }

  if (assignmentsTableBody) {
    assignmentsTableBody.addEventListener('click', handleTableClick);
    console.log('Event listener added to assignmentsTableBody');  
  } else {
    console.error('assignmentsTableBody is null');
  }

  console.log('Event listeners set up.');

  // Add the 'submit' event listener to `assignmentForm`
  //11assignmentForm.addEventListener('submit', handleAddAssignment);
  // Add the 'click' event listener to `assignmentsTableBody` (calls `handleTableClick`).
  //11assignmentsTableBody.addEventListener('click', handleTableClick);

  
} catch (error) {

  console.error('Error loading assignments:', error);

  assignments= {
    id: 'asg_0',
    title: 'Sample Assignment',
    dueDate: '2025-10-31'
  };
  renderTable();

}

}

// --- Initialization ---
document.addEventListener('DOMContentLoaded',function(){
  console.log('DOM fully loaded and parsed');
loadAndInitialize();  
});
  }
};
