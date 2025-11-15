# Task 2: Course Resources — Complete Implementation

**Assigned to:** Abdulrhman Mohamed (202104739)  
**Status:** ✅ Complete

---

## Overview

Task 2 implements a complete Course Resources feature that allows:
- **Teachers (Admin)**: Full CRUD operations (Create, Read, Update, Delete) to manage course materials.
- **Students**: Read-only access to view resources and participate in discussion forums.
- **Everyone**: Discussion capability with comments on each resource.

---

## Features Implemented

### 1. Student View (Read-Only List)
**File:** `src/resources/list.html` + `src/resources/list.js`

- Displays all available course resources in a clean, readable list.
- Each resource shows:
  - Title
  - Description
  - "View Resource & Discussion" link to the detail page
- Fetches resources from the API endpoint `/api/resources`.
- Responsive layout with CSS styling from `src/common/styles.css`.

**To access:** http://localhost:8000/src/resources/list.html

---

### 2. Admin (Full CRUD Management)
**File:** `src/resources/admin.html` + `src/resources/admin.js`

**Features:**
- ✅ **Add Resource**: Form with fields for Title (required), Description, and Resource Link (required).
- ✅ **Edit Resource**: Click "Edit" to populate the form; submit updates the resource.
- ✅ **Delete Resource**: Click "Delete" with confirmation; removes from the list.
- ✅ **Persistent Storage**: All changes save to `src/resources/api/resources.json` via the Express server.
- ✅ **Table View**: Shows all resources in a structured table with action buttons.

**Workflow:**
1. Load admin page → fetches existing resources from `/api/resources`.
2. Fill form and click "Add Resource" → POSTs to `/api/resources`.
3. Click "Edit" on any row → populates the form (button changes to "Update Resource").
4. Update values and submit → PUTs to `/api/resources/:id`.
5. Click "Delete" → confirmation dialog → DELETEs from `/api/resources/:id`.

**To access:** http://localhost:8000/src/resources/admin.html

---

### 3. Resource Detail Page + Discussion Forum
**File:** `src/resources/details.html` + `src/resources/details.js`

**Features:**
- ✅ **Resource Display**: Shows the full title, description, and a link to the actual resource material.
- ✅ **Comments Section**: Displays all existing comments with author name and text.
- ✅ **Add Comment**: Logged-in users (students/teachers) can post comments.
- ✅ **Persistent Comments**: New comments are saved to `src/resources/api/comments.json` via POST to `/api/comments/:resourceId`.
- ✅ **Dynamic URL Parsing**: Uses query parameter `?id=res_1` to load the correct resource.

**Workflow:**
1. Click "View Resource & Discussion" from the list → navigates to `details.html?id=<resourceId>`.
2. Page fetches the resource details and all comments for that resource.
3. User can read comments and fill the "Leave a Comment" form.
4. Submit → POSTs to `/api/comments/:resourceId` → comment persists.

**To access:** http://localhost:8000/src/resources/details.html?id=res_1

---

## Backend Server

**File:** `server.js`

The Express server provides REST API endpoints:

```
GET    /api/resources              → Returns array of all resources
POST   /api/resources              → Create new resource (body: {title, description, link})
GET    /api/comments               → Returns object with comments by resourceId
POST   /api/comments/:resourceId   → Add comment to resource (body: {author, text})
PUT    /api/resources/:id          → Update resource (body: {title, description, link})
DELETE /api/resources/:id          → Delete resource by id
```

**File Operations:**
- Reads/writes `src/resources/api/resources.json` (array of resources).
- Reads/writes `src/resources/api/comments.json` (object: resourceId → array of comments).

---

## File Structure

```
course-project-itcs333_section2_group7/
├── package.json                   (npm dependencies: express)
├── server.js                      (Express server)
├── start-server.ps1               (PowerShell helper to run server)
├── RUN_TASK2.md                   (Quick start instructions)
├── TASK2_COMPLETE.md              (This file)
├── src/
│   └── resources/
│       ├── list.html              (Student list view)
│       ├── list.js                (Fetch and render resources)
│       ├── admin.html             (Admin CRUD interface)
│       ├── admin.js               (Handle add/edit/delete)
│       ├── details.html           (Single resource + discussion)
│       ├── details.js             (Render details and comments)
│       └── api/
│           ├── resources.json     (Initial resources data)
│           └── comments.json      (Initial comments data)
```

---

## How to Run

### Prerequisites
- **Node.js** (LTS recommended) with npm. Download from https://nodejs.org/

### Quick Start (PowerShell)

1. **Open PowerShell** and navigate to the project root:
```powershell
cd C:\Users\AM\Desktop\333Project\course-project-itcs333_section2_group7
```

2. **Run the helper script** (checks for Node/npm, installs dependencies, starts server):
```powershell
.\start-server.ps1
```

3. **Open your browser** and visit:
   - **Student List:** http://localhost:8000/src/resources/list.html
   - **Resource Detail (example):** http://localhost:8000/src/resources/details.html?id=res_1
   - **Admin (Manage):** http://localhost:8000/src/resources/admin.html

The server will output:
```
Server running at http://localhost:8000
```

### Manual Run (if helper script doesn't work)

```powershell
npm install
npm start
```

---

## Example Usage

### As a Student
1. Visit http://localhost:8000/src/resources/list.html
2. See "Chapter 1 Notes", "Interactive Git Tutorial", "CSS Flexbox Guide"
3. Click "View Resource & Discussion" on any resource
4. Read existing comments
5. Type a comment and click "Post Comment"

### As an Admin/Teacher
1. Visit http://localhost:8000/src/resources/admin.html
2. See the existing resources in a table
3. **Add:** Fill title (e.g., "JavaScript Basics"), description, and link; click "Add Resource"
4. **Edit:** Click "Edit" on any row; modify values; click "Update Resource"
5. **Delete:** Click "Delete"; confirm the dialog
6. All changes persist to `src/resources/api/resources.json`

---

## Data Persistence

### Resources (`src/resources/api/resources.json`)
```json
[
  {
    "id": "res_1",
    "title": "Chapter 1 Notes",
    "description": "A comprehensive summary of the first chapter, covering all key concepts.",
    "link": "https://example.com/notes/chapter1.pdf"
  },
  ...
]
```

### Comments (`src/resources/api/comments.json`)
```json
{
  "res_1": [
    {
      "author": "Mariam Khalifa",
      "text": "This was very helpful, thanks!"
    },
    ...
  ],
  "res_2": [...]
}
```

Changes made through the web interface persist directly to these files via the server.

---

## Compliance with Requirements

| Requirement | Status | Details |
|---|---|---|
| Admin can add resources | ✅ | POST form with title, description, link → `/api/resources` |
| Admin can edit resources | ✅ | Edit button → form pre-populate → PUT to `/api/resources/:id` |
| Admin can delete resources | ✅ | Delete button with confirmation → DELETE to `/api/resources/:id` |
| Students see read-only list | ✅ | `/src/resources/list.html` displays all resources |
| Click resource → detail page | ✅ | Links to `details.html?id=<resourceId>` |
| Discussion on detail page | ✅ | Comments section with form to post new comments |
| Comments persist | ✅ | POST to `/api/comments/:resourceId` → saved to JSON |
| Resources persist | ✅ | Add/edit/delete via server → saved to JSON |

---

## Troubleshooting

### Error: "npm: The term 'npm' is not recognized"
- **Solution:** Node.js is not installed. Download and install from https://nodejs.org/, then re-open PowerShell.

### Error: "Cannot find module 'express'"
- **Solution:** Run `npm install` from the project root to install dependencies.

### Server won't start on port 8000
- **Solution:** Check if port 8000 is already in use. You can change the port in `server.js` (line: `const PORT = process.env.PORT || 8000;`) or set an environment variable: `$env:PORT=8001` before running `npm start`.

### Fetch errors in browser console
- **Solution:** Ensure the server is running (`npm start` should show "Server running at http://localhost:8000"). Refresh the page.

### JSON files are not being updated
- **Solution:** Ensure the server is running and check that the files `src/resources/api/resources.json` and `src/resources/api/comments.json` exist and are readable. The server should have write permissions in the `src/resources/api/` directory.

---

## Summary

✅ **Task 2 is complete and ready to use.**

- All student, admin, and discussion features are implemented.
- Persistence to JSON files is working via Express server.
- Run instructions are clear and straightforward.
- Code is clean, commented, and free of errors.

**Next steps:** Run `.\start-server.ps1` and test the pages in your browser.

