Learn how to create a build for your app with EAS Build.

___

EAS Build allows you to build a ready-to-submit binary of your app for the Google Play Store or Apple App Store. In this guide, let's learn how to do that.

Alternatively, if you prefer to install the app directly to your Android device/emulator or install it in the iOS Simulator, we will point you toward resources that explain how to do that.

For a small app, builds for Android and iOS platforms trigger within a few minutes. If you encounter any issues along the way, you can reach out on [Discord and Forums](https://chat.expo.dev/).

## Prerequisites[](https://docs.expo.dev/build/setup/#prerequisites)

EAS Build is a rapidly evolving service. Before you set out to create a build for your project we recommend consulting the [limitations](https://docs.expo.dev/build-reference/limitations) page and the other prerequisites below.

A React Native Android and/or iOS project that you want to build[](https://docs.expo.dev/build/setup/#a-react-native-android-andor-ios-project)

Don't have a project yet? No problem. It's quick and easy to create a "Hello world" app that you can use with this guide.

Run the following command to create a new project:

`-` `npx create-expo-app my-app`

EAS Build also works well with projects created by `npx create-react-native-app`, `npx react-native`, `ignite-cli`, and other project bootstrapping tools.

An Expo user account[](https://docs.expo.dev/build/setup/#an-expo-user-account)

EAS Build is available to anyone with an Expo account, regardless of whether you pay for EAS or use our Free plan. You can sign up at [https://expo.dev/signup](https://expo.dev/signup).

Paid subscribers get quality improvements such as additional build concurrencies, priority access to minimize the time your builds spend queueing, and increased limits on build timeouts. Learn more about different plans and benefits at [EAS pricing](https://expo.dev/pricing).

1

## Install the latest EAS CLI[](https://docs.expo.dev/build/setup/#install-the-latest-eas-cli)

EAS CLI is the command-line app that you will use to interact with EAS services from your terminal. To install it, run the command:

You can also use the above command to check if a new version of EAS CLI is available. We encourage you to always stay up to date with the latest version.

> We recommend using `npm` instead of `yarn` for global package installations. You may alternatively use `npx eas-cli@latest`. Remember to use that instead of `eas` whenever it's called for in the documentation.

2

## Log in to your Expo account[](https://docs.expo.dev/build/setup/#log-in-to-your-expo-account)

If you are already signed in to an Expo account using Expo CLI, you can skip the steps described in this section. If you are not, run the following command to log in:

You can check whether you are logged in by running `eas whoami`.

4

## Run a build[](https://docs.expo.dev/build/setup/#run-a-build)

### Build for Android Emulator/device or iOS Simulator[](https://docs.expo.dev/build/setup/#build-for-android-emulatordevice-or-ios-simulator)

The easiest way to try out EAS Build is to create a build that you can run on your Android device/emulator or iOS Simulator. It's quicker than uploading it to a store, and you don't need store developer membership accounts. If you'd like to try this, read about [creating an installable APK for Android](https://docs.expo.dev/build-reference/apk) and [creating a simulator build for iOS](https://docs.expo.dev/build-reference/simulators).

### Build for app stores[](https://docs.expo.dev/build/setup/#build-for-app-stores)

Before the build process can start for app stores, you will need to have a store developer account and generate or provide app signing credentials.

Whether you have experience with generating app signing credentials or not, EAS CLI does the heavy lifting. You can opt-in for EAS CLI to handle the app signing credentials process. Check out the steps for [Android app signing credentials](https://docs.expo.dev/build/setup#android-app-signing-credentials) or [iOS app signing credentials](https://docs.expo.dev/build/setup#ios-app-signing-credentials) process below for more information.

Google Play Developer membership is required to distribute to the Google Play Store.[](https://docs.expo.dev/build/setup/#google-play-developer-membership-is-required-to)

You can build and sign your app using EAS Build, but you can't upload it to the Google Play Store unless you have a membership, a one-time $25 USD fee.

Apple Developer Program membership is required to build for the Apple App Store.[](https://docs.expo.dev/build/setup/#apple-developer-program-membership-is-required-to)

If you are going to use EAS Build to create release builds for the Apple App Store, you need access to an account with a $99 USD [Apple Developer Program](https://developer.apple.com/programs) membership.

After you have confirmed that you have a Google Play Store or Apple App Store account and decided whether or not EAS CLI should handle app signing credentials, you can proceed with the following set of commands to build for the platform's store:

`-` `eas build --platform android`

> You can attach a message to the build by passing `--message` to the build command, for example, `eas build --platform ios --message "Some message"`. The message will appear on the website. It comes in handy when you want to leave a note with the purpose of the build for your team.

Alternatively, you can use `--platform all` option to build for Android and iOS at the same time:

`-` `eas build --platform all`

#### Android app signing credentials[](https://docs.expo.dev/build/setup/#android-app-signing-credentials)

-   If you have not yet generated a keystore for your app, you can let EAS CLI take care of that for you by selecting `Generate new keystore`, and then you are done. The keystore is stored securely on EAS servers.
-   If you have previously built your app with `expo build:android`, you can use the same credentials here.
-   If you want to manually generate your keystore, see the [manual Android credentials guide](https://docs.expo.dev/app-signing/local-credentials#android-credentials) for more information.

#### iOS app signing credentials[](https://docs.expo.dev/build/setup/#ios-app-signing-credentials)

-   If you have not generated a provisioning profile and/or distribution certificate yet, you can let EAS CLI take care of that for you by signing into your Apple Developer Program account and following the prompts.
-   If you have already built your app with `expo build:ios`, you can use the same credentials here.
-   If you want to rather manually generate your credentials, refer to the [manual iOS credentials guide](https://docs.expo.dev/app-signing/local-credentials#ios-credentials) for more information.

5

## Wait for the build to complete[](https://docs.expo.dev/build/setup/#wait-for-the-build-to-complete)

By default, the `eas build` command will wait for your build to complete, but you can interrupt it if you prefer not to wait. Monitor the progress and read the logs by following the link to the build details page that EAS CLI prompts once the build process gets started. You can also find this page by visiting [your build dashboard](https://expo.dev/builds) or running the following command:

If you are a member of an organization and your build is on its behalf, you will find the build details on [the build dashboard for that account](https://expo.dev/accounts/%5Baccount%5D/builds).

6

## Deploy the build[](https://docs.expo.dev/build/setup/#deploy-the-build)

If you have made it to this step, congratulations! Depending on which path you chose, you now either have a build that is ready to upload to an app store, or you have a build that you can install directly on an Android device/iOS Simulator.

### Distribute your app to an app store[](https://docs.expo.dev/build/setup/#distribute-your-app-to-an-app-store)

You will only be able to submit to an app store if you built specifically for that purpose. If you created a build for a store, [learn how to submit your app to app stores with EAS Submit](https://docs.expo.dev/submit/introduction).

### Install and run the app[](https://docs.expo.dev/build/setup/#install-and-run-the-app)

You will only be able to install the app directly to your Android device/iOS Simulator if you explicitly built it for that purpose. If you built for app store distribution, you will need to upload to an app store and then install it from there (for example, from Apple's TestFlight app).

To learn how to install the app directly to your Android device/iOS Simulator, navigate to your build details page from [your build dashboard](https://expo.dev/accounts/%5Baccount%5D/builds) and click the "Install" button.

## Next steps[](https://docs.expo.dev/build/setup/#next-steps)

We walked you through the steps to create your first build with EAS Build without going into too much depth on any particular part of the process.

When you are ready to learn more, we recommend proceeding through the Start Building section of this documentation to learn about topics such as:

-   [Configuration with eas.json](https://docs.expo.dev/build/eas-json)
-   [Internal distribution](https://docs.expo.dev/build/internal-distribution)
-   [Updates](https://docs.expo.dev/build/updates)
-   [Automating submissions](https://docs.expo.dev/build/automate-submissions)
-   [Triggering builds from CI](https://docs.expo.dev/build/building-on-ci)

You may also want to dig through the reference section to learn more about the topics that interest you most, such as:

-   [Build webhooks](https://docs.expo.dev/eas/webhooks)
-   [Build server infrastructure](https://docs.expo.dev/build-reference/infrastructure)
-   How the [Android](https://docs.expo.dev/build-reference/android-builds) and [iOS](https://docs.expo.dev/build-reference/ios-builds) build processes work