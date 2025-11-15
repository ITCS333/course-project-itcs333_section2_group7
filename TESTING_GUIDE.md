# Task 2 Testing Guide — Complete Instructions

The server is **already running** on http://localhost:8000

---

## 📋 Test Checklist

Follow these steps in order to verify all features work correctly.

---

## ✅ TEST 1: Student List Page

**URL:** http://localhost:8000/src/resources/list.html

**What to expect:**
- Page title: "Course Resources"
- List showing 3 resources:
  1. "Chapter 1 Notes"
  2. "Interactive Git Tutorial"
  3. "CSS Flexbox Guide"
- Each resource has a description
- Each resource has a "View Resource & Discussion" link

**Steps:**
1. Open http://localhost:8000/src/resources/list.html in your browser
2. Verify you see the 3 resources listed
3. ✅ **Checkpoint:** Can you see all 3 resources? YES / NO

**Screenshot expectation:**
```
=== Course Resources ===

Chapter 1 Notes
A comprehensive summary of the first chapter, covering all key concepts.
[View Resource & Discussion]

Interactive Git Tutorial
An external website that lets you practice Git commands in your browser.
[View Resource & Discussion]

CSS Flexbox Guide
A complete visual guide to CSS Flexbox, with examples.
[View Resource & Discussion]
```

---

## ✅ TEST 2: Resource Detail Page

**URL:** http://localhost:8000/src/resources/details.html?id=res_1

**What to expect:**
- Page shows resource title: "Chapter 1 Notes"
- Description displayed
- Link to access the resource material
- "Discussion" section below
- Comments from other students (2 existing comments)
- Form to post a new comment

**Steps:**
1. Click on any "View Resource & Discussion" link from the list, OR
2. Directly open: http://localhost:8000/src/resources/details.html?id=res_1
3. Verify you see:
   - Resource title and description
   - "Access Resource Material" link
   - Discussion section with 2 existing comments
4. ✅ **Checkpoint:** Can you see the resource details and comments? YES / NO

**Expected comments visible:**
```
Posted by: Mariam Khalifa
This was very helpful, thanks!

Posted by: Ahmed Jasim
I found a typo on page 2.
```

---

## ✅ TEST 3: Post a New Comment (Persistence Test)

**On the Resource Detail page from Test 2:**

**Steps:**
1. Scroll to "Leave a Comment" section
2. Type a test comment: "This is a great resource!"
3. Click "Post Comment"
4. **Verify:** Your comment appears immediately in the discussion
5. **Refresh the page** (F5 or Ctrl+R)
6. ✅ **Checkpoint:** Does your comment still appear after refresh? YES / NO

**Expected behavior:**
- Comment appears instantly after posting
- Comment persists after page refresh
- If yes: Persistence is working! ✅

---

## ✅ TEST 4: Admin Page — View Resources

**URL:** http://localhost:8000/src/resources/admin.html

**What to expect:**
- "Manage Course Resources" heading
- Form: "Add a New Resource" with fields:
  - Title (required)
  - Description
  - Resource Link (required)
  - "Add Resource" button
- Table showing all 3 existing resources with columns:
  - Title
  - Description
  - Actions (Edit and Delete buttons)

**Steps:**
1. Open http://localhost:8000/src/resources/admin.html
2. Verify you see the form and table with 3 resources
3. ✅ **Checkpoint:** Can you see the add form and resource table? YES / NO

---

## ✅ TEST 5: Admin — Add a New Resource

**On the Admin page from Test 4:**

**Steps:**
1. In the "Add a New Resource" form, fill:
   - Title: "JavaScript Fundamentals"
   - Description: "Learn the basics of JavaScript programming"
   - Resource Link: "https://example.com/js"
2. Click "Add Resource"
3. **Verify:** New resource appears at bottom of table
4. **Refresh the page** (F5)
5. ✅ **Checkpoint:** Is the new resource still in the table after refresh? YES / NO

**Expected behavior:**
- New row added to table immediately
- Button changes back to "Add Resource"
- Form clears
- After refresh: resource persists ✅

---

## ✅ TEST 6: Admin — Edit a Resource

**On the Admin page (with the new resource from Test 5):**

**Steps:**
1. Find the newly added "JavaScript Fundamentals" resource in the table
2. Click "Edit" button on that row
3. **Verify:** Form populates with:
   - Title: "JavaScript Fundamentals"
   - Description: "Learn the basics of JavaScript programming"
   - Resource Link: "https://example.com/js"
4. Change the title to: "JavaScript Basics (Updated)"
5. Click "Update Resource"
6. **Verify:** Row in table updates with new title
7. **Refresh the page** (F5)
8. ✅ **Checkpoint:** Does the updated title persist after refresh? YES / NO

**Expected behavior:**
- Form populates when Edit is clicked
- Button changes to "Update Resource"
- After submit: row updates immediately
- After refresh: changes persist ✅

---

## ✅ TEST 7: Admin — Delete a Resource

**On the Admin page (with updated resource from Test 6):**

**Steps:**
1. Find the "JavaScript Basics (Updated)" resource
2. Click "Delete" button
3. **Verify:** A confirmation dialog appears asking "Delete this resource?"
4. Click "OK" to confirm deletion
5. **Verify:** Row removed from table
6. **Refresh the page** (F5)
7. ✅ **Checkpoint:** Is the resource still deleted after refresh? YES / NO

**Expected behavior:**
- Confirmation dialog appears
- After confirmation: row removed immediately
- After refresh: deletion persists ✅

---

## ✅ TEST 8: Navigation Between Pages

**Test that links work correctly:**

**Steps:**
1. Go to Student List: http://localhost:8000/src/resources/list.html
2. Click "View Resource & Discussion" on any resource
3. Verify you're on the detail page for that resource
4. Verify URL contains: `?id=res_1` (or correct resource ID)
5. Go back and try different resources
6. ✅ **Checkpoint:** Do all navigation links work? YES / NO

---

## ✅ TEST 9: Multiple Resources in Discussion

**Test posting comments on different resources:**

**Steps:**
1. Go to: http://localhost:8000/src/resources/details.html?id=res_1
2. Post a comment: "Comment on resource 1"
3. Go to: http://localhost:8000/src/resources/details.html?id=res_2
4. Verify you see different comments (from Sara Ali)
5. Post a comment: "Comment on resource 2"
6. Go back to resource 1: http://localhost:8000/src/resources/details.html?id=res_1
7. ✅ **Checkpoint:** Do you see your first comment (not the second one)? YES / NO

**Expected behavior:**
- Each resource has its own comments
- Comments don't mix between resources
- Each comment appears on the correct resource ✅

---

## ✅ TEST 10: Error Handling

**Test that the app handles edge cases:**

**Steps:**
1. Try to add resource with missing title:
   - Leave Title blank
   - Fill Link and Description
   - Click "Add Resource"
   - ✅ Should show error or not add
2. Try to add resource with missing link:
   - Fill Title
   - Leave Link blank
   - Click "Add Resource"
   - ✅ Should show error or not add
3. Try to post empty comment:
   - Click "Post Comment" without typing anything
   - ✅ Should not post or show error

**Expected behavior:**
- Required fields are enforced
- Empty submissions don't save
- Clear error messages (optional) ✅

---

## 📊 Final Test Summary

Create a checklist of all tests and mark as PASS/FAIL:

```
Test 1: Student List Page              [ ] PASS  [ ] FAIL
Test 2: Resource Detail Page           [ ] PASS  [ ] FAIL
Test 3: Post Comment (Persistence)     [ ] PASS  [ ] FAIL
Test 4: Admin View Resources           [ ] PASS  [ ] FAIL
Test 5: Admin Add Resource (Persist)   [ ] PASS  [ ] FAIL
Test 6: Admin Edit Resource (Persist)  [ ] PASS  [ ] FAIL
Test 7: Admin Delete Resource (Persist)[ ] PASS  [ ] FAIL
Test 8: Navigation Between Pages       [ ] PASS  [ ] FAIL
Test 9: Multiple Resources Comments    [ ] PASS  [ ] FAIL
Test 10: Error Handling                [ ] PASS  [ ] FAIL

OVERALL: [ ] ALL PASS ✅  [ ] SOME FAIL ⚠️
```

---

## 🔍 Troubleshooting During Testing

### Problem: Page shows "Loading..." forever
**Solution:**
- Refresh the page (F5)
- Check that server is still running (terminal should show "Running on...")
- Open browser console (F12) and check for errors

### Problem: "Cannot POST /api/resources"
**Solution:**
- Server may have crashed. Check terminal for error messages
- Restart: Press Ctrl+C in terminal, then run server again

### Problem: Changes don't save (not persisting)
**Solution:**
- Check terminal for write errors
- Ensure `src/resources/api/` folder exists and is writable
- Restart the server

### Problem: Can't access http://localhost:8000
**Solution:**
- Verify server is running (terminal should show "Running on...")
- Try opening directly: http://127.0.0.1:8000
- Check if port 8000 is blocked or in use

---

## 📝 Data Verification

After testing, verify the JSON files were updated:

### Check `src/resources/api/resources.json`
- Should contain your added/edited resources
- Should NOT contain deleted resources
- Should have 3 original + any new ones you added

### Check `src/resources/api/comments.json`
- Should contain your posted comments
- Should be organized by resource ID
- Example:
  ```json
  {
    "res_1": [
      { "author": "Student", "text": "Your comment here" },
      ...
    ]
  }
  ```

---

## ✅ Success Criteria

**All tests PASS if:**
- ✅ All 3 resources visible on list page
- ✅ Resource details load correctly
- ✅ Comments display and persist
- ✅ Admin can add resources
- ✅ Admin can edit resources
- ✅ Admin can delete resources
- ✅ All changes persist after refresh
- ✅ Navigation works between pages
- ✅ Each resource has separate comments
- ✅ Required fields are validated

**If all checkboxes are YES → Task 2 is working perfectly! 🎉**

