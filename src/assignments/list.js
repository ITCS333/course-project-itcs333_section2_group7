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
<<<<<<< HEAD
const listSection = document.querySelector('#assignment-list-section'); 
=======
<<<<<<< HEAD
const listSection = document.getElementById('assignment-list-section');
=======
const listSection = document.getElementById("assignment-list-section");
console.log('List section element:', listSection);

if (!listSection) {
  console.error("Assignment list section not found. Make sure to add id='assignment-list-section' to the <section> in list.html.");
}
>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b
>>>>>>> 6421488a73750564d397c23099ee153f66f46544

// --- Functions ---

/**
 * TODO: Implement the createAssignmentArticle function.
 * It takes one assignment object {id, title, dueDate, description}.
 * It should return an <article> element matching the structure in `list.html`.
 * The "View Details" link's `href` MUST be set to `details.html?id=${id}`.
 * This is how the detail page will know which assignment to load.
 */
function createAssignmentArticle(assignment) {
<<<<<<< HEAD
  const article = document.createElement('article');
  const h2 = document.createElement('h2');
  h2.textContent = assignment.title;
  article.appendChild(h2);
  const p = document.createElement('p');
  p.textContent = "Due: " + assignment.dueDate;
  article.appendChild(p);
  const a = document.createElement('a');
  a.href = `details.html?id=${assignment.id}`;
  a.textContent = "View Details";
  article.appendChild(a);
  return article; 
=======
<<<<<<< HEAD
    // Create the article element
    const article = document.createElement('article');

    // Create and append the title
    const heading = document.createElement('h2');
    heading.textContent = assignment.title || 'Untitled Assignment';
    article.appendChild(heading);

    // Create and append the due date
    const dueDatePara = document.createElement('p');
    dueDatePara.textContent = `Due Date: ${assignment.dueDate || 'TBA'}`;
    article.appendChild(dueDatePara);

    // Create and append the description
    const descPara = document.createElement('p');
    descPara.textContent = assignment.description || '';
    article.appendChild(descPara);

    // Create and append the "View Details" link
    const link = document.createElement('a');
    link.href = `details.html?id=${assignment.id}`;
    link.textContent = 'View Details';
    article.appendChild(link);

    return article;
=======
  // ... your implementation here ...
  const article = document.createElement('article');

  const h2 = document.createElement('h2');
  h2.textContent = assignment.title || "Untitled Assignment";
  article.appendChild(h2);

  const dueDateP = document.createElement('p');
  dueDateP.textContent = `Due: ${assignment.dueDate || "No Due Date"}`;
  article.appendChild(dueDateP);

  const descriptionP = document.createElement('p');
  descriptionP.textContent = assignment.description || "No Description Available";
  article.appendChild(descriptionP);

  const detailsLink = document.createElement('a');
  detailsLink.href = `details.html?id=${assignment.id || ""}`;
  detailsLink.textContent = 'View Details';
  article.appendChild(detailsLink);

  return article;
>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b
>>>>>>> 6421488a73750564d397c23099ee153f66f46544
}

/**
 * TODO: Implement the loadAssignments function.
 * This function needs to be 'async'.
 * It should:
 * 1. Use `fetch()` to get data from 'assignments.json'.
 * 2. Parse the JSON response into an array.
 * 3. Clear any existing content from `listSection`.
 * 4. Loop through the assignments array. For each assignment:
 * - Call `createAssignmentArticle()`.
 * - Append the returned <article> element to `listSection`.
 */
async function loadAssignments() {
<<<<<<< HEAD
    try {
        const response = await fetch('assignments.json');
        const assignments = await response.json();

        // Clear any existing content
        listSection.innerHTML = '';

        // Loop through assignments and append each article
        assignments.forEach(assignment => {
            const article = createAssignmentArticle(assignment);
            listSection.appendChild(article);
        });
    } catch (error) {
        console.error('Error loading assignments:', error);
        listSection.textContent = 'Failed to load assignments.';
    }
=======
  // ... your implementation here ...
<<<<<<< HEAD
  const response = await fetch('assignments.json');
  const assignments = await response.json();
  listSection.innerHTML = '';
  assignments.forEach(assignment => {
    const article = createAssignmentArticle(assignment);
    listSection.appendChild(article);
  }); 
=======
  try {
    if (!listSection) {
      listSection.innerHTML = "<p>Error: Assignment list section not found.</p>";
    
    }
  const response = await fetch('assignments.json');
  if (!response.ok) {
    throw new Error("Failed to fetch assignments.json: " + response.statusText + " (Status: " + response.status + ")");
  }
  const assignments = await response.json();

  // Clear existing content
  if (listSection) {
    listSection.innerHTML = '';
  }
if(!assignments || assignments.length === 0){
  if (listSection) {
    listSection.innerHTML = "<p>No assignments available.</p>";
  }
  return;
}
  // Loop through assignments and append articles
  assignments.forEach(assignment => {
    const article = createAssignmentArticle(assignment);
    listSection.appendChild(article);
  });   
}catch (error) {
    console.error("Error loading assignments:", error);
    if (listSection) {
      listSection.innerHTML = "<p>Error loading assignments. Please try again later.</p>";
    }
  }
>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b
>>>>>>> 6421488a73750564d397c23099ee153f66f46544
}

// --- Initial Page Load ---
// Call the function to populate the page.
<<<<<<< HEAD
loadAssignments();  
=======
loadAssignments(); 
>>>>>>> 6421488a73750564d397c23099ee153f66f46544
