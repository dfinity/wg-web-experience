# Contributing

Thank you for your interest in contributing to the the Web Experience Working
Group (WG) for the Internet Computer Protocol (ICP). By participating in this
project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md).

As a member of the community, you are invited and encouraged to contribute by
submitting issues, offering suggestions for improvements, adding review comments
to existing pull requests, or creating new pull requests to fix issues.

All contributions to DFINITY documentation and the developer community are
respected and appreciated. Your participation is an important factor in the
success of the Internet Computer.

## Prerequisites

Before contributing, please take a few minutes to review these contributor
guidelines. The contributor guidelines are intended to make the contribution
process easy and effective for everyone involved in addressing your issue,
assessing changes, and finalizing your pull requests.

- If you're new to GitHub or open-source contributions, explore resources like
  [First Contributions](https://github.com/firstcontributions/first-contributions)
  or
  [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).
- To contribute effectively, we recommend having a strong foundation in web
  development, followed by familiarity with ICP development.
- If you're new to ICP, explore the
  [ICP Documentation](https://internetcomputer.org/docs) and start experimenting
  with your own projects!

## Communication

Join our OpenChat community to engage in real-time discussions and updates:
[Invite Link](https://oc.app/community/oha52-3aaaa-aaaac-a3vaa-cai/?ref=4y2h7-aaaaa-aaaaf-ahhca-cai).

For notifications and announcements, we use the following channels:

1. **DFINITY Forum**: We have a dedicated thread on the [DFINITY Forum](#).
2. **Discord**: We have a dedicated channel on the [DFINITY Discord](#).

## Processes

The Web Experience Working Group follows structured processes to ensure
effective collaboration and impactful outcomes.

### Participating Member Onboarding

- Interested individuals can join as passive participants by engaging in
  discussions on our communication channels.
- To become a core team member, submit a request to the chairs detailing your
  contributions, expertise, and areas of interest.

### Core Team Member Onboarding

- New core team members will be introduced during a working group meeting.
- They will receive access to relevant repositories and resources to begin
  contributing actively.

### Sub Group Formation

- Members can propose sub groups to tackle specific challenges or topics by
  defining clear goals, scope, and expected outcomes.
- Sub groups are temporary and will conclude once their objectives are met or as
  decided by the chairs.

## Reporting an issue

To open a new issue:

1. Click
   [create a new issue](https://github.com/dfinity/icp-js-sdk-docs/issues/new).
2. Type a title and description, then click **Submit new issue**.
   - Be as clear and descriptive as possible.
   - For any problem, describe it in detail, including details about the crate,
     the version of the code you are using, the results you expected, and how
     the actual results differed from your expectations.

## Submitting a pull request

If you want to submit a pull request to fix an issue or add a feature, here's a
summary of what you need to do:

### Forking the repository

1. Make sure you have a GitHub account, an internet connection, and access to a
   terminal shell or GitHub Desktop application for running commands.
2. Navigate to the
   [repository's homepage](https://github.com/dfinity/icp-js-sdk-docs) in a web
   browser.
3. Click **Fork** to create a copy of the repository under your GitHub account
   or organization name.
4. Clone the forked repository to your local machine.
   ```shell
   git clone "https://github.com/$YOUR_USERNAME/icp-js-sdk-docs.git"
   ```
5. Change into the directory of the cloned repository:
   ```shell
   cd icp-js-sdk-docs
   ```
6. Create a new branch for your fix by running a command similar to the
   following:
   ```shell
   git checkout -b $YOUR_BRANCH_NAME
   ```

### Install dependencies

1. Install [Deno](https://docs.deno.com/runtime/#quick-install).
   ```bash
   curl -fsSL "https://deno.land/install.sh" | sh
   ```
2. Install Deno dependencies:
   ```bash
   deno i
   ```

### Making a pull request

3. Open the file you want to fix in a text editor and make the appropriate
   changes for the issue you are trying to address.
4. Add the file contents of the changed files to the index `git` uses to manage
   the state of the project by running a command similar to the following:
   ```shell
   git add $PATH_TO_CHANGED_FILE
   ```
5. Make sure to have
   [Commitizen](https://commitizen-tools.github.io/commitizen/#installation)
   installed.
6. Commit your changes to store the contents you added to the index along with a
   descriptive message by running the following:
   ```shell
   cz commit
   ```
7. Push the changes to the remote repository by running a command similar to the
   following:
   ```shell
   git push origin $YOUR_BRANCH_NAME
   ```
8. Create a new pull request (PR) for the branch you pushed to the upstream
   GitHub repository.
   - The PR title should be auto-populated based on your commit message.
   - Provide a PR message that includes a short description of the changes made.
9. Wait for the pull request to be reviewed.
10. Make changes to the pull request, if requested. When making subsequent
    commits, you no longer need to follow conventional commits. Only the first
    commit message will be used.
11. Celebrate your success after your pull request is merged!

## Reference Documentation

In the `refs` directory of the repository, you will find some reference
materials that have been mirrored in this repository for easy access by local AI
agents. These files can be referenced in prompts to provide additional context
when necessary.

This documentation can be updated by running the following command:

```bash
deno task update-refs
```
