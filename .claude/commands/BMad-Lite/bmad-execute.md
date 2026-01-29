# /bmad-execute - BMAD-Lite Execution Command

Invoke the Executor agent for development tasks.

---

## Usage

```
/bmad-execute [action]
```

**Actions:**
- `draft` - Draft next story from epic/PRD
- `develop` - Implement current story
- `done` - Validate story completion
- `use-skill {name}` - Use specific skill
- `list-skills` - Show available skills
- (no action) - Show executor help

---

## Activation

Load and activate the Executor agent:
1. Read `.bmad-lite/agents/executor.md`
2. Follow activation instructions in the agent file
3. Load `.bmad-lite/config.yaml` for project settings
4. Load dev context files (coding standards, tech stack, source tree)

---

## Agent: Executor

**Role:** Technical Executor & Implementation Specialist
**Combines:** Scrum Master + Developer

**Core Capabilities:**
- Create stories from epic/PRD
- Implement stories with task tracking
- Integrate with Skills for flexible implementation
- Track progress in `.ai/` folder

**Approach:**
- Stories contain all needed context
- Use skills for specialized tasks
- Update checkboxes and file lists
- Follow develop workflow precisely

---

## Quick Commands

After activation, use these commands with `*` prefix:

- `*draft-story` - Create next story
- `*develop` - Implement current story
- `*run-tests` - Execute tests
- `*done-checklist` - Validate completion
- `*use-skill {name}` - Use specific skill
- `*list-skills` - Show available skills
- `*help` - Show all commands
- `*exit` - Exit executor mode

---

## Skill Integration

The Executor can use skills from `Skills/` folder:

```
*use-skill test-driven-development
*use-skill systematic-debugging
*use-skill react-best-practices
```

Skills provide specialized expertise for implementation.

---

## Example Session

```
User: /execute draft

Executor: Hello! I'm the Executor agent. Let me create the next story.

Checking .ai/stories/... Found stories up to 1.2
Reading Epic 1 from PRD...

Creating Story 1.3: User Authentication

[Creates story with tasks, dev notes, suggested skills]

Status: Draft
Ready for your review and approval.

---

User: Approve and develop

Executor: Story approved. Starting development...

Using skill: @test-driven-development

Task 1: Create authentication service (AC: 1, 2)
[Implements with TDD approach]

✓ Task 1 complete
Moving to Task 2...
```
