# Commit Message Generator

Generate a conventional commit message based on the current staged changes.

## Steps

1. Run `git diff --staged` to see what's staged. If nothing is staged, run `git diff` instead and inform the user.
2. Analyze the changes and generate a commit message following the rules below.
3. Present the message to the user for confirmation before committing.
4. If confirmed, run `git commit -m "<message>"`.

## Commit Message Rules

### Format
```
<type>(<scope>): <subject>
```

- `<scope>` is optional — only include if the change is clearly scoped to one area (e.g., `pdf`, `chat`, `api`)
- No period at the end
- Subject in lowercase, written in imperative mood ("add", "fix", "remove" — not "added" or "adds")

### Types

| Type | When to use |
|------|-------------|
| `feat` | New feature or behavior |
| `fix` | Bug fix |
| `refactor` | Code restructure without behavior change |
| `chore` | Tooling, deps, config — no production code change |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |
| `style` | Formatting, whitespace — no logic change |
| `perf` | Performance improvement |

### Examples from this project

```
feat: add anchor links for page references in MarkdownRenderer
fix: clean up apis and fix chat input bug
refactor(pdf): extract pdf pagination logic into usePdfPagination hook
chore: update react and react-dom to version 19.2.3
```

## Single Responsibility Rule

**One commit = one concern.** This is strictly enforced.

- **Never use "and" in the subject line.** If you feel the urge to write "and", the staged changes should be split into separate commits.
- If the diff touches multiple unrelated concerns (e.g., a bug fix + a new feature + a style change), **stop and tell the user** which files belong to which concern, and ask them to stage each group separately.
- A commit may touch multiple files only if they all serve the same single purpose.

## Notes

- Write in English
- Keep the subject line under 72 characters
- Do NOT auto-commit without user confirmation
