/* Requirement: Populate the single topic page and manage replies. */

// --- Global Data Store ---
let currentTopicId = null;
let currentReplies = []; // replies for this topic only

// --- Element Selections ---
const topicSubject = document.getElementById('topic-subject');
const opMessage = document.getElementById('op-message');
const opFooter = document.getElementById('op-footer');
const replyListContainer = document.getElementById('reply-list-container');
const replyForm = document.getElementById('reply-form');
const newReplyText = document.getElementById('new-reply-text');

// --- Functions ---

// 1. Get topic id from URL
function getTopicIdFromURL() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('id');
}

// 2. Render original topic post
function renderOriginalPost(topic) {
  topicSubject.textContent = topic.subject;
  opMessage.textContent = topic.message;
  opFooter.textContent = `Posted by: ${topic.author} on ${topic.date}`;
}

// 3. Create <article> element for reply
function createReplyArticle(reply) {
  const article = document.createElement('article');

  const messagePara = document.createElement('p');
  messagePara.textContent = reply.text;
  article.appendChild(messagePara);

  const footer = document.createElement('footer');
  footer.textContent = `Posted by: ${reply.author} on ${reply.date}`;
  article.appendChild(footer);

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add('delete-reply-btn');
  deleteBtn.setAttribute('data-id', reply.id);
  article.appendChild(deleteBtn);

  return article;
}

// 4. Render all replies
function renderReplies() {
  replyListContainer.innerHTML = '';

  currentReplies.forEach(reply => {
    const replyArticle = createReplyArticle(reply);
    replyListContainer.appendChild(replyArticle);
  });
}

// 5. Handle adding a new reply
function handleAddReply(event) {
  event.preventDefault();

  const replyText = newReplyText.value.trim();
  if (!replyText) return;

  const newReply = {
    id: `reply_${Date.now()}`,
    author: 'Student',
    date: new Date().toISOString().split('T')[0],
    text: replyText
  };

  currentReplies.push(newReply);
  renderReplies();
  newReplyText.value = '';
}

// 6. Handle delete reply (event delegation)
function handleReplyListClick(event) {
  if (event.target.classList.contains('delete-reply-btn')) {
    const replyId = event.target.getAttribute('data-id');

    currentReplies = currentReplies.filter(r => r.id !== replyId);

    renderReplies();
  }
}

// 7. Initialize the page
async function initializePage() {
  currentTopicId = getTopicIdFromURL();

  if (!currentTopicId) {
    topicSubject.textContent = "Topic not found.";
    return;
  }

  try {
    const [topicsRes, repliesRes] = await Promise.all([
      fetch('topics.json'),
      fetch('replies.json')
    ]);

    const topics = await topicsRes.json();
    const repliesData = await repliesRes.json();

    const topic = topics.find(t => t.id === currentTopicId);
    currentReplies = repliesData[currentTopicId] || [];

    if (!topic) {
      topicSubject.textContent = "Topic not found.";
      return;
    }

    renderOriginalPost(topic);
    renderReplies();

    replyForm.addEventListener('submit', handleAddReply);
    replyListContainer.addEventListener('click', handleReplyListClick);

  } catch (err) {
    topicSubject.textContent = "Error loading topic.";
    console.error(err);
  }
}

// --- Initial Page Load ---
initializePage();


