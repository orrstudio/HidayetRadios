Learn how EAS Build provides shareable URLs for your builds with your team for internal distribution.

___

Uploading your app to TestFlight and Google Play beta can be time-consuming (for example, waiting for the build to run through static analysis before becoming available to testers) and limiting (for example, TestFlight can only have one active build at a time). Both Android and iOS provide alternative mechanisms to distribute apps directly to testers, so they can download and install them to physical devices directly from a web browser as soon as the builds are completed.

EAS Build can help you with this by providing shareable URLs for your builds with instructions on how to get them running, so you can share a single URL with a teammate that'll include all the information they need to test the app.

> Installing an app on iOS is a bit trickier than on Android, but it's possible thanks to ad hoc and enterprise provisioning profiles. We'll talk more about this later in this doc.

## Setting up internal distribution[](https://docs.expo.dev/eas-workflows/get-started/#setting-up-internal-distribution)

The following steps will guide you through adding internal distribution to a project that is [already set up to build with EAS Build](https://docs.expo.dev/build/setup/). It will only take a few minutes in total to:

-   Configure the project
-   Add a couple of test iOS devices to a provisioning profile
-   Start builds for Android and iOS

1

## Configure a build profile[](https://docs.expo.dev/eas-workflows/get-started/#configure-a-build-profile)

Open eas.json in your project. You can use the pre-configured `preview` profile or [create a new one](https://docs.expo.dev/build/eas-json/#build-profiles) for Android or iOS.

```
{
  "build": {
    "preview": {
      "distribution": "internal"
    }
  }
}
```

### Android[](https://docs.expo.dev/eas-workflows/get-started/#android)

Note that if you override the `gradleCommand` on Android, you should ensure that it produces an .apk rather than an .aab, so it is directly installable to an Android device.

### iOS[](https://docs.expo.dev/eas-workflows/get-started/#ios)

The configuration above tells EAS Build that you would like to use ad hoc distribution, which is available for all paid Apple Developer accounts. It is not available for free accounts.

Do you have an Apple Developer Enterprise Program membership?[](https://docs.expo.dev/eas-workflows/get-started/#do-you-have-an-apple-developer-enterprise)

The following will only work if you have an Apple account with Apple Developer Enterprise Program membership. While using Enterprise provisioning, you can sign your app using a `universal` or `adhoc` provisioning profile. We recommend `universal` because it does not require you to register your devices with Apple, which is the main benefit of using Enterprise provisioning.

```
{
  "build": {
    "preview": {
      "distribution": "internal",
      "ios": {
        "enterpriseProvisioning": "universal"
      }
    }
  }
}
```

2

## Configure app signing[](https://docs.expo.dev/eas-workflows/get-started/#configure-app-signing)

2.1

### Configure app signing credentials for Android[](https://docs.expo.dev/eas-workflows/get-started/#configure-app-signing-credentials-for-android)

Android does not restrict distribution of applications — the operating system is capable of installing any compatible .apk file. As a result, configuring app signing credentials for internal distribution is no different from other types of builds. The main benefit of using internal distribution, in this case, is to have an easily shareable URL to provide to testers for downloading the app.

2.2

### Configure app signing credentials for iOS[](https://docs.expo.dev/eas-workflows/get-started/#configure-app-signing-credentials-for-ios)

Apple restricts distribution of applications on iPhones and iPads, so we will need to build the app with an ad hoc provisioning profile that explicitly lists the devices on which the application can run.

An alternative to ad hoc provisioning is enterprise provisioning, which requires a special Apple Developer membership that costs $299 USD per year. Enterprise provisioning allows you to run the application on any device without any sort of device registration.

#### Setting up ad hoc provisioning[](https://docs.expo.dev/eas-workflows/get-started/#setting-up-ad-hoc-provisioning)

Apps signed with an ad hoc provisioning profile can be installed by any iOS device whose unique identifier (UDID) is registered with the provisioning profile.

Setting up ad hoc provisioning consists of two steps. In the first step, you'll register devices that you want to be able to install your app. Run the following command to generate a URL (and QR code, for convenience) that you can open on your devices, and then follow the instructions on the registration page.

`# Register Apple Devices for internal distribution`

`-` `eas device:create`

You can register new devices at any time, but builds that were created before the device was registered will not run on newly registered devices; only builds that are created after the device is registered will be installable.

The next step is to generate or update the provisioning profile. When you proceed to run a build, you will be guided through this process.

Are you setting up enterprise provisioning?[](https://docs.expo.dev/eas-workflows/get-started/#are-you-setting-up-enterprise-provisioning)

Apple Enterprise Program membership costs $299 USD per year and [not all organizations will be eligible](https://developer.apple.com/programs/enterprise/), so you will likely be using ad hoc provisioning, which works with any normal paid Apple Developer account.

If you have an [Apple Developer Enterprise Program membership](https://developer.apple.com/programs/enterprise/) users can install your app to their device without pre-registering their UDID. They just need to install the profile to their device and they can then access existing builds. You will need to sign in using your Apple Developer Enterprise account during the `eas build` process to set up the correct provisioning.

If you distribute your app both through enterprise provisioning and the App Store, you will need to have a distinct bundle identifier for each context. We recommend either:

-   In managed projects, use app.config.js to dynamically switch identifiers.
-   In bare projects, create a separate `scheme` for each bundle identifier and specify the scheme name in separate build profiles.

Are you using manual local credentials?[](https://docs.expo.dev/eas-workflows/get-started/#are-you-using-manual-local-credentials)

If so, make sure to point your credentials.json to an ad hoc or enterprise provisioning profile that you generate through the Apple Developer Portal (either update an existing credentials.json used for another type of distribution or replace it with a new one that points to the appropriate provisioning profile). Beware that EAS CLI does only a limited validation of your local credentials, and you will have to handle device UDID registration manually. Read more about [using local credentials](https://docs.expo.dev/app-signing/local-credentials/).

3

## Run a build with the internal build profile[](https://docs.expo.dev/eas-workflows/get-started/#run-a-build-with-the-internal-build-profile)

Now that we have set up our build profile and app signing, running a build for internal distribution is just like any other build.

`# Create Android and iOS builds for internal distribution`

`-` `eas build --profile preview --platform all`

> If you're using ad hoc provisioning but you haven't registered any devices yet, you'll be asked to register them now (or exit the current command and run `eas device:create` again). The build command will wait for the new device to register. Scan the QR code that is presented in the terminal and follow the instructions on that page to register your device. When you're done, return to the terminal and continue.

When the build completes, you will be given a URL that you can share with your team to download and install the app.

4

## Install and run the build[](https://docs.expo.dev/eas-workflows/get-started/#install-and-run-the-build)

Press the "Install" button on the build page and follow the instructions presented in the modal.

If you're running iOS 16 or above and haven't yet turned on Developer Mode, you will need to [enable it](https://docs.expo.dev/guides/ios-developer-mode/) before you can run your build. This doesn't apply if you're using enterprise provisioning.

5

## Automation on CI (optional)[](https://docs.expo.dev/eas-workflows/get-started/#automation-on-ci-optional)

It's possible to run internal distribution builds non-interactively in CI using the `--non-interactive` flag; however, if you are using ad hoc provisioning on iOS you will not be able to add new devices to your provisioning profile when using this flag. After registering a device through `eas device:create`, you need to run `eas build` interactively and authenticate with Apple for EAS to add the device to your provisioning profile. [Learn more about triggering builds from CI](https://docs.expo.dev/build/building-on-ci/).

## Managing devices[](https://docs.expo.dev/eas-workflows/get-started/#managing-devices)

You can see any devices registered via `eas device:create` by running:

`# List devices registered for ad hoc provisioning`

`-` `eas device:list`

Devices registered with Expo for ad hoc provisioning will appear on your Apple Developer Portal after they are used to generate a provisioning profile for a new internal build with EAS Build or to [resign an existing build](https://docs.expo.dev/app-signing/app-credentials/#re-signing-new-credentials) with `eas build:resign`.

### Remove devices[](https://docs.expo.dev/eas-workflows/get-started/#remove-devices)

If a device is no longer in use, it can be removed from this list by running:

`# Delete devices from your Expo account, optionally disable them on the Apple Developer Portal`

`-` `eas device:delete`

This command will also prompt you to disable the device on the Apple Developer Portal. Disabled devices still count against [Apple's limit of 100 devices](https://developer.apple.com/support/account/#:~:text=Resetting%20your%20device%20list%20annually) for ad hoc distribution per app.

### Rename devices[](https://docs.expo.dev/eas-workflows/get-started/#rename-devices)

Devices added via the website URL/QR code will default to displaying their UDID when selecting them for an EAS Build. You can assign friendly names to your devices with the following command:

`# Rename devices on Expo and the Apple Developer Portal`

`-` `eas device:rename`