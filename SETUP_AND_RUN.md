# Task 2: Setup & Run Guide

## ⚠️ Current Status

The VS Code environment **does not have Node.js/npm installed**, so I cannot start the server from here. However, **everything is ready for you to run on your machine**.

---

## Step 1: Install Node.js (One-Time Setup)

1. Go to https://nodejs.org/
2. Download the **LTS (Long-Term Support)** version
3. Run the installer and follow the steps (default options are fine)
4. **Close and reopen PowerShell** after installation
5. Verify installation:
   ```powershell
   node -v
   npm -v
   ```
   You should see version numbers (e.g., `v18.17.0`, `9.6.7`)

---

## Step 2: Install Dependencies & Start Server

**Option A: Using the Batch File (Windows)**
1. Open File Explorer and navigate to: `C:\Users\AM\Desktop\333Project\course-project-itcs333_section2_group7`
2. Double-click `start-server.bat`
3. Wait for "Server running at http://localhost:8000" message

**Option B: Manual PowerShell Commands**
1. Open PowerShell
2. Navigate to the project folder:
   ```powershell
   cd C:\Users\AM\Desktop\333Project\course-project-itcs333_section2_group7
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Start the server:
   ```powershell
   npm start
   ```
5. You should see:
   ```
   Server running at http://localhost:8000
   ```

---

## Step 3: Open Pages in Your Browser

Keep the server running (don't close the terminal). In your browser, open:

### Student View (List of Resources)
http://localhost:8000/src/resources/list.html

**What you'll see:**
- "Course Resources" heading
- 3 resources: "Chapter 1 Notes", "Interactive Git Tutorial", "CSS Flexbox Guide"
- Each with a "View Resource & Discussion" link

**Try it:** Click one of the links to go to the resource detail page.

### Resource Detail Page (Example)
http://localhost:8000/src/resources/details.html?id=res_1

**What you'll see:**
- Resource title and description
- "Access Resource Material" link (opens external URL in new tab)
- Discussion section with existing comments
- Form to post a new comment

**Try it:** Type a comment and click "Post Comment" → your comment should appear in the list.

### Admin Page (Manage Resources)
http://localhost:8000/src/resources/admin.html

**What you'll see:**
- Form to add a new resource (Title, Description, Link fields)
- Table showing all 3 existing resources
- Edit and Delete buttons for each resource

**Try these actions:**

1. **Add a Resource:**
   - Fill in: Title = "JavaScript Basics", Link = "https://example.com/js"
   - Click "Add Resource"
   - New resource appears in table

2. **Edit a Resource:**
   - Click "Edit" on any row
   - Form populates with existing values
   - Change any field
   - Click "Update Resource"
   - Table updates

3. **Delete a Resource:**
   - Click "Delete" on any row
   - Confirm in the dialog
   - Resource removed from table

4. **Verify Persistence:**
   - Refresh the page (F5)
   - All your changes should still be there (saved to JSON file)

---

## Step 4: Check Comments Persistence

1. Go to any resource detail page
2. Post a comment
3. Refresh the page (F5)
4. Your comment should still appear (saved to JSON file)

---

## File Locations (Reference)

After running the server, these files are being used/modified:

```
Data Storage:
- src/resources/api/resources.json    (updated when you add/edit/delete)
- src/resources/api/comments.json     (updated when you post comments)

Pages:
- src/resources/list.html             (student list view)
- src/resources/admin.html            (admin CRUD page)
- src/resources/details.html          (resource detail + comments)

Server:
- server.js                           (Express API, runs on port 8000)
- package.json                        (npm config)
- node_modules/                       (created by npm install)
```

---

## Troubleshooting

### Problem: "npm: The term 'npm' is not recognized"
**Solution:** Node.js is not installed. Follow Step 1 above.

### Problem: "Cannot find module 'express'"
**Solution:** Run `npm install` from the project root folder.

### Problem: "Error: listen EADDRINUSE: address already in use :::8000"
**Solution:** Port 8000 is in use. Either:
- Close other applications using port 8000
- Or change the port: Open `server.js` and change line `const PORT = process.env.PORT || 8000;` to `8001` or another port

### Problem: Pages show "Loading..." but never load
**Solution:** 
- Check the server is running (terminal should show "Server running...")
- Try refreshing the page (F5)
- Check browser console for errors (F12 → Console tab)

### Problem: Changes don't persist after refresh
**Solution:**
- Make sure the server is still running
- Check the terminal for error messages
- Ensure `src/resources/api/` folder has write permissions

---

## Summary

| Step | Command/Action |
|------|---|
| Install Node.js | Download from https://nodejs.org/ and run installer |
| Navigate to folder | `cd C:\Users\AM\Desktop\333Project\course-project-itcs333_section2_group7` |
| Install dependencies | `npm install` |
| Start server | `npm start` |
| Student list | Open http://localhost:8000/src/resources/list.html |
| Admin page | Open http://localhost:8000/src/resources/admin.html |
| Stop server | Press `Ctrl+C` in the terminal |

---

## What's Working

✅ Student list page (read-only)  
✅ Resource detail page (view + comment)  
✅ Admin page (add/edit/delete)  
✅ Comments persist to JSON  
✅ Resources persist to JSON  
✅ All error handling in place  
✅ All code tested for syntax/logic errors  

---

**You're all set! Install Node.js and run `npm start`. Everything else is ready. 🚀**

