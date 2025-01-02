Learn how a project using EAS services is configured with eas.json.

___

eas.json is the configuration file for EAS CLI and services. It is generated when the [`eas build:configure` command](https://docs.expo.dev/build/setup/#configure-the-project) runs for the first time in your project and is located next to package.json at the root of your project. Configuration for EAS Build all belongs under the `build` key.

The default configuration for eas.json generated in a new project is shown below:

```
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Build profiles[](https://docs.expo.dev/eas-workflows/get-started/#build-profiles)

A build profile is a named group of configurations that describes the necessary parameters to perform a certain type of build.

The JSON object under the `build` key can contain multiple build profiles, and you can have custom build profile names. In the default configuration, there are three build profiles: `development`, `preview`, and `production`. However, these could have been named `foo`, `bar`, and `baz`.

To run a build with a specific profile, use the command as shown below with a `<profile-name>`:

`# Replace the <profile-name> with a build profile from the eas.json`

`-` `eas build --profile <profile-name>`

If you omit the `--profile` flag, EAS CLI will default to using the profile with the name `production` (if it exists).

### Platform-specific and common options[](https://docs.expo.dev/eas-workflows/get-started/#platform-specific-and-common-options)

Inside each build profile, you can specify [`android`](https://docs.expo.dev/eas/json/#android-specific-options) and [`ios`](https://docs.expo.dev/eas/json/#ios-specific-options) fields that contain platform-specific configuration for the build. [Options that are available to both platforms](https://docs.expo.dev/eas/json/#common-properties-for-native-platforms) can be provided on the platform-specific configuration object or the root of a profile.

### Sharing configuration between profiles[](https://docs.expo.dev/eas-workflows/get-started/#sharing-configuration-between-profiles)

Build profiles can be extended to other build profile properties using the `extends` option.

For example, in the `preview` profile you might have `"extends": "production"`. This will make the `preview` profile inherit the configuration of the `production` profile.

## Common use cases[](https://docs.expo.dev/eas-workflows/get-started/#common-use-cases)

Developers using Expo tools usually end up having three different types of builds: development, preview, and production.

### Development builds[](https://docs.expo.dev/eas-workflows/get-started/#development-builds)

By default, `eas build:configure` will create a `development` profile with `"developmentClient": true`. This indicates that this build depends on [`expo-dev-client`](https://docs.expo.dev/develop/development-builds/introduction/). These builds include developer tools, and they are never submitted to an app store.

The `development` profile also defaults to [`"distribution": "internal"`](https://docs.expo.dev/build/internal-distribution/). This will make it easy to distribute your app directly to physical Android and iOS devices.

You can also configure your development builds to run on the [iOS Simulator](https://docs.expo.dev/build-reference/simulators/). To do this, use the following configuration for the `development` profile:

```
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
    %%placeholder-start%%... %%placeholder-end%%
  }
  %%placeholder-start%%... %%placeholder-end%%
}
```

> Note: For iOS, to create a build for internal distribution and another for the iOS Simulator, you can create a separate development profile for that build. You can give the profile a custom name. For example, `development-simulator`, and use the [iOS Simulator specific configuration](https://docs.expo.dev/build-reference/simulators/#configuring-a-profile-to-build-for-simulators) on that profile instead of on `development`. No such configuration is required to run an [Android .apk on a device and an Android Emulator](https://docs.expo.dev/build-reference/apk/) as the same .apk will run with both environments.

### Preview builds[](https://docs.expo.dev/eas-workflows/get-started/#preview-builds)

These builds don't include developer tools. They are intended to be installed by your team and other stakeholders, to test out the app in production-like circumstances. In this way, they are similar to [production builds](https://docs.expo.dev/build/eas-json/#production-builds). However, they are different from production builds because they are either not signed for distribution on app stores (ad hoc or enterprise provisioning on iOS), or are packaged in a way that is not optimal for store deployment (Android .apk is recommended for preview, .aab is recommended for Google Play Store).

A minimal `preview` profile example:

```
{
  "build": {
    "preview": {
      "distribution": "internal"
    }
    %%placeholder-start%%... %%placeholder-end%%
  }
  %%placeholder-start%%... %%placeholder-end%%
}
```

Similar to [development builds](https://docs.expo.dev/build/eas-json/#development-builds), you can configure a preview build to run on the [iOS Simulator](https://docs.expo.dev/build-reference/simulators/) or create a variant of your preview profile for that purpose. No such configuration is required to run an [Android .apk on a device and an Android Emulator](https://docs.expo.dev/build-reference/apk/) as the same .apk will run with both environments.

### Production builds[](https://docs.expo.dev/eas-workflows/get-started/#production-builds)

These builds are submitted to an app store, for release to the general public or as part of a store-facilitated testing process such as TestFlight.

Production builds must be installed through their respective app stores. They cannot be installed directly on your Android Emulator or device, or iOS Simulator or device. The only exception to this is if you explicitly set `"buildType": "apk"` for Android on your build profile. However, it is recommended to use .aab when submitting to stores, as this is the default configuration.

A minimal `production` profile example:

```
{
  "build": {
    "production": {}
    %%placeholder-start%%... %%placeholder-end%%
  }
  %%placeholder-start%%... %%placeholder-end%%
}
```

### Installing multiple builds of the same app on a single device[](https://docs.expo.dev/eas-workflows/get-started/#installing-multiple-builds-of-the-same-app-on-a-single-device)

It's common to have development and production builds installed simultaneously on the same device. See [Install app variants on the same device](https://docs.expo.dev/build-reference/variants/).

## Configuring build tools[](https://docs.expo.dev/eas-workflows/get-started/#configuring-build-tools)

Every build depends either implicitly or explicitly on a specific set of versions of related tools that are needed to carry out the build process. These include but are not limited to: Node.js, npm, Yarn, Ruby, Bundler, CocoaPods, Fastlane, Xcode, and Android NDK.

### Selecting build tool versions[](https://docs.expo.dev/eas-workflows/get-started/#selecting-build-tool-versions)

Versions for the most common build tools can be set on build profiles with fields corresponding to the names of the tools. For example [`node`](https://docs.expo.dev/eas/json/#node):

```
{
  "build": {
    "production": {
      "node": "18.18.0"
    }
    %%placeholder-start%%... %%placeholder-end%%
  }
  %%placeholder-start%%... %%placeholder-end%%
}
```

It's common to share build tool configurations between profiles. Use `extends` for that:

```
{
  "build": {
    "production": {
      "node": "18.18.0"
    },
    "preview": {
      "extends": "production",
      "distribution": "internal"
    },
    "development": {
      "extends": "production",
      "developmentClient": true,
      "distribution": "internal"
    }
    %%placeholder-start%%... %%placeholder-end%%
  }
  %%placeholder-start%%... %%placeholder-end%%
}
```

### Selecting resource class[](https://docs.expo.dev/eas-workflows/get-started/#selecting-resource-class)

A resource class is the virtual machine resources configuration (CPU cores, RAM size) EAS Build provides to your jobs. By default, the resource class is set to `medium`, which is usually sufficient for both small and bigger projects. However, if your project requires a more powerful CPU or bigger memory, or if you want your builds to finish faster, you can switch to `large` workers.

For more details on resources provided to each class, see [`android.resourceClass`](https://docs.expo.dev/eas/json/#resourceclass-1) and [`ios.resourceClass`](https://docs.expo.dev/eas/json/#resourceclass-2) properties. To run your build on a worker of a specific resource class, configure this property in your build profile:

```
{
  "build": {
    "production": {
      "android": {
        "resourceClass": "medium"
      },
      "ios": {
        "resourceClass": "large"
      },
    }
    %%placeholder-start%%... %%placeholder-end%%
  }
  %%placeholder-start%%... %%placeholder-end%%
}
```

> Note: Running jobs on a `large` worker requires a [paid EAS plan](https://expo.dev/accounts/%5Baccount%5D/settings/billing).

### Selecting a base image[](https://docs.expo.dev/eas-workflows/get-started/#selecting-a-base-image)

The base image for the build job controls the default versions for a variety of dependencies, such as Node.js, Yarn, and CocoaPods. You can override them using the specific named fields as described in the previous section using `resourceClass`. However, the image includes specific versions of tools that can't be explicitly set any other way, such as the operating system version and Xcode version.

If you are building an app with Expo, EAS Build will pick the appropriate image to use with a reasonable set of dependencies for the SDK version that you are building for. Otherwise, it is recommended to see the list of available images on [Build server infrastructure](https://docs.expo.dev/build-reference/infrastructure/).

### Examples[](https://docs.expo.dev/eas-workflows/get-started/#examples)

#### Schema[](https://docs.expo.dev/eas-workflows/get-started/#schema)

```
{
  "cli": {
    "version": "SEMVER_RANGE",
    "requireCommit": boolean,
    "appVersionSource": string,
    "promptToConfigurePushNotifications": boolean,
  },
  "build": {
    "BUILD_PROFILE_NAME_1": {
      ...COMMON_OPTIONS,
      "android": {
        ...COMMON_OPTIONS,
        ...ANDROID_OPTIONS
      },
      "ios": {
        ...COMMON_OPTIONS,
        ...IOS_OPTIONS
      }
    },
    "BUILD_PROFILE_NAME_2": {},
%%placeholder-start%%... %%placeholder-end%%
  }
}
```

> You can specify [common properties](https://docs.expo.dev/eas/json/##common-properties-for-native-platforms) both in the platform-specific configuration object or at the profile's root. The platform-specific options take precedence over globally-defined ones.

A managed project with several profiles[](https://docs.expo.dev/eas-workflows/get-started/#a-managed-project-with-several-profiles)

```
{
  "build": {
    "base": {
      "node": "12.13.0",
      "yarn": "1.22.5",
      "env": {
        "EXAMPLE_ENV": "example value"
      },
      "android": {
        "image": "default",
        "env": {
          "PLATFORM": "android"
        }
      },
      "ios": {
        "image": "latest",
        "env": {
          "PLATFORM": "ios"
        }
      }
    },
    "development": {
      "extends": "base",
      "developmentClient": true,
      "env": {
        "ENVIRONMENT": "development"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true
      },
      "ios": {
        "simulator": true
      }
    },
    "staging": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```
A bare project with several profiles[](https://docs.expo.dev/eas-workflows/get-started/#a-bare-project-with-several-profiles)

```
{
  "build": {
    "base": {
      "env": {
        "EXAMPLE_ENV": "example value"
      },
      "android": {
        "image": "ubuntu-18.04-android-30-ndk-r19c",
        "ndk": "21.4.7075529"
      },
      "ios": {
        "image": "latest",
        "node": "12.13.0",
        "yarn": "1.22.5"
      }
    },
    "development": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "android": {
        "distribution": "internal",
        "withoutCredentials": true,
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      }
    },
    "staging": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "staging"
      },
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "production": {
      "extends": "base",
      "env": {
        "ENVIRONMENT": "production"
      }
    }
  }
}
```

## Environment variables[](https://docs.expo.dev/eas-workflows/get-started/#environment-variables)

You can configure environment variables on your build profiles using the `"env"` field. These environment variables will be used to evaluate app.config.js locally when you run `eas build`, and they will also be set on the EAS Build builder.

```
{
  "build": {
    "production": {
      "node": "16.13.0",
      "env": {
        "API_URL": "https://company.com/api"
      }
    },
    "preview": {
      "extends": "production",
      "distribution": "internal",
      "env": {
        "API_URL": "https://staging.company.com/api"
      }
    }
    %%placeholder-start%%... %%placeholder-end%%
  }
  %%placeholder-start%%... %%placeholder-end%%
}
```

The [Environment variables and secrets](https://docs.expo.dev/build-reference/variables/) reference explains this topic in greater detail, and the [Use EAS Update](https://docs.expo.dev/build/updates/) guide provides considerations when using this feature alongside `expo-updates`.

## More[](https://docs.expo.dev/eas-workflows/get-started/#more)

[

EAS Build schema reference

See complete reference of available properties for EAS Build.

](https://docs.expo.dev/eas/json/#eas-build)