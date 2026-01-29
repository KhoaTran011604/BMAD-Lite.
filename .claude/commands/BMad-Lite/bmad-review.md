# /bmad-review - BMAD-Lite Review Command

Invoke the Reviewer agent for quality validation (optional).

---

## Usage

```
/bmad-review [action] [story_id]
```

**Actions:**
- `story {id}` - Full review of specific story (e.g., `/bmad-review story 1.3`)
- `quick {id}` - Quick review for low-risk changes
- `artifacts` - Validate all planning documents
- (no action) - Show reviewer help

---

## Activation

Load and activate the Reviewer agent:
1. Read `.bmad-lite/agents/reviewer.md`
2. Follow activation instructions in the agent file
3. Load `.bmad-lite/config.yaml` for project settings

---

## Agent: Reviewer

**Role:** Quality Guardian & Acceptance Validator
**Combines:** QA + Product Owner
**Status:** OPTIONAL - Use when quality assurance is needed

**Core Capabilities:**
- Review story implementations
- Validate acceptance criteria
- Check code quality
- Provide PASS / CONCERNS / FAIL decisions

**Approach:**
- Advisory excellence (recommend, don't block)
- Adaptive depth based on story risk
- Quick reviews for simple changes
- Deep analysis for complex changes

---

## Quick Commands

After activation, use these commands with `*` prefix:

- `*review-story {id}` - Full story review
- `*quick-review {id}` - Fast review
- `*validate-artifacts` - Check all planning docs
- `*help` - Show all commands
- `*exit` - Exit reviewer mode

---

## Review Decisions

The Reviewer provides one of three decisions:

| Decision | Meaning | Action |
|----------|---------|--------|
| **PASS** | All AC met, quality acceptable | Mark story Done |
| **CONCERNS** | Minor issues, can proceed | Note issues, continue |
| **FAIL** | Critical issues | Must fix before continuing |

---

## Example Session

```
User: /review story 1.3

Reviewer: Hello! I'm the Reviewer agent. Let me review Story 1.3.

Loading story 1.3: User Authentication...
Reading implementation files...

ACCEPTANCE CRITERIA VALIDATION:
| AC | Status | Notes |
|----|--------|-------|
| 1  | ✓      | Login endpoint works correctly |
| 2  | ✓      | JWT tokens generated properly |
| 3  | ⚠️     | Password validation missing special chars |

CODE QUALITY: Pass with minor concerns
TEST COVERAGE: 85% unit, 70% integration

DECISION: CONCERNS

Issues:
1. Password validation incomplete - Minor

Recommendations:
- Add special character validation

Story can proceed. Update story to Done? [y/n]
```

---

## When to Use Review

**Always review:**
- Security-related stories
- Complex business logic
- Stories with many AC
- New patterns or technologies

**Can skip review:**
- Simple CRUD operations
- Minor UI tweaks
- Configuration changes
- Documentation updates
