Learn which triggers are available to work with EAS Workflows.

___

Triggers define when a workflow should kick off. When its conditions are met, the workflow will start.

## On push[](https://docs.expo.dev/eas-workflows/get-started/#on-push)

You can trigger a workflow on a push to a GitHub branch with the `push` trigger.

.eas/workflows/hello-world.yaml

```
name: Hello World

on:
  push:
  branches:
    - 'main'
    - 'feature/**'
    # other branches names and globs

jobs:
  # ...
```

## On pull request[](https://docs.expo.dev/eas-workflows/get-started/#on-pull-request)

You can trigger a workflow on a pull request with the `pull_request` trigger.

.eas/workflows/hello-world.yaml

```
name: Hello World

on:
  pull_request:
  branches:
  - 'main'
  # other branch names and globs

jobs:
  # ...
```

## More[](https://docs.expo.dev/eas-workflows/get-started/#more)

EAS Workflows also support triggering on all branches, on both push and pull request events:

.eas/workflows/hello-world.yaml

```
name: Hello World

on:
push: {} # this will default to `branches: ['*']`, meaning "run on all branches"
pull_request: {}

jobs:
  # ...
```