# Task 2 Quick Reference

## What's Implemented ✅

**Course Resources Feature** — Complete student/admin/discussion system with persistent data storage.

---

## Files Created/Modified

### Core Pages (HTML + JavaScript)
```
src/resources/list.html        (Student list view)
src/resources/list.js          (Fetch & render resources)
src/resources/admin.html       (Admin CRUD interface)
src/resources/admin.js         (Add/Edit/Delete logic)
src/resources/details.html     (Resource detail + comments)
src/resources/details.js       (Render detail & handle comments)
```

### Backend
```
server.js                      (Express REST API)
package.json                   (npm dependencies)
start-server.ps1               (PowerShell start helper)
```

### Documentation
```
TASK2_COMPLETE.md              (Full feature documentation)
TASK2_CHECKLIST.md             (Implementation checklist)
RUN_TASK2.md                   (Quick start)
TASK2_QUICK_REF.md             (This file)
```

### Data
```
src/resources/api/resources.json    (Resource data)
src/resources/api/comments.json     (Comment data)
```

---

## Features at a Glance

| Feature | Student | Admin | Location |
|---------|---------|-------|----------|
| View resource list | ✅ | ✅ | `list.html` |
| View resource detail | ✅ | ✅ | `details.html?id=res_X` |
| Read comments | ✅ | ✅ | `details.html` |
| Post comments | ✅ | ✅ | `details.html` |
| Add resource | ❌ | ✅ | `admin.html` |
| Edit resource | ❌ | ✅ | `admin.html` |
| Delete resource | ❌ | ✅ | `admin.html` |

---

## How to Run (3 Steps)

### Step 1: Install Node.js
Download and install from **https://nodejs.org/**

### Step 2: Start the Server
Open PowerShell in the project folder and run:
```powershell
.\start-server.ps1
```

You should see:
```
Server running at http://localhost:8000
```

### Step 3: Open in Browser
- **Student View:** http://localhost:8000/src/resources/list.html
- **Admin View:** http://localhost:8000/src/resources/admin.html
- **Resource Detail:** http://localhost:8000/src/resources/details.html?id=res_1

---

## API Endpoints (for reference)

```
GET    /api/resources              → All resources (array)
POST   /api/resources              → Create resource
PUT    /api/resources/:id          → Update resource
DELETE /api/resources/:id          → Delete resource
GET    /api/comments               → All comments (by resourceId)
POST   /api/comments/:resourceId   → Add comment
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| npm not found | Install Node.js from https://nodejs.org/ |
| Port 8000 in use | Change port in `server.js` or run `$env:PORT=8001; npm start` |
| Fetch errors | Make sure server is running; refresh page |
| Changes not saving | Check server is running; verify folder permissions |

---

## Verification Checklist

Before submitting, verify:
- [ ] Server starts without errors
- [ ] Can view resource list at `list.html`
- [ ] Can click "View Resource & Discussion" link
- [ ] Can see resource detail page with comments
- [ ] Can post a comment and see it appear
- [ ] Can visit admin page and see table of resources
- [ ] Can add a new resource and see it in table
- [ ] Can edit a resource and see changes
- [ ] Can delete a resource (with confirmation)
- [ ] After refresh, all changes still persist

---

## Key Files to Know

- **server.js** — The Express server (runs on port 8000)
- **src/resources/list.html** — What students see first
- **src/resources/admin.html** — Admin page for managing resources
- **src/resources/details.html** — Individual resource page with comments
- **src/resources/api/resources.json** — Resource data (auto-saved by server)
- **src/resources/api/comments.json** — Comment data (auto-saved by server)

---

**Status: ✅ COMPLETE AND READY TO RUN**

For full documentation, see `TASK2_COMPLETE.md`.

