Learn how to control the flow of EAS Workflows with conditions that run certain jobs based on the result of previous jobs.

___

You can control the flow of your workflows with conditions that run certain jobs based on the result of previous jobs.

## `needs`[](https://docs.expo.dev/eas-workflows/get-started/#needs)

You can add a list of previous job names using the `needs` keyword on a job. If any job from that list fails, the current job will be failed, and if any job from the list is skipped, the current job will be skipped as well.

.eas/workflows/prerequisite.yaml

```
jobs:
  build:
    type: build
    params:
      platform: ios
      profile: production
  end-to-end-test:
    needs: [build]
    type: maestro
    params:
      build_id: ${{ jobs.build.outputs.build_id }}
      flow_path: ['./e2e/flow.yaml']
```

## `after`[](https://docs.expo.dev/eas-workflows/get-started/#after)

You can add a list of previous job names using the `after` keyword on a job. Any job in the list will run after the current job completes, no matter if it succeeded or failed.

.eas/workflows/after.yaml

```
jobs:
  build:
    type: build
    params:
      platform: ios
      profile: production
  send_slack_notification:
    after: [build]
    steps:
      - name: Send Slack notification
        inputs:
          message: 'Build completed.'
          slack_hook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## `if`[](https://docs.expo.dev/eas-workflows/get-started/#if)

You can add a condition to a job with the `if` keyword. If the condition evaluates to `true`, the job will run. Otherwise, it will be skipped.

.eas/workflows/conditional.yaml

```
on:
push: {} # runs on all branches

jobs:
  update:
    type: update
  build:
    name: Build iOS
    type: build
    if: ${{ github.ref == "refs/heads/main" }} # Will only run if on main.
    params:
      profile: production
      platform: ios
```

## Combining conditions[](https://docs.expo.dev/eas-workflows/get-started/#combining-conditions)

You can use both `needs` and `if` conditions in the same job definition. Note that the job will be run if all jobs on the `needs` list are successful and the `if` condition is true. If any job on the `needs` list has been skipped or the `if` condition is false, the current job will be skipped. If any job on the `needs` list has failed, the current job will be failed.