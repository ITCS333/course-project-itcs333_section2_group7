Running Task 2 (Course Resources)
=================================

This project includes a tiny Express server that provides REST endpoints for the Course Resources feature and persists changes to the JSON files in `src/resources/api`.

Prerequisites
- Node.js and npm installed on your machine (LTS recommended). Download from https://nodejs.org/

Quick start (PowerShell)
1. Open PowerShell and change to the repository root folder (where this README.md is):

```powershell
cd C:\Users\AM\Desktop\333Project\course-project-itcs333_section2_group7
```

2. Use the helper script to install dependencies and start the server (it checks for Node/npm and runs `npm install` / `npm start`):

```powershell
.\start-server.ps1
```

3. Open these pages in your browser:
- Student list: http://localhost:8000/src/resources/list.html
- Resource detail (example): http://localhost:8000/src/resources/details.html?id=res_1
- Admin (manage): http://localhost:8000/src/resources/admin.html

Notes
- Admin actions (add/edit/delete) persist to `src/resources/api/resources.json`.
- Posting comments persists to `src/resources/api/comments.json`.
- If you cannot install Node.js on your machine, the pages will still render but the persistence endpoints will not work — let me know and I can add a fallback static-only mode.
