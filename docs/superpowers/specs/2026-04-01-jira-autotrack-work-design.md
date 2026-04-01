# Jira Autotrack Work Skill Design

## Overview

Create a global Codex skill named `jira-autotrack-work` that uses the Jira MCP integration to keep Jira synchronized with work discovered during a session. The skill should automatically create Jira issues for actionable work, reuse existing issues when they already represent the same work, and move related issues to `Done` when the session provides enough evidence that the work is complete.

The skill is intended to reduce manual Jira bookkeeping while avoiding noisy ticket spam or unsafe workflow transitions.

## Goals

- Create Jira issues automatically for actionable features, ideas, fixes, follow-up work, and technical improvements discovered during execution.
- Generate a short, self-explanatory issue title and a useful description without requiring manual prompting.
- Use Jira MCP tools dynamically without hardcoding a single server name or assuming a fixed tool list.
- Reuse existing issues instead of creating obvious duplicates.
- Move related Jira issues to `Done` when they are genuinely resolved during the session.
- Fall back to configured default values when Jira requires fields that cannot be inferred from the session context.

## Non-Goals

- Implement Jira integration outside MCP.
- Guarantee perfect duplicate detection across all Jira history.
- Close issues without evidence that the corresponding work is actually complete.
- Encode organization-specific Jira workflow IDs directly in the skill body.

## Skill Location

Install the skill globally at `C:\Users\pabma\.codex\skills\jira-autotrack-work` so it is auto-discoverable across workspaces.

## Skill Structure

The skill should contain:

- `SKILL.md`
  - Primary workflow and invocation guidance.
  - Rules for when to create, reuse, update, and close Jira issues.
- `agents/openai.yaml`
  - UI-facing metadata and default prompt.
- `references/defaults.yaml`
  - Editable defaults for Jira fields and policy toggles.
- `references/jira-workflow.md`
  - Short operational guidance for issue creation, deduplication, transitions, and failure handling.

No custom scripts are required for the initial version because issue operations are expected to happen through the Jira MCP tools directly.

## Triggering and Scope

The skill should be written so it can trigger when Codex is actively working and discovers any actionable work item that deserves tracking, including:

- New features
- Bug fixes
- Ideas worth follow-up
- Technical debt
- Improvements
- Operational follow-up tasks

The skill should not create issues for trivial ephemeral notes, already completed work that does not need tracking, or purely conversational thoughts with no actionable outcome.

## Creation Workflow

When the skill is active and actionable work is identified, it should follow this flow:

1. Inspect the available Jira MCP tools and choose the relevant read/search/create/update actions.
2. Search for existing issues that may already represent the same work.
3. Reuse an existing issue when there is a clear match.
4. Create a new issue only when the work is actionable and no equivalent issue is found.
5. Store enough session context to revisit the related issue later in the same conversation.

The skill should behave automatically and should not wait for confirmation before creating the issue.

## Issue Title and Description Rules

Each newly created issue must include:

- A short title that is self-explanatory without reading the conversation.
- A description that captures the essential context needed to understand and complete the work.

The title should:

- Start with the core action or outcome.
- Mention the affected area when known.
- Avoid vague placeholders such as "follow up later" or "misc fix".

The description should include, when available:

- What problem, idea, or feature triggered the issue
- Why it matters
- Relevant project or component context
- Expected outcome or acceptance signal
- Notable constraints or follow-up details

## Defaults and Field Resolution

If Jira requires fields such as project key or issue type and they cannot be inferred reliably from the session, the skill should resolve them in this order:

1. Values inferred from the current task or repository context
2. Defaults declared in `references/defaults.yaml`
3. Safe heuristics discovered through Jira MCP metadata, such as a single available project or a standard issue type

The initial defaults file should support at least:

- `project_key`
- `issue_type`
- `done_status`
- `default_labels`
- `dedupe_enabled`
- `auto_close_related`

If required values still cannot be resolved, the skill should not pretend the action succeeded. It should state that Jira automation could not proceed because required fields could not be determined.

## Deduplication Rules

Before creating an issue, the skill should search for similar work using the Jira MCP search capabilities. It should compare:

- Title similarity
- Affected area or component
- Keywords from the current task
- Existing issue descriptions when feasible

The skill should reuse an existing issue when the match is strong enough that creating a new one would be redundant.

The skill should still create a new issue when:

- The work is distinct even if it shares a component
- An earlier issue is too broad to represent the newly discovered work
- The search results are ambiguous and no clear equivalent issue is found

## Automatic Closure Workflow

The skill must also manage issue completion automatically.

When a feature, fix, idea, or improvement is actually completed during the session, the skill should:

1. Re-check Jira for issues related to the completed work.
2. Determine which related issues are now resolved by the completed work.
3. Attempt to transition those issues to the configured `Done` status.

This closure behavior applies both to issues created by the skill and to other existing related Jira issues that the session has genuinely resolved.

## Evidence Required for Closure

The skill should only move an issue to `Done` when there is enough evidence in the session that the issue is complete. Acceptable evidence may include:

- Code or configuration changes implementing the work
- Tests or validation steps that support completion
- A clear user statement that the requested work is done
- A strong match between the completed session outcome and the issue acceptance intent

The skill should not close issues merely because:

- Work started
- Partial progress was made
- A plan was written
- The agent assumes completion without verification

## Jira Workflow Discovery

The skill should not assume a universal Jira transition name or workflow ID. Instead, it should:

- Inspect available transitions for the target issue
- Prefer the configured `done_status` from `references/defaults.yaml`
- Use the matching Jira transition when available

If there is no valid transition to the target done state, or if the user lacks permission, the skill should not fabricate success. It should report that the issue could not be moved and briefly note why.

## MCP Availability and Failure Handling

The skill should depend on the Jira MCP integration being available at runtime, but it must not assume:

- A specific MCP server alias
- A single fixed tool name
- A stable issue schema beyond what the MCP can reveal

If the Jira MCP integration is unavailable, the skill should:

- Avoid claiming Jira was updated
- Explain briefly that the Jira automation step could not be executed
- Continue the main work unless Jira synchronization is itself the primary task

## Initial Configuration

The initial `references/defaults.yaml` should be created with placeholder-safe defaults that the user can edit later. The file should clearly mark the fields intended for customization while still representing a valid default structure.

Example configuration categories:

- Project selection
- Issue typing
- Done-state target
- Default labels
- Auto-close policy
- Deduplication policy

## Validation

After creating the skill, validate it by:

1. Running the skill folder validator from the skill-creator toolkit.
2. Confirming the generated metadata and references match the intended behavior.
3. Forward-testing the skill on at least one realistic prompt where actionable work is discovered and Jira actions are expected.

If forward-testing is not possible because Jira MCP is unavailable in the current environment, record that limitation and still complete structural validation.

## Open Risks

- Duplicate detection may be imperfect if Jira search capabilities are limited.
- Automatic closure of pre-existing issues can be too aggressive if the evidence threshold is set too low.
- Jira workflows with unusual transition rules may require later iteration in the skill wording or defaults.

## Implementation Notes

- Keep the skill instructions concise and operational.
- Prefer dynamic discovery of MCP capabilities over hardcoded assumptions.
- Make the defaults file the main place for user customization.
- Favor safe transparency on failures over silent no-ops or false success claims.
