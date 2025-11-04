/*
  Requirement: Make the "Manage Weekly Breakdown" page interactive.

  Instructions:
  1. Link this file to `admin.html` using:
     <script src="admin.js" defer></script>
  
  2. In `admin.html`, add an `id="weeks-tbody"` to the <tbody> element
     inside your `weeks-table`.
  
  3. Implement the TODOs below.
*/


// --- Global Data Store ---
// This will hold the weekly data loaded from the JSON file.
let weeks = [];

// --- Element Selections ---
// TODO: Select the week form ('#week-form').
const weekForm = document.querySelector('#week-form');


// TODO: Select the weeks table body ('#weeks-tbody').
const weeksTableBody = document.querySelector('#weeks-tbody');

// --- Functions ---

/**
 * TODO: Implement the createWeekRow function.
 * It takes one week object {id, title, description}.
 * It should return a <tr> element with the following <td>s:
 * 1. A <td> for the `title`.
 * 2. A <td> for the `description`.
 * 3. A <td> containing two buttons:
 * - An "Edit" button with class "edit-btn" and `data-id="${id}"`.
 * - A "Delete" button with class "delete-btn" and `data-id="${id}"`.
 */


function createWeekRow(week) {
  const tr = document.createElement('tr');

  const titleCell = document.createElement('td');
  titleCell.textContent = week.title || '';
  tr.appendChild(titleCell);

  const descriptionCell = document.createElement('td');
  descriptionCell.textContent = week.description || '';
  tr.appendChild(descriptionCell);

  const actionsCell = document.createElement('td');

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.textContent = 'Edit';
  editButton.classList.add('edit-btn');
  editButton.dataset.id = week.id;
  actionsCell.appendChild(editButton);

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-btn');
  deleteButton.dataset.id = week.id;
  actionsCell.appendChild(deleteButton);

  tr.appendChild(actionsCell);
  return tr;
}

/**
 * TODO: Implement the renderTable function.
 * It should:
 * 1. Clear the `weeksTableBody`.
 * 2. Loop through the global `weeks` array.
 * 3. For each week, call `createWeekRow()`, and
 * append the resulting <tr> to `weeksTableBody`.
 */

function renderTable() {
  weeksTableBody.innerHTML = '';
  weeks.forEach(week => {
    const row = createWeekRow(week);
    weeksTableBody.appendChild(row);
  });
}

/**
 * TODO: Implement the handleAddWeek function.
 * This is the event handler for the form's 'submit' event.
 * It should:
 * 1. Prevent the form's default submission.
 * 2. Get the values from the title, start date, and description inputs.
 * 3. Get the value from the 'week-links' textarea. Split this value
 * by newlines (`\n`) to create an array of link strings.
 * 4. Create a new week object with a unique ID (e.g., `id: \`week_${Date.now()}\``).
 * 5. Add this new week object to the global `weeks` array (in-memory only).
 * 6. Call `renderTable()` to refresh the list.
 * 7. Reset the form.
 */

function handleAddWeek(event) {
  event.preventDefault();

  const title = weekForm.querySelector('#week-title').value.trim();
  const startDate = weekForm.querySelector('#week-start-date').value;
  const description = weekForm.querySelector('#week-description').value.trim();
  const linksText = weekForm.querySelector('#week-links').value;
  const links = linksText.split('\n').map(l => l.trim()).filter(l => l !== '');

  const editingId = weekForm.dataset.editingId;
  if (editingId) {
    const idx = weeks.findIndex(w => w.id === editingId);
    if (idx !== -1) {
      weeks[idx] = { ...weeks[idx], title, startDate, description, links };
    }
    delete weekForm.dataset.editingId;
    document.querySelector('#add-week').textContent = 'Add Week';
  } else {
    const newWeek = {
      id: `week_${Date.now()}`,
      title,
      startDate,
      description,
      links
    };
    weeks.push(newWeek);
  }

  renderTable();
  weekForm.reset();
}

/**
 * TODO: Implement the handleTableClick function.
 * This is an event listener on the `weeksTableBody` (for delegation).
 * It should:
 * 1. Check if the clicked element (`event.target`) has the class "delete-btn".
 * 2. If it does, get the `data-id` attribute from the button.
 * 3. Update the global `weeks` array by filtering out the week
 * with the matching ID (in-memory only).
 * 4. Call `renderTable()` to refresh the list.
 */
function handleTableClick(event) {
  const target = event.target;
  if (target.classList.contains('delete-btn')) {
    const weekId = target.dataset.id;
    weeks = weeks.filter(week => week.id !== weekId);
    renderTable();
    return;
  }

  if (target.classList.contains('edit-btn')) {
    const weekId = target.dataset.id;
    const week = weeks.find(w => w.id === weekId);
    if (!week) return;

    weekForm.querySelector('#week-title').value = week.title || '';
    weekForm.querySelector('#week-start-date').value = week.startDate || '';
    weekForm.querySelector('#week-description').value = week.description || '';
    weekForm.querySelector('#week-links').value = (week.links || []).join('\n');

    weekForm.dataset.editingId = weekId;
    document.querySelector('#add-week').textContent = 'Update Week';
    weekForm.querySelector('#week-title').focus();
  }
}

/**
 * TODO: Implement the loadAndInitialize function.
 * This function needs to be 'async'.
 * It should:
 * 1. Use `fetch()` to get data from 'weeks.json'.
 * 2. Parse the JSON response and store the result in the global `weeks` array.
 * 3. Call `renderTable()` to populate the table for the first time.
 * 4. Add the 'submit' event listener to `weekForm` (calls `handleAddWeek`).
 * 5. Add the 'click' event listener to `weeksTableBody` (calls `handleTableClick`).
 */
async function loadAndInitialize() {
  try {
    const response = await fetch('api/weeks.json');
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    weeks = await response.json();
  } catch (err) {
    console.error('Could not load weeks.json — starting with empty list.', err);
    weeks = [];
  }

  renderTable();
  weekForm.addEventListener('submit', handleAddWeek);
  weeksTableBody.addEventListener('click', handleTableClick);
}


// --- Initial Page Load ---
// Call the main async function to start the application.
loadAndInitialize();
