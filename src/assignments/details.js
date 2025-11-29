/*
  Requirement: Populate the assignment detail page and discussion forum.

  Instructions:
  1. Link this file to `details.html` using:
     <script src="details.js" defer></script>

  2. In `details.html`, add the following IDs:
     - To the <h1>: `id="assignment-title"`
     - To the "Due" <p>: `id="assignment-due-date"`
     - To the "Description" <p>: `id="assignment-description"`
     - To the "Attached Files" <ul>: `id="assignment-files-list"`
     - To the <div> for comments: `id="comment-list"`
     - To the "Add a Comment" <form>: `id="comment-form"`
     - To the <textarea>: `id="new-comment-text"`

  3. Implement the TODOs below.
*/

// --- Global Data Store ---
// These will hold the data related to *this* assignment.
let currentAssignmentId = null;
let currentComments = [];

// --- Element Selections ---
// TODO: Select all the elements you added IDs for in step 2.
<<<<<<< HEAD
const assignmentTitle = document.getElementById('assignment-title');
const assignmentDueDate = document.getElementById('assignment-due-date');
const assignmentDescription = document.getElementById('assignment-description');
const assignmentFilesList = document.getElementById('assignment-files-list');
const commentList = document.getElementById('comment-list');
const commentForm = document.getElementById('comment-form');
const newCommentText = document.getElementById('new-comment-text');
=======
const assignmentTitle = document.getElementById("assignment-title");
const assignmentDueDate = document.getElementById("assignment-due-date");
const assignmentDescription = document.getElementById("assignment-description");
const assignmentFilesList = document.getElementById("assignment-files-list");
const commentList = document.getElementById("comment-list");
const commentForm = document.getElementById("comment-form");
const newCommentText = document.getElementById("new-comment-text");
console.log('Title element:', assignmentTitle);
>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b

// --- Functions ---


/**
 * TODO: Implement the getAssignmentIdFromURL function.
 * It should:
 * 1. Get the query string from `window.location.search`.
 * 2. Use the `URLSearchParams` object to get the value of the 'id' parameter.
 * 3. Return the id.
 */
<<<<<<< HEAD
function getAssignmentIdFromURL() {
  // ... your implementation here ...
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');
=======
function displayError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.color = 'red';
  errorDiv.style.padding = '10px';
  errorDiv.style.border = '1px solid red';
  errorDiv.style.margin = '10px 0';
  errorDiv.textContent = message;
   const main=document.querySelector('main');
   if (main) {
    main.insertBefore(errorDiv, main.firstChild);
   }else{
    document.body.insertBefore(errorDiv, document.body.firstChild);
   }
>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b
}
function getAssignmentIdFromURL() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');

}



/**
 * TODO: Implement the renderAssignmentDetails function.
 * It takes one assignment object.
 * It should:
 * 1. Set the `textContent` of `assignmentTitle` to the assignment's title.
 * 2. Set the `textContent` of `assignmentDueDate` to "Due: " + assignment's dueDate.
 * 3. Set the `textContent` of `assignmentDescription`.
 * 4. Clear `assignmentFilesList` and then create and append
 * `<li><a href="#">...</a></li>` for each file in the assignment's 'files' array.
 */
function renderAssignmentDetails(assignment) {
<<<<<<< HEAD
  // ... your implementation here ...
  assignmentTitle.textContent = assignment.title || 'Untitled Assignment';
  assignmentDueDate.textContent = `Due: ${assignment.dueDate || 'TBA'}`;
  assignmentDescription.textContent = assignment.description || '';
=======
  if (!assignmentTitle || !assignmentDueDate || !assignmentDescription || !assignmentFilesList) {
    console.error("One or more assignment detail elements are missing.");
    return;
  }
  assignmentTitle.textContent = assignment.title || "Untitled Assignment";
  assignmentDueDate.textContent = "Due: " + (assignment.dueDate || "No Due Date");
  assignmentDescription.textContent = assignment.description || "No Description Available";

  // Clear existing files
  assignmentFilesList.innerHTML = "";
  if (assignment.files && assignment.files.length > 0) {
    assignment.files.forEach(file => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    
    if(typeof file === "string"){
      a.href = file;
      a.textContent = file;

    }else if (file && file.name && file.url){
      a.href=file.url ;
      a.textContent=file.name ;
    }else{
      a.href="#";
      a.textContent="Unnamed File";
    }
    li.appendChild(a);
    assignmentFilesList.appendChild(li);
  });
  } else {
  const li = document.createElement("li");
  li.textContent = "No attached files.";
  assignmentFilesList.appendChild(li);
}
>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b
}

/**
 * TODO: Implement the createCommentArticle function.
 * It takes one comment object {author, text}.
 * It should return an <article> element matching the structure in `details.html`.
 */
function createCommentArticle(comment) {
<<<<<<< HEAD
  // ... your implementation here ...
  const article = document.createElement('article');

  const messagePara = document.createElement('p');
  messagePara.textContent = comment.text;
  article.appendChild(messagePara);
=======
   // ... your implementation here ...
  const article = document.createElement("article");
  const p = document.createElement("p");
  p.textContent = comment.text;
  const footer = document.createElement("footer");
  footer.textContent = "Posted by: " + (comment.author || "Anonymous");
  article.appendChild(p);
  article.appendChild(footer);
  return article;
>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b
}

  



/**
 * TODO: Implement the renderComments function.
 * It should:
 * 1. Clear the `commentList`.
 * 2. Loop through the global `currentComments` array.
 * 3. For each comment, call `createCommentArticle()`, and
 * append the resulting <article> to `commentList`.
 */
function renderComments() {
<<<<<<< HEAD
  // ... your implementation here ...
  commentList.innerHTML = '';

=======
  if(!commentList) {
    console.error("Comment list element is missing.");
    return;
  }
  commentList.innerHTML = "";
  if(currentComments.length === 0){
    const noCommentsMsg = document.createElement("p");
    noCommentsMsg.textContent = "No comments yet. Be the first to comment!";
    noCommentsMsg.style.fontStyle = "italic";
    noCommentsMsg.style.color = "#666";
    commentList.appendChild(noCommentsMsg);
    return;
  }
>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b
  currentComments.forEach(comment => {
    const commentArticle = createCommentArticle(comment);
    commentList.appendChild(commentArticle);
  });
}
  

/**
 * TODO: Implement the handleAddComment function.
 * This is the event handler for the `commentForm` 'submit' event.
 * It should:
 * 1. Prevent the form's default submission.
 * 2. Get the text from `newCommentText.value`.
 * 3. If the text is empty, return.
 * 4. Create a new comment object: { author: 'Student', text: commentText }
 * (For this exercise, 'Student' is a fine hardcoded author).
 * 5. Add the new comment to the global `currentComments` array (in-memory only).
 * 6. Call `renderComments()` to refresh the list.
 * 7. Clear the `newCommentText` textarea.
 */
function handleAddComment(event) {
  // ... your implementation here ...
  event.preventDefault();
<<<<<<< HEAD
  const commentText = newCommentText.value.trim();
=======

if(!newCommentText) {
    console.error("New comment text element is missing.");
    return;
  }
  const commentText = newCommentText.value.trim();
  if (commentText === "") {
    alert("Comment cannot be empty.");
    return;
  }
  const newComment = { author: 'Student', text: commentText };
  currentComments.push(newComment);
  renderComments();
  newCommentText.value = "";  

>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b
}

/**
 * TODO: Implement an `initializePage` function.
 * This function needs to be 'async'.
 * It should:
 * 1. Get the `currentAssignmentId` by calling `getAssignmentIdFromURL()`.
 * 2. If no ID is found, display an error and stop.
 * 3. `fetch` both 'assignments.json' and 'comments.json' (you can use `Promise.all`).
 * 4. Find the correct assignment from the assignments array using the `currentAssignmentId`.
 * 5. Get the correct comments array from the comments object using the `currentAssignmentId`.
 * Store this in the global `currentComments` variable.
 * 6. If the assignment is found:
 * - Call `renderAssignmentDetails()` with the assignment object.
 * - Call `renderComments()` to show the initial comments.
 * - Add the 'submit' event listener to `commentForm` (calls `handleAddComment`).
 * 7. If the assignment is not found, display an error.
 */
async function initializePage() {
  // ... your implementation here ...
  currentAssignmentId = getAssignmentIdFromURL();
  if (!currentAssignmentId) {
<<<<<<< HEAD
<<<<<<< HEAD
    assignmentTitle.textContent = 'Error: No assignment ID provided in URL.';
    return;
  }
=======
    displayError("No assignment ID found in URL.");
    return;
=======
    // No ID in URL — fall back to the first assignment from the fixtures.
    console.warn('No assignment ID found in URL; will use the first assignment as fallback.');
>>>>>>> a7b675dab8bf5afde445b601b1f0356c46d92d1e
  }

  try {
    // `details.js` lives in `src/assignments/` — API fixtures are under `src/assignments/api/`
    const [assignmentsResponse, commentsResponse] = await Promise.all([
      fetch('./api/assignments.json'),
      fetch('./api/comments.json')
    ]);

    if (!assignmentsResponse.ok) {
      throw new Error("Failed to fetch assignments.json");
    }
    if (!commentsResponse.ok) {
      throw new Error("Failed to fetch comments.json");
    }

    const assignmentsData = await assignmentsResponse.json();
    const commentsData = await commentsResponse.json();

    // Determine which assignment to render. If no ID in URL, use the first assignment as fallback.
    let assignment = null;
    if (!currentAssignmentId) {
      if (Array.isArray(assignmentsData) && assignmentsData.length > 0) {
        assignment = assignmentsData[0];
        currentAssignmentId = assignment.id;
      }
    } else {
      assignment = Array.isArray(assignmentsData) ? assignmentsData.find(asg => asg.id === currentAssignmentId) : null;
    }

    // Load comments for the selected assignment (comments.json is expected to be an object keyed by assignment id)
    if (commentsData && typeof commentsData === 'object' && commentsData[currentAssignmentId]) {
      currentComments = Array.isArray(commentsData[currentAssignmentId]) ? commentsData[currentAssignmentId] : [];
    } else {
      currentComments = [];
    }

    if (assignment) {
      renderAssignmentDetails(assignment);
      renderComments();
      if (commentForm) {
        commentForm.addEventListener('submit', handleAddComment);
      }
    } else {
      console.error('Assignment not found for ID:', currentAssignmentId);
      displayError('Assignment not found.');
    }
  
} catch (error) {
    console.error("Error initializing page:", error);
    displayError("An error occurred while loading the assignment details. Please try again later.");
  }
>>>>>>> 6380ed047c20970b6134c13eff87a1495a7c9b3b
}

// --- Initial Page Load ---
initializePage();
