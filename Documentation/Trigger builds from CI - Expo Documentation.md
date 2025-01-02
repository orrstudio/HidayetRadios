Learn how to trigger builds on EAS for your app from a CI environment such as GitHub Action and more.

___

This document outlines how to trigger builds on EAS for your app from a CI environment such as GitHub Actions, Travis CI, and more.

## Prerequisites[](https://docs.expo.dev/eas-workflows/get-started/#prerequisites)

### Run a successful build from your local machine[](https://docs.expo.dev/eas-workflows/get-started/#run-a-successful-build-from-your-local-machine)

To trigger EAS builds from a CI environment, your app needs to be set up to use EAS Build in non-interactive mode. To do this, go through the EAS Build initialization steps and run a successful build from your local terminal for each platform you would like to support on CI. This way, the `eas build` command can prompt for any additional configuration it needs, and then that configuration will be available for future non-interactive runs on CI.

Running a build locally will accomplish the following critical configuration steps:

-   Initialize the project on EAS by generating a `projectId`.
-   Add an eas.json file defining your build profiles.
-   Populates critical app config properties for native builds, such as `android.packageName` and `ios.bundleIdentifier`.
-   Ensure build credentials are created, including Android keystores and iOS distribution certs and provisioning profiles.

Run `eas build -p [all|android|ios]` and verify that your builds for each platform complete successfully. Then, continue with the below steps for implementing EAS Build on CI.

If you haven't done this yet, see the [Create your first build](https://docs.expo.dev/build/setup/) guide and return here when you're ready.

## Configure your app for CI[](https://docs.expo.dev/eas-workflows/get-started/#configure-your-app-for-ci)

### Provide a personal access token to authenticate with your Expo account on CI[](https://docs.expo.dev/eas-workflows/get-started/#provide-a-personal-access-token-to-authenticate-with-your-expo-account-on-ci)

Next, we need to ensure that we can authenticate ourselves on CI as the owner of the app. This is possible by storing a personal access token in the `EXPO_TOKEN` environment variable in the CI settings.

See [personal access tokens](https://docs.expo.dev/accounts/programmatic-access/#personal-access-tokens) to learn how to create access tokens.

### (Optional) Provide an ASC API Token for your Apple Team[](https://docs.expo.dev/eas-workflows/get-started/#optional-provide-an-asc-api-token-for-your-apple-team)

In the event your iOS credentials need to be repaired, we will need an ASC API key to authenticate ourselves to Apple in CI. A common case is when your provisioning profile needs to be re-signed.

You will need to create an [API Key](https://expo.fyi/creating-asc-api-key). Next, you will need to gather information about your [Apple Team](https://expo.fyi/apple-team).

Using the information you've gathered, pass it into the build command through environment variables. You will need to pass the following:

-   `EXPO_ASC_API_KEY_PATH`: The path to your ASC API Key .p8 file. For example, /path/to/key/AuthKey\_SFB993FB5F.p8.
-   `EXPO_ASC_KEY_ID`: The key ID of your ASC API Key. For example, `SFB993FB5F`.
-   `EXPO_ASC_ISSUER_ID`: The issuer ID of your ASC API Key. For example, `f9675cff-f45d-4116-bd2c-2372142cee09`.
-   `EXPO_APPLE_TEAM_ID`: Your Apple Team ID. For example, `77KQ969CHE`.
-   `EXPO_APPLE_TEAM_TYPE`: Your Apple Team Type. Valid types are `IN_HOUSE`, `COMPANY_OR_ORGANIZATION`, or `INDIVIDUAL`.

### Trigger new builds[](https://docs.expo.dev/eas-workflows/get-started/#trigger-new-builds)

Now that we're authenticated with Expo CLI, we can create the build step.

To trigger new builds, we will add this script to our configuration:

`-` `npx eas-cli build --platform all --non-interactive --no-wait`

This will trigger a new build on EAS. A URL will be printed, linking to the build's progress in the EAS dashboard.

> The `--no-wait` flag exits the step once the build has been triggered. You are not billed for CI execution time while EAS performs the build. However, your CI will report that the build job is passing only if triggering EAS Build is successful.

Travis CI[](https://docs.expo.dev/eas-workflows/get-started/#travis-ci)

Add the following code snippet in .travis.yml at the root of your project repository.

```
language: node_js
node_js:
  - node
  - lts/*
cache:
  directories:
    - ~/.npm
before_script:
  - npm install -g npm@latest

jobs:
  include:
    - stage: build
      node_js: lts/*
      script:
        - npm ci
        - npx eas-cli build --platform all --non-interactive --no-wait
```
GitLab CI[](https://docs.expo.dev/eas-workflows/get-started/#gitlab-ci)

Add the following code snippet in .gitlab-ci.yml at the root of your project repository.

```
image: node:alpine

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - .npm
    # or with yarn:
    #- .yarn

stages:
  - build

before_script:
  - npm ci --cache .npm
  # or with yarn:
  #- yarn install --cache-folder .yarn

eas-build:
  stage: build
  script:
    - apk add --no-cache bash
    - npx eas-cli build --platform all --non-interactive --no-wait
```
Bitbucket Pipelines[](https://docs.expo.dev/eas-workflows/get-started/#bitbucket-pipelines)

Add the following code snippet in bitbucket-pipelines.yml at the root of your project repository.

```
image: node:alpine

definitions:
  caches:
    npm: ~/.npm

pipelines:
  default:
    - step:
        name: Build app
        deployment: test
        caches:
          - npm
        script:
          - apk add --no-cache bash
          - npm ci
          - npx eas-cli build --platform all --non-interactive --no-wait
```
CircleCI[](https://docs.expo.dev/eas-workflows/get-started/#circleci)

Add the following code snippet in circleci/config.yml at the root of your project repository.

```
version: 2.1

executors:
  default:
    docker:
      - image: cimg/node:lts
    working_directory: ~/my-app

jobs:
  eas_build:
    executor: default
    steps:
      - checkout
      - run:
          name: Install dependencies
          command: npm ci
      - run:
          name: Trigger build
          command: npx eas-cli build --platform all --non-interactive --no-wait

workflows:
  build_app:
    jobs:
      - eas_build:
          filters:
            branches:
              only: master
```
GitHub Actions[](https://docs.expo.dev/eas-workflows/get-started/#github-actions)

Add the following code snippet in .github/workflows/eas-build.yml at the root of your project repository.

.github/workflows/eas-build.yml

```
name: EAS Build
on:
  workflow_dispatch:
  push:
    branches:
      - main
jobs:
  build:
    name: Install and build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18.x
          cache: npm
      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Install dependencies
        run: npm ci
      - name: Build on EAS
        run: eas build --platform all --non-interactive --no-wait
```