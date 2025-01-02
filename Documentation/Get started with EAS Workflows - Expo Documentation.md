Learn how to use EAS Workflows to automate your development and release processes.

___

> EAS Workflows are currently in preview. We may introduce breaking changes in the coming weeks. Got feedback? Send us an email at [workflows@expo.dev](mailto:workflows@expo.dev).

Builds, submissions, updates, and more are all a part of delivering your app to users. EAS Workflows consist of a sequence of jobs, which help you and your team get things done. With workflows, you can build your project, run end-to-end tests, submit that build to the app stores, and then run custom scripts after the submission is complete. Since each job can have prerequisites and conditionals, you can automate your and your team's release process.

How do workflows compare to other CI services?[](https://docs.expo.dev/eas-workflows/get-started/#how-do-workflows-compare-to-other-ci)

EAS Workflows are designed to help you and your team release your app. It comes preconfigured with pre-packaged job types that can build, submit, update, run Maestro tests, and more. All job types run on EAS, so you'll only have to manage one set of YAML files, and all the artifacts from your job runs will appear on [expo.dev](https://expo.dev/).

Other CI services, like CircleCI and GitHub Actions, are more generalized and have the ability to do more than workflows. However, those services also require you to understand more about the implementation of each job. While that is necessary in some cases, workflows help you get common tasks done quickly by pre-packaging the most essential types of jobs for app developers. In addition, workflows are designed to provide you with the fastest possible cloud machine for the task at hand, and we're constantly updating those for you.

EAS Workflows are great for operations related to your Expo apps, while other CICD services will provide a better experience for other types of workflows.

## Set up your project[](https://docs.expo.dev/eas-workflows/get-started/#set-up-your-project)

If you haven't already, you'll need to create a project and sync it with EAS:

Create a project and sync it with EAS[](https://docs.expo.dev/eas-workflows/get-started/#create-a-project-and-sync-it-with)

You can create a new project with the following command:

`-` `npx create-expo-app@latest`

Once you've created the project, login with your account:

`-` `npx eas-cli@latest login`

Finally, link the project you have locally with EAS:

`-` `npx eas-cli@latest init`

Then, create a directory named .eas/workflows at the root of your project with a .yaml file inside of it. For example: .eas/workflows/hello-world.yaml.

## Write a workflow[](https://docs.expo.dev/eas-workflows/get-started/#write-a-workflow)

Each workflow consists of three top-level elements:

-   `name`: defines the name of the workflow. For example: "Hello World"
-   `on`: defines when this workflow should be triggered. For example, when pushing a new commit to a GitHub branch.
-   `jobs`: a sequence of jobs which can depend on and pass data between each other. For example: a job that runs a unit test followed by a job that builds your project into an app.

Here's an example of a workflow that prints "Hello, world":

.eas/workflows/hello-world.yaml

```
name: Hello World

on:
  push:
    branches: ['*']

jobs:
  Hello World:
    steps:
      - run: echo "Hello, World"
```

Here's another example that creates and submits an iOS build of a project on every push to every branch. This is similar to running `eas build --platform ios --profile production --auto-submit`:

.eas/workflows/ios-build-and-submit.yaml

```
name: Release iOS app

on:
  push:
    branches: ['*']

jobs:
  build:
    type: build
    params:
      platform: ios
      profile: production
  submit:
    needs: [build]
    type: submit
    params:
      build_id: ${{ needs.build.outputs.build_id }}
```

## Configure your project[](https://docs.expo.dev/eas-workflows/get-started/#configure-your-project)

To enable workflows to run on events from GitHub, you'll need to install Expo's GitHub app and connect it to your project:

-   Navigate to your project's [GitHub settings](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/github)
-   Follow the UI to install the GitHub app. Then search for the GitHub repository that matches the Expo project and connect it.

## Run your workflow[](https://docs.expo.dev/eas-workflows/get-started/#run-your-workflow)

Once you have a workflow file and your project is connected to Expo's GitHub app, you can trigger your workflow by pushing a commit to your GitHub repository. For the workflow to run, you'll need to make sure the trigger (defined with `on`) you defined in your workflow is met.

Alternatively, you can trigger a workflow manually by running the following command:

`-` `npx eas-cli@latest workflow:run .eas/workflows/<your-workflow-file>.yaml`

Once you do, you can see your workflow running on your project's [workflows page](https://expo.dev/accounts/%5Baccount%5D/projects/%5BprojectName%5D/workflows).

## Building blocks[](https://docs.expo.dev/eas-workflows/get-started/#building-blocks)

Learn more about the building blocks of workflows:

[

Triggers

Learn how to trigger workflows.

](https://docs.expo.dev/eas-workflows/triggers)[

Jobs

Learn which pre-packaged and custom jobs you can run with EAS Workflows.

](https://docs.expo.dev/eas-workflows/jobs)[

Control flow

Learn how to control the flow of your workflows with conditions that run certain jobs based on the result of previous jobs.

](https://docs.expo.dev/eas-workflows/control-flow)[

Variables

Learn how to use variables in your workflows.

](https://docs.expo.dev/eas-workflows/variables)