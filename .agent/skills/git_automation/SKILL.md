# Git Automation Skill (ConciliAI)

## Description
This skill automates the process of staging, committing, and pushing important changes to GitHub. It ensures that "definitive" updates (SaaS structure, security patches, new features) are tracked immediately.

## Usage Guidelines
- **Automatic Triggers**: After completing a major task in `task.md` or updating `walkthrough.md`, the assistant should suggest or execute a "Definitive Update" push.
- **Commit Convention**: Use Conventional Commits (`feat:`, `fix:`, `refactor:`, `build:`).
- **Branch Management**: Always push to `main` for production-ready SaaS updates.

## Automation Script Requirements
The environment must have `git` installed and configured with appropriate credentials (personal access tokens or SSH).

## Commands
```powershell
# Standard Definitive Push
git add .
git commit -m "feat: [Feature Name] - Definitive SaaS Update"
git push origin main
```
