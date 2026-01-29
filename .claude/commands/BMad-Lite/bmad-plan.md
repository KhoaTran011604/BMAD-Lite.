# /bmad-plan - BMAD-Lite Planning Command

Invoke the Planner agent for strategic planning tasks.

---

## Usage

```
/bmad-plan [action]
```

**Actions:**
- `prd` - Create PRD document
- `arch` or `architecture` - Create Architecture document
- `epic` - Create epic files
- `brainstorm` - Start brainstorming session
- `validate` - Run planning checklist
- (no action) - Show planner help

---

## Activation

Load and activate the Planner agent:
1. Read `.bmad-lite/agents/planner.md`
2. Follow activation instructions in the agent file
3. Load `.bmad-lite/config.yaml` for project settings

---

## Agent: Planner

**Role:** Strategic Planner & Solution Architect
**Combines:** Product Manager + Architect

**Core Capabilities:**
- Create PRD with pre-populate approach (less strict)
- Create Architecture documents
- Plan epics and stories
- Validate planning artifacts

**Approach:**
- Pre-populate sections with educated guesses
- Present complete sections for validation
- Focus elicitation on critical decisions only
- Accept "good enough" documentation

---

## Quick Commands

After activation, use these commands with `*` prefix:

- `*create-prd` - Create PRD document
- `*create-architecture` - Create Architecture document
- `*create-epic` - Create epic file
- `*brainstorm` - Start brainstorming
- `*planning-checklist` - Validate artifacts
- `*help` - Show all commands
- `*exit` - Exit planner mode

---

## Example Session

```
User: /bmad-plan prd

Planner: Hello! I'm the Planner agent. Let me create a PRD for your project.

First, tell me about your project...

[Pre-populates sections based on description]

Here's the draft PRD. Please review the following critical sections:
1. Technical Assumptions
2. Epic List

What changes would you like to make?
```
