## Git Workflow and versioning

### Motivation

We aim to have a Git workflow in which we balance:

- Developer development speed: Developers should be able to integrate their changes as soon as they're done.
- Security and Stability: Code sent into the stable branch needs to be tested through automated pipelines, thoroughly tested and manually integrated.
- Based on standards: We aim to use standards when they make sense, in that way we avoid reinventing the wheel. And, have access to many tools that allow us to automate our work.

### Commit standards

The project follows the [Conventional Commits standard](https://www.conventionalcommits.org/en/v1.0.0/). However, we use a limited amount of scopes:feat, fix, chore, refactor, hotfix.\
Scopes

From the standard:

A scope MAY be provided after a type. A scope MUST consist of a noun describing a section of the codebase surrounded by parenthesis

Generally speaking, when a scope is provided in a commit, it must be the project/module/library/folder where you are working on mainly.

**Good:** fix(manage-panel), chore(ag-grid), docs(manage-monitor) etc.

**Bad:** refactor(all-the-projects), feat(BACK-xxxx)

### Commit description

The commit description, before merging the PR, should follow the [Keep a changelog standard](https://keepachangelog.com/en/1.0.0/).

But instead of the version for the description title, we should use the clickup

### Documenting breaking changes and new features

A section ### How to migrate should be introduced in order to provide easy instruction for the frontend.

For example:

```
### How to migrate

- Change the parameter of the ManageUser_someQuery() from userId to ID
- Rename the mutation ManageMonitor_someMutation to ManageMonitor_someBetterMutation
```

## Versioning

Our versioning standard is composed by 2 parts: the **product version** and the **release candidate version**.

This is the format: **MAJOR.MINOR.PATCH-rcRELEASE.BUILD**

For instance: **3.0.0-rc1.10** where **3.0.0** is the product version and **-rc1.10** is the release candidate version.

The product version changes manually only when we achieve an important milestone.

NOTE: the major version should not change unless we have to identify different products.

The release-candidate part instead (-rc) changes automatically by using the `gh-version-bump` action available in our github workflows. Everytime we merge a new PR the **rc** version should change as well.

This workflow is triggered by the `pr-version-bump` that will run a `npm version prerelease --preid=rcX` internally. (More info about the [npm-version command here](https://docs.npmjs.com/cli/v7/commands/npm-version))

This workflow will also automatically generate a changelog based on the PR description.

## Git Flow

![git-flow](https://docs.google.com/drawings/d/e/2PACX-1vR97luOtWUkgrviLD2V9EMWHoykX9U_RjTWuCnW4NBxrrHgdHBsm7N4vNl4B3jvtlS7ciqReE0A3Qkz/pub?w=960&h=720)

1.  Branch out from dev

Dev is the semi-stable branch, so all of the changes we do, are against it. In the same way this is the branch you should always branch out from.

2.  Code Review: :

Always create a PR starting from the dev branch

3.  Code Merging

When your Pull Request is approved by the reviewers, your code was functionally checked and the pipelines pass, that means that your code is ready to be merged.

It's important to run the version bump, by using one of the available label (e.g. `pr-version-bump`), before merging a PR in order to update the version and the CHANGELOG file. Check the `gh-version-bump.yml` workflow for more info.

Use squash and merge method to merge a PR into the dev branch and set the title and the description by following the same standard you used when creating the Pull Request.

Once this is done, your code will be merged into the Dev semi-stable branch. Congrats.

4.  Code Integration into the master stable branch

Although your work is done, there's still another step that should happen at a later moment, the code integration.

This new version will be merged to master and deployed into our remote environments.

This merges are always done with the fast-forward flag to keep the same history on master and dev

## Synchronize master with dev

The syncronization of the master branch with the dev branch is done by a github workflow that creates a PR automatically (`sync: dev to master`).
This PR **must** be merged into the master branch by using the action triggered by the `merge-ff` label. This ensure us that the merge is always fast forwarded.

NOTE: the PR can't be merged without the right amount of approvals.

5.  Hotfixes on master branch

Although in rare situations, critical issues might be found in the production application and require proactive attention from the team (otherwise undesired situations might happen, i.e profit loss or churns).

In such situations, you have to create a PR directly on the master branch and upgrade the semver with (in most of the cases by updating the "patch" number).

Once the commit is on the master branch, you have to move it upwards to the dev branch by merging the master into the dev branch.
