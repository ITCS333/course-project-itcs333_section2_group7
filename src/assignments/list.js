/*
  Requirement: Populate the "Course Assignments" list page.

  Instructions:
  1. Link this file to `list.html` using:
     <script src="list.js" defer></script>

  2. In `list.html`, add an `id="assignment-list-section"` to the
     <section> element that will contain the assignment articles.

  3. Implement the TODOs below.
*/

// --- Element Selections ---
// TODO: Select the section for the assignment list ('#assignment-list-section').
const listSection = document.getElementById('assignment-list-section');

// --- Functions ---
function createAssignmentArticle(assignment) {
  const article = document.createElement('article');

  const h2 = document.createElement('h2');
  h2.textContent = assignment.title;
  article.appendChild(h2);

  const p = document.createElement('p');
  p.textContent = `Due: ${assignment.dueDate}`;
  article.appendChild(p);

  const a = document.createElement('a');
  a.href = `details.html?id=${assignment.id}`;
  a.textContent = 'View Details';
  article.appendChild(a);

  return article;
}

async function loadAssignments() {
  const response = await fetch('assignments.json');
  const assignments = await response.json();

  listSection.innerHTML = '';

  assignments.forEach((assignment) => {
    const article = createAssignmentArticle(assignment);
    listSection.appendChild(article);
  });
}

// --- Initial Page Load ---
loadAssignments();



