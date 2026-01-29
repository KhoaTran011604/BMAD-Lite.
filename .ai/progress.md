# Project Progress

Task tracking file for BMAD-Lite workflow.
Updated automatically as stories progress.

---

## Overview

| Field | Value |
|-------|-------|
| **Project** | {project_name} |
| **Started** | {start_date} |
| **Last Updated** | {last_update} |
| **Status** | Planning / In Progress / Complete |

---

## Epic Progress

| Epic | Title | Status | Stories | Completed | Progress |
|------|-------|--------|---------|-----------|----------|
| 1 | {title} | {status} | {total} | {done} | {%} |
| 2 | {title} | {status} | {total} | {done} | {%} |
| 3 | {title} | {status} | {total} | {done} | {%} |

**Overall Progress:** {total_completed}/{total_stories} stories ({overall_percent}%)

---

## Current Focus

| Field | Value |
|-------|-------|
| **Active Story** | {epic}.{story} - {title} |
| **Status** | {Draft/Approved/InProgress/Review} |
| **Tasks Progress** | {completed}/{total} tasks |
| **Assigned** | @executor |

---

## Story Status Matrix

### Epic 1: {title}

| Story | Title | Status | Tasks | Notes |
|-------|-------|--------|-------|-------|
| 1.1 | {title} | Done | 4/4 | |
| 1.2 | {title} | Done | 3/3 | |
| 1.3 | {title} | InProgress | 2/4 | Current focus |
| 1.4 | {title} | Pending | 0/5 | |

### Epic 2: {title}

| Story | Title | Status | Tasks | Notes |
|-------|-------|--------|-------|-------|
| 2.1 | {title} | Pending | 0/4 | |
| 2.2 | {title} | Pending | 0/3 | |

---

## Recent Activity

| Date | Story | Action | Notes |
|------|-------|--------|-------|
| {date} | 1.3 | Started | Beginning authentication |
| {date} | 1.2 | Completed | All tests pass |
| {date} | 1.2 | Review | PASS - minor concerns noted |
| {date} | 1.1 | Completed | Foundation setup done |

---

## Blockers / Risks

| ID | Description | Impact | Status | Resolution |
|----|-------------|--------|--------|------------|
| - | None | - | - | - |

---

## Notes

- {Any project-wide notes}
- {Decisions made during development}
- {Important reminders}

---

## Quick Commands

```
/status              # Refresh this view
/status story 1.3    # View specific story
/execute develop     # Continue current story
/execute draft       # Draft next story
/review story 1.3    # Review completed story
```

---

<!--
TEMPLATE INSTRUCTIONS:

This file is created when first story is drafted.
Updated by @executor after each story status change.

Status values:
- Pending: Not started
- Draft: Story drafted, awaiting approval
- Approved: Ready for implementation
- InProgress: Currently being implemented
- Review: Awaiting review
- Done: Complete

To update manually:
1. Change story status in matrix
2. Update Epic Progress percentages
3. Add entry to Recent Activity
4. Update Current Focus section
-->
