/*
  Requirement: Make the "Manage Resources" page interactive.

  Instructions:
  1. Link this file to `admin.html` using:
     <script src="admin.js" defer></script>
  
  2. In `admin.html`, add an `id="resources-tbody"` to the <tbody> element
     inside your `resources-table`.
  
  3. Implement the TODOs below.
*/

// --- Global Data Store ---
// This will hold the resources loaded from the JSON file.
let resources = [];

// --- Element Selections ---
// Select elements
const resourceForm = document.querySelector('#resource-form');
const resourcesTableBody = document.querySelector('#resources-tbody');
const titleInput = document.querySelector('#resource-title');
const descInput = document.querySelector('#resource-description');
const linkInput = document.querySelector('#resource-link');

// Track edit state
let editingId = null;

// --- Functions ---

/**
 * TODO: Implement the createResourceRow function.
 * It takes one resource object {id, title, description}.
 * It should return a <tr> element with the following <td>s:
 * 1. A <td> for the `title`.
 * 2. A <td> for the `description`.
 * 3. A <td> containing two buttons:
 * - An "Edit" button with class "edit-btn" and `data-id="${id}"`.
 * - A "Delete" button with class "delete-btn" and `data-id="${id}"`.
 */
function createResourceRow(resource) {
  const tr = document.createElement('tr');

  const tdTitle = document.createElement('td');
  tdTitle.textContent = resource.title;

  const tdDesc = document.createElement('td');
  tdDesc.textContent = resource.description;

  const tdActions = document.createElement('td');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.className = 'edit-btn';
  editBtn.dataset.id = resource.id;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.dataset.id = resource.id;

  tdActions.appendChild(editBtn);
  tdActions.appendChild(document.createTextNode(' '));
  tdActions.appendChild(deleteBtn);

  tr.appendChild(tdTitle);
  tr.appendChild(tdDesc);
  tr.appendChild(tdActions);

  return tr;
}

/**
 * TODO: Implement the renderTable function.
 * It should:
 * 1. Clear the `resourcesTableBody`.
 * 2. Loop through the global `resources` array.
 * 3. For each resource, call `createResourceRow()`, and
 * append the resulting <tr> to `resourcesTableBody`.
 */
function renderTable() {
  resourcesTableBody.innerHTML = '';
  resources.forEach(resource => {
    const row = createResourceRow(resource);
    resourcesTableBody.appendChild(row);
  });
}

/**
 * TODO: Implement the handleAddResource function.
 * This is the event handler for the form's 'submit' event.
 * It should:
 * 1. Prevent the form's default submission.
 * 2. Get the values from the title, description, and link inputs.
 * 3. Create a new resource object with a unique ID (e.g., `id: \`res_${Date.now()}\``).
 * 4. Add this new resource object to the global `resources` array (in-memory only).
 * 5. Call `renderTable()` to refresh the list.
 * 6. Reset the form.
 */
async function handleAddResource(event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  const description = descInput.value.trim();
  const link = linkInput.value.trim();
  if (!title || !link) return;
  try {
    if (editingId) {
      // update via API
      const resp = await fetch(`/api/resources/${encodeURIComponent(editingId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, link })
      });
      if (!resp.ok) throw new Error('Failed to update resource');
      const updated = await resp.json();
      const idx = resources.findIndex(r => r.id === editingId);
      if (idx !== -1) resources[idx] = updated;
      editingId = null;
      document.querySelector('#add-resource').textContent = 'Add Resource';
    } else {
      const resp = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, link })
      });
      if (!resp.ok) throw new Error('Failed to add resource');
      const created = await resp.json();
      resources.push(created);
    }
    renderTable();
    resourceForm.reset();
  } catch (err) {
    console.error(err);
    alert('Error saving resource: ' + err.message);
  }
}

/**
 * TODO: Implement the handleTableClick function.
 * This is an event listener on the `resourcesTableBody` (for delegation).
 * It should:
 * 1. Check if the clicked element (`event.target`) has the class "delete-btn".
 * 2. If it does, get the `data-id` attribute from the button.
 * 3. Update the global `resources` array by filtering out the resource
 * with the matching ID (in-memory only).
 * 4. Call `renderTable()` to refresh the list.
 */
async function handleTableClick(event) {
  const target = event.target;
  if (target.classList.contains('delete-btn')) {
    const id = target.dataset.id;
    if (!window.confirm('Delete this resource?')) return;
    try {
      const resp = await fetch(`/api/resources/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!resp.ok) throw new Error('Delete failed');
      resources = resources.filter(r => r.id !== id);
      renderTable();
    } catch (err) {
      console.error(err);
      alert('Error deleting resource: ' + err.message);
    }
  }

  if (target.classList.contains('edit-btn')) {
    const id = target.dataset.id;
    const resource = resources.find(r => r.id === id);
    if (!resource) return;
    // Populate the form for editing
    titleInput.value = resource.title;
    descInput.value = resource.description;
    linkInput.value = resource.link;
    editingId = id;
    document.querySelector('#add-resource').textContent = 'Update Resource';
  }
}

/**
 * TODO: Implement the loadAndInitialize function.
 * This function needs to be 'async'.
 * It should:
 * 1. Use `fetch()` to get data from 'resources.json'.
 * 2. Parse the JSON response and store the result in the global `resources` array.
 * 3. Call `renderTable()` to populate the table for the first time.
 * 4. Add the 'submit' event listener to `resourceForm` (calls `handleAddResource`).
 * 5. Add the 'click' event listener to `resourcesTableBody` (calls `handleTableClick`).
 */
async function loadAndInitialize() {
  try {
    const res = await fetch('/api/resources');
    if (!res.ok) throw new Error('Failed to load resources');
    const data = await res.json();
    resources = Array.isArray(data) ? data.slice() : [];
    renderTable();

    // Event bindings
    resourceForm.addEventListener('submit', handleAddResource);
    resourcesTableBody.addEventListener('click', handleTableClick);
  } catch (err) {
    console.error('Error initializing admin page', err);
  }
}

// --- Initial Page Load ---
// Call the main async function to start the application.
loadAndInitialize();
