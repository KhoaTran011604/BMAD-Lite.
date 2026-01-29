# BMAD-Lite User Guide

**Version:** 1.0
**Simplified AI-Driven Development Workflow**

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Quick Start](#2-quick-start)
3. [Folder Structure](#3-folder-structure)
4. [Agents](#4-agents)
5. [Commands Reference](#5-commands-reference)
6. [Workflow Phases](#6-workflow-phases)
7. [Templates](#7-templates)
8. [Task Tracking](#8-task-tracking)
9. [Skill Integration](#9-skill-integration)
10. [Checklists](#10-checklists)
11. [Best Practices](#11-best-practices)
12. [Troubleshooting](#12-troubleshooting)
13. [Comparison with BMAD Full](#13-comparison-with-bmad-full)

---

## 1. Introduction

### What is BMAD-Lite?

BMAD-Lite là phiên bản đơn giản hóa của BMAD (Business-driven Modular AI Development) workflow. Nó giữ lại những điểm mạnh của BMAD nhưng dễ sử dụng hơn.

### Key Features

| Feature | Description |
|---------|-------------|
| **3 Unified Agents** | Thay vì 10 agents, chỉ có 3: Planner, Executor, Reviewer |
| **Less Strict Docs** | Pre-populate và validate thay vì hỏi từng section |
| **100% BMAD Templates** | PRD và Architecture giữ nguyên chuẩn BMAD |
| **Skill Integration** | Tích hợp Skills cho implementation linh hoạt |
| **Markdown Tracking** | Task tracking đơn giản trong `.ai/` folder |

### Core Philosophy

```
1. PLAN    → @planner tạo PRD + Architecture
2. EXECUTE → @executor draft story + implement với skills
3. REVIEW  → @reviewer validate (optional)
```

---

## 2. Quick Start

### Step 1: Start Planning

```bash
/bmad-plan prd
```

Planner sẽ:
- Hỏi về project của bạn
- Pre-populate PRD với educated guesses
- Trình bày draft để bạn validate
- Focus vào critical decisions

### Step 2: Create Architecture

```bash
/bmad-plan arch
```

Planner sẽ:
- Đọc PRD đã tạo
- Pre-populate Architecture document
- Tech stack table là single source of truth

### Step 3: Draft First Story

```bash
/bmad-execute draft
```

Executor sẽ:
- Xác định story đầu tiên từ PRD
- Tạo story file với tasks, dev notes
- Suggest skills phù hợp

### Step 4: Implement

```bash
/bmad-execute develop
```

Executor sẽ:
- Implement từng task
- Sử dụng skills khi cần
- Update checkboxes và file list

### Step 5: Review (Optional)

```bash
/bmad-review story 1.1
```

Reviewer sẽ:
- Validate acceptance criteria
- Check code quality
- Quyết định: PASS / CONCERNS / FAIL

---

## 3. Folder Structure

```
project-root/
│
├── .bmad-lite/                    # BMAD-Lite core
│   ├── config.yaml                # Configuration
│   ├── workflow.yaml              # Workflow definition
│   ├── guide.md                   # This file
│   │
│   ├── agents/                    # Agent definitions
│   │   ├── planner.md             # PM + Architect
│   │   ├── executor.md            # SM + Dev
│   │   └── reviewer.md            # QA + PO
│   │
│   ├── templates/                 # Document templates
│   │   ├── prd.yaml               # PRD template
│   │   ├── architecture.yaml      # Architecture template
│   │   ├── epic.yaml              # Epic template
│   │   └── story.yaml             # Story template
│   │
│   ├── tasks/                     # Detailed workflows
│   │   ├── create-epic.md         # Epic creation flow
│   │   └── create-story.md        # Story creation flow
│   │
│   ├── checklists/                # Validation checklists
│   │   ├── planning-checklist.md  # PRD + Arch validation
│   │   └── done-checklist.md      # Story completion
│   │
│   └── data/                      # Reference data
│       └── tech-preferences.md    # Tech preferences template
│
├── .claude/commands/BMad-Lite/    # IDE Commands
│   ├── bmad-plan.md               # /bmad-plan command
│   ├── bmad-execute.md            # /bmad-execute command
│   ├── bmad-review.md             # /bmad-review command
│   ├── bmad-status.md             # /bmad-status command
│   ├── bmad-refactor.md           # /bmad-refactor command
│   └── bmad-sync.md               # /bmad-sync command
│
├── .ai/                           # Task Tracking
│   ├── progress.md                # Overall progress
│   └── stories/                   # Story files
│       ├── 1.1.md
│       ├── 1.2.md
│       └── ...
│
├── docs/                          # Generated Documents
│   ├── prd.md                     # Product Requirements
│   ├── architecture.md            # Architecture
│   └── epics/                     # Optional epic files
│       ├── epic-1.md
│       └── epic-2.md
│
└── src/                           # Your source code
```

---

## 4. Agents

### 4.1 Planner Agent

**Role:** Strategic Planner & Solution Architect
**Combines:** Product Manager + Architect
**Icon:** 🎯

#### Activation

```bash
/bmad-plan
# hoặc
@planner
```

#### Commands

| Command | Description |
|---------|-------------|
| `*help` | Show available commands |
| `*brainstorm` | Brainstorming session |
| `*create-prd` | Create PRD document |
| `*create-architecture` | Create Architecture document |
| `*create-epic` | Create epic file |
| `*refactor-docs` | Restructure docs to keep them lean |
| `*sync-docs epic` | Add new epic post-MVP |
| `*sync-docs story` | Add new story to existing epic |
| `*sync-docs all` | Full sync check |
| `*planning-checklist` | Validate planning artifacts |
| `*doc-out` | Output document to file |
| `*shard` | Split document into sections |
| `*yolo` | Toggle confirmation mode |
| `*status` | Show planning progress |
| `*exit` | Exit planner mode |

#### Approach: Less Strict

Planner sử dụng approach **pre-populate and validate**:

1. **Pre-populate** - Điền sẵn các sections với educated guesses
2. **Present** - Trình bày complete section cho user
3. **Focus** - Chỉ hỏi chi tiết cho CRITICAL decisions
4. **Accept** - Chấp nhận "good enough" documentation

---

### 4.2 Executor Agent

**Role:** Technical Executor & Implementation Specialist
**Combines:** Scrum Master + Developer
**Icon:** ⚡

#### Activation

```bash
/bmad-execute
# hoặc
@executor
```

#### Commands

| Command | Description |
|---------|-------------|
| `*help` | Hiển thị danh sách commands |
| `*draft-story` | Tạo story tiếp theo |
| `*develop` | Implement current story |
| `*run-tests` | Chạy tests |
| `*story-checklist` | Validate story draft |
| `*done-checklist` | Validate completion |
| `*use-skill {name}` | Sử dụng skill cụ thể |
| `*list-skills` | Liệt kê available skills |
| `*explain` | Giải thích actions (teaching mode) |
| `*status` | Show story status |
| `*exit` | Exit executor mode |

#### Story Creation Flow

```
1. Identify next story (check .ai/stories/)
2. Load from epic/PRD
3. Extract: Story statement + AC
4. Load architecture context
5. Generate tasks with AC references
6. Suggest appropriate skills
7. Create .ai/stories/{epic}.{story}.md
8. Set status: Draft
```

#### Development Flow

```
1. Read story file
2. Verify status = Approved
3. For each task:
   a. Check if skill is appropriate
   b. If yes: Load and follow skill
   c. Implement task
   d. Write tests
   e. Run validations
   f. If pass: Mark [x]
   g. Update File List
4. Run done-checklist
5. Set status: Ready for Review
```

---

### 4.3 Reviewer Agent

**Role:** Quality Guardian & Acceptance Validator
**Combines:** QA + Product Owner
**Icon:** 🔍
**Status:** OPTIONAL

#### Activation

```bash
/bmad-review
# hoặc
@reviewer
```

#### Commands

| Command | Description |
|---------|-------------|
| `*help` | Hiển thị danh sách commands |
| `*review-story {id}` | Full story review |
| `*quick-review {id}` | Quick review cho simple changes |
| `*validate-artifacts` | Validate all planning docs |
| `*exit` | Exit reviewer mode |

#### Review Decisions

| Decision | Meaning | Action |
|----------|---------|--------|
| **PASS** | All AC met, quality OK | Mark story Done |
| **CONCERNS** | Minor issues | Note issues, can proceed |
| **FAIL** | Critical issues | Must fix before continuing |

---

## 5. Commands Reference

### IDE Slash Commands

| Command | Action | Agent |
|---------|--------|-------|
| `/bmad-plan` | Enter planning mode | @planner |
| `/bmad-plan prd` | Create PRD | @planner |
| `/bmad-plan arch` | Create Architecture | @planner |
| `/bmad-plan epic` | Create epic files | @planner |
| `/bmad-plan validate` | Run planning checklist | @planner |
| `/bmad-execute` | Enter execution mode | @executor |
| `/bmad-execute draft` | Draft next story | @executor |
| `/bmad-execute develop` | Implement story | @executor |
| `/bmad-execute done` | Validate completion | @executor |
| `/bmad-execute use-skill {name}` | Use specific skill | @executor |
| `/bmad-review` | Enter review mode | @reviewer |
| `/bmad-review story {id}` | Review specific story | @reviewer |
| `/bmad-review quick {id}` | Quick review | @reviewer |
| `/bmad-refactor docs` | Restructure docs to keep lean | @planner |
| `/bmad-refactor prd` | Refactor PRD only | @planner |
| `/bmad-refactor arch` | Refactor Architecture only | @planner |
| `/bmad-sync epic` | Add new epic post-MVP | @planner |
| `/bmad-sync story` | Add new story to epic | @planner |
| `/bmad-sync all` | Full sync check | @planner |
| `/bmad-status` | Show project progress | - |
| `/bmad-status story {id}` | Show story status | - |

### Agent Commands (with * prefix)

Khi đã activate agent, sử dụng commands với prefix `*`:

```
*help              # Show commands
*create-prd        # Create PRD (in planner)
*draft-story       # Create story (in executor)
*review-story 1.3  # Review story (in reviewer)
```

---

## 6. Workflow Phases

### Phase 1: Planning

```
┌─────────────────────────────────────────────────────────────┐
│                    PLANNING PHASE                            │
│                      (@planner)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  Brainstorm  │───▶│  Create PRD  │───▶│ Create Arch  │   │
│  │  (optional)  │    │              │    │              │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                             │                    │           │
│                             ▼                    ▼           │
│                      ┌──────────────┐    ┌──────────────┐   │
│                      │ Create Epics │    │   Validate   │   │
│                      │  (optional)  │    │  (optional)  │   │
│                      └──────────────┘    └──────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                         docs/prd.md
                    docs/architecture.md
```

**Outputs:**
- `docs/prd.md` - Product Requirements Document
- `docs/architecture.md` - Architecture Document
- `docs/epics/epic-{n}.md` - Epic files (optional)

---

### Phase 2: Execution

```
┌─────────────────────────────────────────────────────────────┐
│                   EXECUTION PHASE                            │
│                     (@executor)                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │ Draft Story  │───▶│   Approve    │───▶│   Develop    │   │
│  │              │    │              │    │  + Skills    │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│         │                                       │            │
│         │            ┌──────────────┐           │            │
│         │            │   Validate   │◀──────────┘            │
│         │            │  Completion  │                        │
│         │            └──────────────┘                        │
│         │                   │                                │
│         │                   ▼                                │
│         │            ┌──────────────┐                        │
│         └───────────▶│ Next Story?  │────── YES ────┐       │
│                      └──────────────┘                │       │
│                             │ NO                     │       │
│                             ▼                        │       │
│                         [DONE]◀──────────────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    .ai/stories/{epic}.{story}.md
```

**Outputs:**
- `.ai/stories/1.1.md`, `.ai/stories/1.2.md`, ...
- Source code implementation

---

### Phase 3: Review (Optional)

```
┌─────────────────────────────────────────────────────────────┐
│                    REVIEW PHASE                              │
│                    (@reviewer)                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │Review Story  │───▶│   Decision   │───▶│  Mark Done   │   │
│  │              │    │              │    │              │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                             │                                │
│                    ┌────────┼────────┐                       │
│                    ▼        ▼        ▼                       │
│                  PASS   CONCERNS   FAIL                      │
│                    │        │        │                       │
│                    │        │        ▼                       │
│                    │        │   ┌──────────┐                 │
│                    │        │   │  Fix &   │                 │
│                    │        │   │ Re-review│                 │
│                    │        │   └──────────┘                 │
│                    ▼        ▼                                │
│               [Story Done]                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Templates

### 7.1 PRD Template

**File:** `.bmad-lite/templates/prd.yaml`
**Output:** `docs/prd.md`

#### Sections

| Section | Required | Description |
|---------|----------|-------------|
| Goals and Background | ✓ | Goals, context, change log |
| Requirements | ✓ | Functional (FR) + Non-functional (NFR) |
| UI Design Goals | Conditional | UX vision, screens, accessibility |
| Technical Assumptions | ✓ | Architecture, testing, tech choices |
| Epic List | ✓ | High-level epic overview |
| Epic Details | ✓ | Stories with AC for each epic |
| Checklist Results | Optional | Validation results |
| Next Steps | ✓ | Handoff prompts |

#### Story Format (Gherkin)

```markdown
### Story 1.1: User Registration

**As a** new user,
**I want** to create an account,
**so that** I can access the application.

**Acceptance Criteria:**
1. Given I'm on registration page, When I submit valid data, Then account is created
2. Given email exists, When I try to register, Then I see error message
```

---

### 7.2 Architecture Template

**File:** `.bmad-lite/templates/architecture.yaml`
**Output:** `docs/architecture.md`

#### Sections

| Section | Required | Description |
|---------|----------|-------------|
| Introduction | ✓ | Context, starter template |
| High Level Architecture | ✓ | Overview, diagrams, patterns |
| **Tech Stack** | ✓ CRITICAL | Single source of truth |
| Data Models | ✓ | Entities, TypeScript interfaces |
| API Specification | Conditional | REST/GraphQL spec |
| Components | ✓ | Service boundaries |
| Frontend Architecture | Conditional | Component, state, routing |
| Backend Architecture | ✓ | Services, database, auth |
| Database Schema | ✓ | Tables, indexes |
| Source Tree | ✓ | Folder structure |
| Infrastructure | ✓ | Deployment, CI/CD |
| Coding Standards | ✓ | AI agent directives |
| Test Strategy | ✓ | Testing pyramid |
| Security | ✓ CRITICAL | Auth, validation, secrets |
| Error Handling | ✓ | Logging, error format |

#### Tech Stack Table Format

```markdown
| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Language | TypeScript | 5.3.x | Primary | Type safety |
| Runtime | Node.js | 20.x LTS | Server | Stability |
| Framework | NestJS | 10.x | Backend | Enterprise |
```

---

### 7.3 Epic Template

**File:** `.bmad-lite/templates/epic.yaml`
**Output:** `docs/epics/epic-{n}.md`

#### Structure

```markdown
# Epic {n}: {title}

**Status:** Ready
**PRD Reference:** docs/prd.md#epic-{n}

## Goal
{2-3 sentences}

## Stories

### Story {n}.1: {title}
**As a** {user}, **I want** {action}, **so that** {benefit}.

**Acceptance Criteria:**
1. Given..., When..., Then...

**Dependencies:** {list}
**Estimated Effort:** 2-4 hours
```

---

### 7.4 Story Template

**File:** `.bmad-lite/templates/story.yaml`
**Output:** `.ai/stories/{epic}.{story}.md`

#### Structure

```markdown
# Story {epic}.{story}: {title}

**Status:** Draft | Approved | InProgress | Review | Done

## Story
**As a** {user}, **I want** {action}, **so that** {benefit}.

## Acceptance Criteria
1. Given..., When..., Then...

## Tasks
- [ ] Task 1 (AC: 1, 2)
  - [ ] Subtask 1.1
- [ ] Task 2 (AC: 3)

## Dev Notes
### Relevant Files
[Source: docs/architecture.md#source-tree]

### Data Models
[Source: docs/architecture.md#data-models]

## Suggested Skills
- @test-driven-development
- @{framework}-best-practices

## Change Log
| Date | Version | Description | Author |

## Dev Record
### Agent Model
### Completion Notes
### File List

## Review Results
(Optional - filled by reviewer)
```

---

## 8. Task Tracking

### 8.1 Progress File

**Location:** `.ai/progress.md`

```markdown
# Project Progress

## Overview
| Field | Value |
|-------|-------|
| Project | My App |
| Started | 2024-01-15 |
| Status | In Progress |

## Epic Progress
| Epic | Status | Stories | Completed | Progress |
|------|--------|---------|-----------|----------|
| 1 | In Progress | 5 | 3 | 60% |
| 2 | Pending | 4 | 0 | 0% |

## Current Focus
| Active Story | 1.4 |
| Status | InProgress |
| Tasks | 2/4 |
```

### 8.2 Story Status Lifecycle

```
Draft ──▶ Approved ──▶ InProgress ──▶ Review ──▶ Done
  │                                      │
  │                                      ▼
  │                              (Optional Reviewer)
  │
  └── User approves to start development
```

| Status | Description | Who Sets |
|--------|-------------|----------|
| Draft | Created, awaiting approval | @executor |
| Approved | Ready for implementation | User |
| InProgress | Being implemented | @executor |
| Review | Awaiting quality review | @executor |
| Done | Complete and approved | User/@reviewer |

### 8.3 Task Checkbox Format

```markdown
## Tasks

- [ ] Task 1: Create auth service (AC: 1, 2)
  - [ ] Setup service file
  - [ ] Implement login method
  - [x] Write unit tests ← Completed
- [x] Task 2: Add validation (AC: 3) ← Completed
```

---

## 9. Skill Integration

### 9.1 What are Skills?

Skills là các specialized AI prompts cung cấp expertise cho các domain cụ thể.

### 9.2 Skill Discovery

Skills được tìm trong các folders:
- `Skills/` - Main skills folder
- `.claude/skills/` - Claude Code standard path

### 9.3 Using Skills

#### In Executor Agent

```bash
*use-skill test-driven-development
*use-skill systematic-debugging
*use-skill react-best-practices
```

#### Common Skills

| Skill | Use When |
|-------|----------|
| `@test-driven-development` | Writing new features with clear AC |
| `@systematic-debugging` | Debugging issues |
| `@senior-fullstack` | Full-stack development |
| `@react-best-practices` | React/frontend work |
| `@api-design-principles` | API design |

### 9.4 Skill Suggestions in Stories

Stories include suggested skills based on task types:

```markdown
## Suggested Skills

- **@test-driven-development** - TDD approach
  - Use when: Writing new features
  - Benefit: Ensures AC are met with tests

- **@react-best-practices** - React patterns
  - Use when: Frontend components
  - Benefit: Follow established patterns
```

---

## 10. Checklists

### 10.1 Planning Checklist

**File:** `.bmad-lite/checklists/planning-checklist.md`
**Command:** `*planning-checklist`

**Validates:**
- PRD: Goals, requirements, tech assumptions, epics, stories
- Architecture: Tech stack, data models, API, security
- Cross-document alignment

### 10.2 Done Checklist

**File:** `.bmad-lite/checklists/done-checklist.md`
**Command:** `*done-checklist`

**Validates:**
- All AC met
- All tasks completed
- Code quality
- Test coverage
- Documentation updated
- Build passes

---

## 11. Best Practices

### 11.1 Planning Phase

✅ **DO:**
- Start with clear project goals
- Use tech-preferences.md for consistency
- Review Epic List before details
- Keep stories sized for 2-4 hours

❌ **DON'T:**
- Skip Technical Assumptions section
- Create epics without user value
- Make stories too large or too small

### 11.2 Execution Phase

✅ **DO:**
- Always check story status before developing
- Use skills when appropriate
- Update checkboxes as you complete tasks
- Maintain File List accuracy

❌ **DON'T:**
- Develop on Draft stories
- Skip writing tests
- Modify AC or Story statement
- Forget to update Dev Record

### 11.3 Review Phase

✅ **DO:**
- Review security-related stories
- Use quick-review for simple changes
- Provide actionable feedback

❌ **DON'T:**
- Block unnecessarily
- Skip review for risky changes

### 11.4 Story Sizing

| Size | Time | Example |
|------|------|---------|
| Too small | < 1 hour | "Add a button" |
| **Just right** | **2-4 hours** | "Implement login form with validation" |
| Too large | > 4 hours | "Build entire auth system" |

### 11.5 Source References

Always include source references in Dev Notes:

```markdown
### Data Models
- User: { id, email, name }
[Source: docs/architecture.md#data-models]
```

---

## 12. Troubleshooting

### Common Issues

#### "Story not found"

```
Problem: Executor can't find story file
Solution: Check .ai/stories/ folder exists and has correct naming
```

#### "PRD not found"

```
Problem: Architecture creation fails
Solution: Create PRD first with /bmad-plan prd
```

#### "Skills not loading"

```
Problem: use-skill command doesn't work
Solution: Check Skills/ folder exists and has SKILL.md files
```

#### "Tasks not updating"

```
Problem: Checkboxes not being marked
Solution: Ensure you're updating the story file, not just implementing
```

### Reset Story Status

If story gets stuck:

1. Open `.ai/stories/{epic}.{story}.md`
2. Change `**Status:**` to desired status
3. Continue with `/bmad-execute develop`

### Re-run Checklist

```bash
*planning-checklist  # In planner
*done-checklist      # In executor
```

---

## 13. Comparison with BMAD Full

| Aspect | BMAD Full | BMAD-Lite |
|--------|-----------|-----------|
| **Agents** | 10 specialized | 3 unified |
| **Templates** | 12 templates | 4 core templates |
| **Workflows** | 6 workflow files | 1 unified workflow |
| **Checklists** | 6 checklists | 2 essential checklists |
| **Doc Strictness** | Very strict, section-by-section | Flexible, pre-populate |
| **Skill Integration** | None | Built-in |
| **Learning Curve** | High | Low |
| **Best For** | Large teams, enterprise | Solo/small teams, MVPs |

### When to Use BMAD-Lite

✅ Use BMAD-Lite when:
- Solo developer or small team
- Building MVP or prototype
- Want quick start with structure
- Need skill integration

✅ Use BMAD Full when:
- Large team with specialized roles
- Enterprise projects
- Need strict documentation
- Regulatory requirements

---

## Quick Reference Card

```
╔════════════════════════════════════════════════════════════╗
║                    BMAD-Lite Quick Reference               ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  PLANNING                                                  ║
║  ─────────                                                 ║
║  /bmad-plan prd              Create PRD document           ║
║  /bmad-plan arch             Create Architecture           ║
║  /bmad-plan epic             Create epic files             ║
║  /bmad-plan validate         Run planning checklist        ║
║                                                            ║
║  EXECUTION                                                 ║
║  ─────────                                                 ║
║  /bmad-execute draft         Draft next story              ║
║  /bmad-execute develop       Implement story               ║
║  /bmad-execute done          Validate completion           ║
║  /bmad-execute use-skill     Use specific skill            ║
║                                                            ║
║  REVIEW (Optional)                                         ║
║  ────────────────                                          ║
║  /bmad-review story {id}     Full review                   ║
║  /bmad-review quick {id}     Quick review                  ║
║                                                            ║
║  DOCUMENT MANAGEMENT (Post-MVP)                            ║
║  ─────────────────────────────                             ║
║  /bmad-refactor docs         Keep docs lean                ║
║  /bmad-sync epic             Add new epic                  ║
║  /bmad-sync story            Add new story to epic         ║
║  /bmad-sync all              Full sync check               ║
║                                                            ║
║  TRACKING                                                  ║
║  ────────                                                  ║
║  /bmad-status                Project progress              ║
║  /bmad-status story {id}     Story details                 ║
║                                                            ║
║  STORY STATUS FLOW                                         ║
║  ─────────────────                                         ║
║  Draft → Approved → InProgress → Review → Done             ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Support

- **Issues:** Report at repository issues
- **BMAD Full:** See `BMAD/.bmad-core/` for full version
- **Skills:** Check `Skills/` folder for available skills

---

*BMAD-Lite - Simplified AI-Driven Development*
