# Quick Test — Copy & Paste URLs

The server is running on http://localhost:8000

## Open These URLs in Your Browser

### 1. Student List (See all resources)
```
http://localhost:8000/src/resources/list.html
```
**What you'll see:** 3 resources with "View Resource & Discussion" links

---

### 2. Resource Detail + Comments (Example 1)
```
http://localhost:8000/src/resources/details.html?id=res_1
```
**What to do:**
- Read the resource description
- Read existing 2 comments
- Type a new comment and click "Post Comment"
- Refresh (F5) → comment should still be there ✅

---

### 3. Resource Detail + Comments (Example 2)
```
http://localhost:8000/src/resources/details.html?id=res_2
```
**What to do:**
- Notice different comments (1 comment from Sara)
- Post a comment here
- Go back to res_1 → your comment there, not here ✅

---

### 4. Resource Detail + Comments (Example 3)
```
http://localhost:8000/src/resources/details.html?id=res_3
```
**What to do:**
- This resource has no comments yet
- Post the first comment here

---

### 5. Admin Page (Add/Edit/Delete)
```
http://localhost:8000/src/resources/admin.html
```
**What to do:**
1. **Add:** Fill form (Title, Description, Link) → click "Add Resource" → see in table
2. **Edit:** Click "Edit" on any row → form populates → change values → click "Update Resource"
3. **Delete:** Click "Delete" → confirm → row disappears
4. **Refresh (F5)** → all changes should still be there ✅

---

## Test Order (Recommended)

1. Open Student List → click a link to Resource Detail
2. Post a comment on the resource
3. Refresh page → comment should persist
4. Go to Admin page
5. Add a new resource
6. Refresh → new resource still there
7. Edit the new resource
8. Refresh → changes persisted
9. Delete the new resource
10. Refresh → resource is gone

**If all persist after refresh → Task 2 is working! ✅**

---

## Expected Results

| Action | Expected Result |
|--------|-----------------|
| View list | See 3 resources |
| Click link | Go to detail page |
| Post comment | Comment appears immediately |
| Refresh after comment | Comment still there ✅ |
| Add resource | Appears in table |
| Refresh after add | Resource still in table ✅ |
| Edit resource | Form populates, can save changes |
| Refresh after edit | Changes still there ✅ |
| Delete resource | Row disappears |
| Refresh after delete | Resource stays deleted ✅ |

---

## Verify Persistence

After testing, check these files were updated:

**Resource changes:**
- File: `src/resources/api/resources.json`
- Should contain your added/edited resources
- Should NOT contain deleted ones

**Comment changes:**
- File: `src/resources/api/comments.json`
- Should contain your posted comments
- Organized by resource ID (res_1, res_2, etc.)

Open these files in VS Code to verify! 📂

