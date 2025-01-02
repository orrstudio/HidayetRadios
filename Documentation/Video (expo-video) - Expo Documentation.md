A library that provides an API to implement video playback in apps.

___

`expo-video` is a cross-platform, performant video component for React Native and Expo with Web support.

## Installation[](https://docs.expo.dev/versions/latest/sdk/video/#installation)

`-` `npx expo install expo-video`

If you are installing this in an [existing React Native app](https://docs.expo.dev/bare/overview), start by [installing `expo`](https://docs.expo.dev/bare/installing-expo-modules) in your project. Then, follow the [additional instructions](https://github.com/expo/expo/tree/main/packages/expo-video) as mentioned by the library's README under "Installation in bare React Native projects" section.

## Configuration in app config[](https://docs.expo.dev/versions/latest/sdk/video/#configuration-in-app-config)

You can configure `expo-video` using its built-in [config plugin](https://docs.expo.dev/config-plugins/introduction) if you use config plugins in your project ([EAS Build](https://docs.expo.dev/build/introduction) or `npx expo run:[android|ios]`). The plugin allows you to configure various properties that cannot be set at runtime and require building a new app binary to take effect. If your app does not use EAS Build, then you'll need to manually configure the package.

### Example app.json with config plugin[](https://docs.expo.dev/versions/latest/sdk/video/#example-appjson-with-config-plugin)

```
{
  "expo": {
    "plugins": [
      [
        "expo-video",
        {
          "supportsBackgroundPlayback": true,
          "supportsPictureInPicture": true
        }
      ]
    ],
  }
}
```

### Configurable properties[](https://docs.expo.dev/versions/latest/sdk/video/#configurable-properties)

| Name | Default | Description |
| --- | --- | --- |
| `supportsBackgroundPlayback` | `undefined` | 
Only for: 

iOS

  

A boolean value to enable background playback on iOS. If `true`, the `audio` key is added to the `UIBackgroundModes` array in the Info.plist file. If `false`, the key is removed. When `undefined`, the key is not modified.

 |
| `supportsPictureInPicture` | `undefined` | 

A boolean value to enable Picture-in-Picture on Android and iOS. Configures the `android:supportsPictureInPicture` property on Android and the `UIBackgroundModes` array in the Info.plist file on iOS. When `undefined`, the configuration is not modified.

 |

## Usage[](https://docs.expo.dev/versions/latest/sdk/video/#usage)

Here's a simple example of a video with a play and pause button.

```
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export default function VideoScreen() {
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View style={styles.contentContainer}>
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
      <View style={styles.controlsContainer}>
        <Button
          title={isPlaying ? 'Pause' : 'Play'}
          onPress={() => {
            if (isPlaying) {
              player.pause();
            } else {
              player.play();
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: 350,
    height: 275,
  },
  controlsContainer: {
    padding: 10,
  },
});
```

### Receiving events[](https://docs.expo.dev/versions/latest/sdk/video/#receiving-events)

The changes in properties of the [`VideoPlayer`](https://docs.expo.dev/versions/latest/sdk/video#videoplayer) do not update the React state. Therefore, to display the information about the current state of the `VideoPlayer`, it is necessary to listen to the [events](https://docs.expo.dev/versions/latest/sdk/video#videoplayerevents) it emits. The event system is based on the [`EventEmitter`](https://docs.expo.dev/versions/latest/sdk/expo#eventemitter) class and [hooks](https://docs.expo.dev/versions/latest/sdk/expo#hooks) from the [`expo`](https://docs.expo.dev/versions/latest/sdk/expo) package. There are a few ways to listen to events:

#### `useEvent` hook[](https://docs.expo.dev/versions/latest/sdk/video/#useevent-hook)

Creates a listener that will return a stateful value that can be used in a component. It also cleans up automatically when the component unmounts.

```
import { useEvent } from 'expo';
// ... Other imports, definition of the component, creating the player etc.

const { status, error } = useEvent(player, 'statusChange', { status: player.status });
// Rest of the component...
```

#### `useEventListener` hook[](https://docs.expo.dev/versions/latest/sdk/video/#useeventlistener-hook)

Built around the `Player.addListener` and `Player.removeListener` methods, creates an event listener with automatic cleanup.

```
import { useEventListener } from 'expo';
// ...Other imports, definition of the component, creating the player etc.

useEventListener(player, 'statusChange', ({ status, error }) => {
  setPlayerStatus(status);
  setPlayerError(error);
  console.log('Player status changed: ', status);
});
// Rest of the component...
```

#### `Player.addListener` method[](https://docs.expo.dev/versions/latest/sdk/video/#playeraddlistener-method)

Most flexible way to listen to events, but requires manual cleanup and more boilerplate code.

```
// ...Imports, definition of the component, creating the player etc.

useEffect(() => {
  const subscription = player.addListener('statusChange', ({ status, error }) => {
    setPlayerStatus(status);
    setPlayerError(error);
    console.log('Player status changed: ', status);
  });

  return () => {
    subscription.remove();
  };
}, []);
// Rest of the component...
```

### Playing local media from the assets directory[](https://docs.expo.dev/versions/latest/sdk/video/#playing-local-media-from-the-assets-directory)

`expo-video` supports playing local media loaded using the `require` function. You can use the result as a source directly, or assign it to the `assetId` parameter of a [`VideoSource`](https://docs.expo.dev/versions/latest/sdk/video#videosource) if you also want to configure other properties.

```
import { VideoSource } from 'expo-video';

const assetId = require('./assets/bigbuckbunny.mp4');

const videoSource: VideoSource = {
  assetId,
  metadata: {
    title: 'Big Buck Bunny',
    artist: 'The Open Movie Project',
  },
};

const player1 = useVideoPlayer(assetId); // You can use the `asset` directly as a video source
const player2 = useVideoPlayer(videoSource);
```

### Preloading videos[](https://docs.expo.dev/versions/latest/sdk/video/#preloading-videos)

While another video is playing, a video can be loaded before showing it in the view. This allows for quicker transitions between subsequent videos and a better user experience.

To preload a video, you have to create a `VideoPlayer` with a video source. Even when the player is not connected to a `VideoView`, it will fill the buffers. Once it is connected to the `VideoView`, it will be able to start playing without buffering.

In some cases, it is beneficial to preload a video later in the screen lifecycle. In that case, a `VideoPlayer` with a `null` source should be created. To start preloading, replace the player source with a video source using the `replace()` function.

Here is an example of how to preload a video:

```
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const bigBuckBunnySource: VideoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const elephantsDreamSource: VideoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';

export default function PreloadingVideoPlayerScreen() {
  const player1 = useVideoPlayer(bigBuckBunnySource, player => {
    player.play();
  });

  const player2 = useVideoPlayer(elephantsDreamSource, player => {
    player.currentTime = 20;
  });

  const [currentPlayer, setCurrentPlayer] = useState(player1);

  const replacePlayer = useCallback(async () => {
    currentPlayer.pause();
    if (currentPlayer === player1) {
      setCurrentPlayer(player2);
      player1.pause();
      player2.play();
    } else {
      setCurrentPlayer(player1);
      player2.pause();
      player1.play();
    }
  }, [player1, currentPlayer]);

  return (
    <View style={styles.contentContainer}>
      <VideoView player={currentPlayer} style={styles.video} nativeControls={false} />
      <TouchableOpacity style={styles.button} onPress={replacePlayer}>
        <Text style={styles.buttonText}>Replace Player</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4630ec',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#eeeeee',
    textAlign: 'center',
  },
  video: {
    width: 300,
    height: 168.75,
    marginVertical: 20,
  },
});
```

### Using the VideoPlayer directly[](https://docs.expo.dev/versions/latest/sdk/video/#using-the-videoplayer-directly)

In most cases, the [`useVideoPlayer`](https://docs.expo.dev/versions/latest/sdk/video#usevideoplayersource-setup) hook should be used to create a `VideoPlayer` instance. It manages the player's lifecycle and ensures that it is properly disposed of when the component is unmounted. However, in some advanced use cases, it might be necessary to create a `VideoPlayer` that does not get automatically destroyed when the component is unmounted. In those cases, the `VideoPlayer` can be created using the [`createVideoPlayer`](https://docs.expo.dev/versions/latest/sdk/video#videocreatevideoplayersource) function. You need be aware of the risks that come with this approach, as it is your responsibility to call the [`release()`](https://docs.expo.dev/versions/latest/sdk/expo#release) method when the player is no longer needed. If not handled properly, this approach may lead to memory leaks.

```
import { createVideoPlayer } from 'expo-video';
const player = createVideoPlayer(videoSource);
```

## API[](https://docs.expo.dev/versions/latest/sdk/video/#api)

```
import { VideoView, useVideoPlayer } from 'expo-video';
```

## Component[](https://docs.expo.dev/versions/latest/sdk/video/#component)

### `VideoView`[](https://docs.expo.dev/versions/latest/sdk/video/#videoview)

Type: `React.[PureComponent](https://react.dev/reference/react/PureComponent)<[VideoViewProps](https://docs.expo.dev/versions/latest/sdk/video/#videoviewprops)>`

VideoViewProps[](https://docs.expo.dev/versions/latest/sdk/video/#videoviewprops)

### `allowsFullscreen`[](https://docs.expo.dev/versions/latest/sdk/video/#allowsfullscreen)

Optional • 

Type:

`boolean` • Default: `true`

Determines whether fullscreen mode is allowed or not.

### `allowsPictureInPicture`[](https://docs.expo.dev/versions/latest/sdk/video/#allowspictureinpicture)

Determines whether the player allows Picture in Picture (PiP) mode.

> Note: The `supportsPictureInPicture` property of the [config plugin](https://docs.expo.dev/versions/latest/sdk/video/#configuration-in-app-config) has to be configured for the PiP to work.

### `allowsVideoFrameAnalysis`[](https://docs.expo.dev/versions/latest/sdk/video/#allowsvideoframeanalysis)

Optional • 

Type:

`boolean` • Default: `true`

Specifies whether to perform video frame analysis (Live Text in videos). Check official [Apple documentation](https://developer.apple.com/documentation/avkit/avplayerviewcontroller/allowsvideoframeanalysis) for more details.

### `contentFit`[](https://docs.expo.dev/versions/latest/sdk/video/#contentfit)

Optional • 

Type:

`[VideoContentFit](https://docs.expo.dev/versions/latest/sdk/video/#videocontentfit)` • Default: `'contain'`

Describes how the video should be scaled to fit in the container. Options are `'contain'`, `'cover'`, and `'fill'`.

### `contentPosition`[](https://docs.expo.dev/versions/latest/sdk/video/#contentposition)

Optional • 

Type:

`{ dx: number, dy: number }`

Determines the position offset of the video inside the container.

### `nativeControls`[](https://docs.expo.dev/versions/latest/sdk/video/#nativecontrols)

Optional • 

Type:

`boolean` • Default: `true`

Determines whether native controls should be displayed or not.

### `onFullscreenEnter`[](https://docs.expo.dev/versions/latest/sdk/video/#onfullscreenenter)

Optional • 

Type:

`() => void`

A callback to call after the video player enters fullscreen mode.

### `onFullscreenExit`[](https://docs.expo.dev/versions/latest/sdk/video/#onfullscreenexit)

Optional • 

Type:

`() => void`

A callback to call after the video player exits fullscreen mode.

### `onPictureInPictureStart`[](https://docs.expo.dev/versions/latest/sdk/video/#onpictureinpicturestart)

Optional • 

Type:

`() => void`

A callback to call after the video player enters Picture in Picture (PiP) mode.

### `onPictureInPictureStop`[](https://docs.expo.dev/versions/latest/sdk/video/#onpictureinpicturestop)

Optional • 

Type:

`() => void`

A callback to call after the video player exits Picture in Picture (PiP) mode.

### `player`[](https://docs.expo.dev/versions/latest/sdk/video/#player)

A video player instance. Use [`useVideoPlayer()`](https://docs.expo.dev/versions/latest/sdk/video/#usevideoplayersource-setup) hook to create one.

### `requiresLinearPlayback`[](https://docs.expo.dev/versions/latest/sdk/video/#requireslinearplayback)

Optional • 

Type:

`boolean` • Default: `false`

Determines whether the player allows the user to skip media content.

### `showsTimecodes`[](https://docs.expo.dev/versions/latest/sdk/video/#showstimecodes)

Optional • 

Type:

`boolean` • Default: `true`

Determines whether the timecodes should be displayed or not.

### `startsPictureInPictureAutomatically`[](https://docs.expo.dev/versions/latest/sdk/video/#startspictureinpictureautomatically)

Optional • 

Type:

`boolean` • Default: `false`

Determines whether the player should start Picture in Picture (PiP) automatically when the app is in the background.

> Note: Only one player can be in Picture in Picture (PiP) mode at a time.

> Note: The `supportsPictureInPicture` property of the [config plugin](https://docs.expo.dev/versions/latest/sdk/video/#configuration-in-app-config) has to be configured for the PiP to work.

## Component Methods[](https://docs.expo.dev/versions/latest/sdk/video/#component-methods)

### `enterFullscreen()`[](https://docs.expo.dev/versions/latest/sdk/video/#enterfullscreen)

### `exitFullscreen()`[](https://docs.expo.dev/versions/latest/sdk/video/#exitfullscreen)

### `startPictureInPicture()`[](https://docs.expo.dev/versions/latest/sdk/video/#startpictureinpicture)

Enters Picture in Picture (PiP) mode. Throws an exception if the device does not support PiP.

> Note: Only one player can be in Picture in Picture (PiP) mode at a time.

> Note: The `supportsPictureInPicture` property of the [config plugin](https://docs.expo.dev/versions/latest/sdk/video/#configuration-in-app-config) has to be configured for the PiP to work.

### `stopPictureInPicture()`[](https://docs.expo.dev/versions/latest/sdk/video/#stoppictureinpicture)

Exits Picture in Picture (PiP) mode.

## Hooks[](https://docs.expo.dev/versions/latest/sdk/video/#hooks)

### `useVideoPlayer(source, setup)`[](https://docs.expo.dev/versions/latest/sdk/video/#usevideoplayersource-setup)

| Parameter | Type | Description |
| --- | --- | --- |
| source | `[VideoSource](https://docs.expo.dev/versions/latest/sdk/video/#videosource)` | 
A video source that is used to initialize the player.

 |
| setup(optional) | `(player: [VideoPlayer](https://docs.expo.dev/versions/latest/sdk/video/#videoplayer)) => void` | 

A function that allows setting up the player. It will run after the player is created.

 |

  

Creates a `VideoPlayer`, which will be automatically cleaned up when the component is unmounted.

## Classes[](https://docs.expo.dev/versions/latest/sdk/video/#classes)

### `VideoPlayer`[](https://docs.expo.dev/versions/latest/sdk/video/#videoplayer)

Type: Class extends `[SharedObject](https://docs.expo.dev/versions/v52.0.0/sdk/expo#sharedobject)<[VideoPlayerEvents](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents)>`

A class that represents an instance of the video player.

VideoPlayer Properties

### `allowsExternalPlayback`[](https://docs.expo.dev/versions/latest/sdk/video/#allowsexternalplayback)

Type:

`boolean` • Default: `true`

Determines whether the player should allow external playback.

### `audioMixingMode`[](https://docs.expo.dev/versions/latest/sdk/video/#audiomixingmode)

Type:

`[AudioMixingMode](https://docs.expo.dev/versions/latest/sdk/video/#audiomixingmode)` • Default: `'auto'`

Determines how the player will interact with other audio playing in the system.

### `availableSubtitleTracks`[](https://docs.expo.dev/versions/latest/sdk/video/#availablesubtitletracks)

Read Only • 

Type:

`[SubtitleTrack[]](https://docs.expo.dev/versions/latest/sdk/video/#subtitletrack)`

An array of subtitle tracks available for the current video.

### `bufferedPosition`[](https://docs.expo.dev/versions/latest/sdk/video/#bufferedposition)

Float value indicating how far the player has buffered the video in seconds.

This value is 0 when the player has not buffered up to the current playback time. When it's impossible to determine the buffer state (for example, when the player isn't playing any media), this value is -1.

### `bufferOptions`[](https://docs.expo.dev/versions/latest/sdk/video/#bufferoptions)

Specifies buffer options which will be used by the player when buffering the video.

> You should provide a `BufferOptions` object when setting this property. Setting individual buffer properties is not supported.

### `currentLiveTimestamp`[](https://docs.expo.dev/versions/latest/sdk/video/#currentlivetimestamp)

Read Only • 

Type:

`null | number`

The exact timestamp when the currently displayed video frame was sent from the server, based on the `EXT-X-PROGRAM-DATE-TIME` tag in the livestream metadata. If this metadata is missing, this property will return `null`.

### `currentOffsetFromLive`[](https://docs.expo.dev/versions/latest/sdk/video/#currentoffsetfromlive)

Read Only • 

Type:

`null | number`

Float value indicating the latency of the live stream in seconds. If a livestream doesn't have the required metadata, this will return `null`.

### `currentTime`[](https://docs.expo.dev/versions/latest/sdk/video/#currenttime)

Float value indicating the current playback time in seconds.

If the player is not yet playing, this value indicates the time position at which playback will begin once the `play()` method is called.

Setting `currentTime` to a new value seeks the player to the given time.

### `duration`[](https://docs.expo.dev/versions/latest/sdk/video/#duration)

Float value indicating the duration of the current video in seconds.

### `isLive`[](https://docs.expo.dev/versions/latest/sdk/video/#islive)

Read Only • 

Type:

`boolean`

Boolean value indicating whether the player is currently playing a live stream.

### `loop`[](https://docs.expo.dev/versions/latest/sdk/video/#loop)

Type:

`boolean` • Default: `false`

Determines whether the player should automatically replay after reaching the end of the video.

### `muted`[](https://docs.expo.dev/versions/latest/sdk/video/#muted)

Type:

`boolean` • Default: `false`

Boolean value whether the player is currently muted. Setting this property to `true`/`false` will mute/unmute the player.

### `playbackRate`[](https://docs.expo.dev/versions/latest/sdk/video/#playbackrate)

Type:

`number` • Default: `1.0`

Float value between `0` and `16.0` indicating the current playback speed of the player.

### `playing`[](https://docs.expo.dev/versions/latest/sdk/video/#playing)

Read Only • 

Type:

`boolean`

Boolean value whether the player is currently playing.

> Use `play` and `pause` methods to control the playback.

### `preservesPitch`[](https://docs.expo.dev/versions/latest/sdk/video/#preservespitch)

Type:

`boolean` • Default: `true`

Boolean value indicating if the player should correct audio pitch when the playback speed changes.

### `showNowPlayingNotification`[](https://docs.expo.dev/versions/latest/sdk/video/#shownowplayingnotification)

Type:

`boolean` • Default: `false`

Boolean value determining whether the player should show the now playing notification.

### `status`[](https://docs.expo.dev/versions/latest/sdk/video/#status)

Read Only • 

Type:

`[VideoPlayerStatus](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerstatus)`

Indicates the current status of the player.

### `staysActiveInBackground`[](https://docs.expo.dev/versions/latest/sdk/video/#staysactiveinbackground)

Type:

`boolean` • Default: `false`

Determines whether the player should continue playing after the app enters the background.

### `subtitleTrack`[](https://docs.expo.dev/versions/latest/sdk/video/#subtitletrack)

Type:

`null | [SubtitleTrack](https://docs.expo.dev/versions/latest/sdk/video/#subtitletrack)` • Default: `null`

Specifies the subtitle track which is currently displayed by the player. `null` when no subtitles are displayed.

> To ensure a valid subtitle track, always assign one of the subtitle tracks from the [`availableSubtitleTracks`](https://docs.expo.dev/versions/latest/sdk/video/#availablesubtitletracks) array.

### `targetOffsetFromLive`[](https://docs.expo.dev/versions/latest/sdk/video/#targetoffsetfromlive)

Float value indicating the time offset from the live in seconds.

### `timeUpdateEventInterval`[](https://docs.expo.dev/versions/latest/sdk/video/#timeupdateeventinterval)

Type:

`number` • Default: `0`

Float value indicating the interval in seconds at which the player will emit the [`timeUpdate`](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents) event. When the value is equal to `0`, the event will not be emitted.

### `volume`[](https://docs.expo.dev/versions/latest/sdk/video/#volume)

Type:

`number` • Default: `1.0`

Float value between `0` and `1.0` representing the current volume. Muting the player doesn't affect the volume. In other words, when the player is muted, the volume is the same as when unmuted. Similarly, setting the volume doesn't unmute the player.

VideoPlayer Methods

### `generateThumbnailsAsync(times)`[](https://docs.expo.dev/versions/latest/sdk/video/#generatethumbnailsasynctimes)

| Parameter | Type |
| --- | --- |
| times | `number | number[]` |

  

Generates thumbnails from the currently played asset. The thumbnails are references to native images, thus they can be used as a source of the `Image` component from `expo-image`.

### `pause()`[](https://docs.expo.dev/versions/latest/sdk/video/#pause)

### `play()`[](https://docs.expo.dev/versions/latest/sdk/video/#play)

### `replace(source)`[](https://docs.expo.dev/versions/latest/sdk/video/#replacesource)

| Parameter | Type |
| --- | --- |
| source | `[VideoSource](https://docs.expo.dev/versions/latest/sdk/video/#videosource)` |

  

Replaces the current source with a new one.

### `replay()`[](https://docs.expo.dev/versions/latest/sdk/video/#replay)

Seeks the playback to the beginning.

### `seekBy(seconds)`[](https://docs.expo.dev/versions/latest/sdk/video/#seekbyseconds)

| Parameter | Type |
| --- | --- |
| seconds | `number` |

  

Seeks the playback by the given number of seconds.

### `VideoThumbnail`[](https://docs.expo.dev/versions/latest/sdk/video/#videothumbnail)

Type: Class extends `[SharedRef](https://docs.expo.dev/versions/v52.0.0/sdk/expo#sharedref)<'image'>`

Represents a video thumbnail that references a native image. Instances of this class can be passed as a source to the `Image` component from `expo-image`.

VideoThumbnail Properties

### `actualTime`[](https://docs.expo.dev/versions/latest/sdk/video/#actualtime)

The time in seconds at which the thumbnail was actually generated.

### `height`[](https://docs.expo.dev/versions/latest/sdk/video/#height)

Height of the created thumbnail.

### `nativeRefType`[](https://docs.expo.dev/versions/latest/sdk/video/#nativereftype)

The type of the native reference.

### `requestedTime`[](https://docs.expo.dev/versions/latest/sdk/video/#requestedtime)

The time in seconds at which the thumbnail was to be created.

### `width`[](https://docs.expo.dev/versions/latest/sdk/video/#width)

Width of the created thumbnail.

## Methods[](https://docs.expo.dev/versions/latest/sdk/video/#methods)

### `Video.createVideoPlayer(source)`[](https://docs.expo.dev/versions/latest/sdk/video/#videocreatevideoplayersource)

| Parameter | Type |
| --- | --- |
| source | `[VideoSource](https://docs.expo.dev/versions/latest/sdk/video/#videosource)` |

  

Creates a direct instance of `VideoPlayer` that doesn't release automatically.

> For most use cases you should use the [`useVideoPlayer`](https://docs.expo.dev/versions/latest/sdk/video/#usevideoplayer) hook instead. See the [Using the VideoPlayer Directly](https://docs.expo.dev/versions/latest/sdk/video/#using-the-videoplayer-directly) section for more details.

### `Video.isPictureInPictureSupported()`[](https://docs.expo.dev/versions/latest/sdk/video/#videoispictureinpicturesupported)

Returns whether the current device supports Picture in Picture (PiP) mode.

> Note: All major web browsers support Picture in Picture (PiP) mode except Firefox. For more information, see [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API#browser_compatibility).

A `boolean` which is `true` if the device supports PiP mode, and `false` otherwise.

## Types[](https://docs.expo.dev/versions/latest/sdk/video/#types)

### `AudioMixingMode`[](https://docs.expo.dev/versions/latest/sdk/video/#audiomixingmode-1)

Literal Type: `string`

Specifies the audio mode that the player should use. Audio mode is set on per-app basis, if there are multiple players playing and have different a `AudioMode` specified, the highest priority mode will be used. Priority order: 'doNotMix' > 'auto' > 'duckOthers' > 'mixWithOthers'.

-   `mixWithOthers`: The player will mix its audio output with other apps.
-   `duckOthers`: The player will lower the volume of other apps if any of the active players is outputting audio.
-   `auto`: The player will allow other apps to keep playing audio only when it is muted. On iOS it will always interrupt other apps when `showNowPlayingNotification` is `true` due to system requirements.
-   `doNotMix`: The player will pause playback in other apps, even when it's muted.

> On iOS, the Now Playing notification is dependent on the audio mode. If the audio mode is different from `doNotMix` or `auto` this feature will not work.

Acceptable values are: `'mixWithOthers'` | `'duckOthers'` | `'auto'` | `'doNotMix'`

### `BufferOptions`[](https://docs.expo.dev/versions/latest/sdk/video/#bufferoptions-1)

Specifies buffer options which will be used by the player when buffering the video.

| Property | Type | Description |
| --- | --- | --- |
| maxBufferBytes(optional) | `number | null` | 
Only for: 

Android

  

The maximum number of bytes that the player can buffer from the network. When 0 the player will automatically decide appropriate buffer size.

Default:`0`



 |
| minBufferForPlayback(optional) | `number` | 

Only for: 

Android

  

Minimum duration of the buffer in seconds required to continue playing after the player has been paused or started buffering.

> This property will be ignored if `preferredForwardBufferDuration` is lower.

Default:`2`



 |
| preferredForwardBufferDuration(optional) | `number` | 

Only for: 

Android

iOS

  

The duration in seconds which determines how much media the player should buffer ahead of the current playback time.

On iOS when set to `0` the player will automatically decide appropriate buffer duration.

Equivalent to [`AVPlayerItem.preferredForwardBufferDuration`](https://developer.apple.com/documentation/avfoundation/avplayeritem/1643630-preferredforwardbufferduration).

Default:`Android: 20, iOS: 0`



 |
| prioritizeTimeOverSizeThreshold(optional) | `boolean` | 

Only for: 

Android

  

A Boolean value which determines whether the player should prioritize time over size when buffering media.

Default:`false`



 |
| waitsToMinimizeStalling(optional) | `boolean` | 

Only for: 

iOS

  

A Boolean value that indicates whether the player should automatically delay playback in order to minimize stalling.

Equivalent to [`AVPlayer.automaticallyWaitsToMinimizeStalling`](https://developer.apple.com/documentation/avfoundation/avplayer/1643482-automaticallywaitstominimizestal).

Default:`true`



 |

### `DRMOptions`[](https://docs.expo.dev/versions/latest/sdk/video/#drmoptions)

Specifies DRM options which will be used by the player while loading the video.

| Property | Type | Description |
| --- | --- | --- |
| base64CertificateData(optional) | `string` | 
Only for: 

iOS

  

Specifies the base64 encoded certificate data for the FairPlay DRM. When this property is set, the `certificateUrl` property is ignored.



 |
| certificateUrl(optional) | `string` | 

Only for: 

iOS

  

Specifies the certificate URL for the FairPlay DRM.



 |
| contentId(optional) | `string` | 

Only for: 

iOS

  

Specifies the content ID of the stream.



 |
| headers(optional) | `Record<string, string>` | 

Determines headers sent to the license server on license requests.

 |
| licenseServer | `string` | 

Determines the license server URL.

 |
| multiKey(optional) | `boolean` | 

Only for: 

Android

  

Specifies whether the DRM is a multi-key DRM.



 |
| type | `[DRMType](https://docs.expo.dev/versions/latest/sdk/video/#drmtype)` | 

Determines which type of DRM to use.

 |

### `DRMType`[](https://docs.expo.dev/versions/latest/sdk/video/#drmtype)

Literal Type: `string`

Specifies which type of DRM to use:

-   Android supports ClearKey, PlayReady and Widevine.
-   iOS supports FairPlay.

Acceptable values are: `'clearkey'` | `'fairplay'` | `'playready'` | `'widevine'`

### `MutedChangeEventPayload`[](https://docs.expo.dev/versions/latest/sdk/video/#mutedchangeeventpayload)

Data delivered with the [`mutedChange`](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents) event.

| Property | Type | Description |
| --- | --- | --- |
| muted | `boolean` | 
Boolean value whether the player is currently muted.

 |
| oldMuted(optional) | `boolean` | 

Previous value of the `isMuted` property.

 |

### `PlaybackRateChangeEventPayload`[](https://docs.expo.dev/versions/latest/sdk/video/#playbackratechangeeventpayload)

Data delivered with the [`playbackRateChange`](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents) event.

| Property | Type | Description |
| --- | --- | --- |
| oldPlaybackRate(optional) | `number` | 
Previous value of the `playbackRate` property.

 |
| playbackRate | `number` | 

Float value indicating the current playback speed of the player.

 |

### `PlayerError`[](https://docs.expo.dev/versions/latest/sdk/video/#playererror)

Contains information about any errors that the player encountered during the playback

| Property | Type | Description |
| --- | --- | --- |
| message | `string` | \- |

### `PlayingChangeEventPayload`[](https://docs.expo.dev/versions/latest/sdk/video/#playingchangeeventpayload)

Data delivered with the [`playingChange`](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents) event.

| Property | Type | Description |
| --- | --- | --- |
| isPlaying | `boolean` | 
Boolean value whether the player is currently playing.

 |
| oldIsPlaying(optional) | `boolean` | 

Previous value of the `isPlaying` property.

 |

### `SourceChangeEventPayload`[](https://docs.expo.dev/versions/latest/sdk/video/#sourcechangeeventpayload)

Data delivered with the [`sourceChange`](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents) event.

| Property | Type | Description |
| --- | --- | --- |
| oldSource(optional) | `[VideoSource](https://docs.expo.dev/versions/latest/sdk/video/#videosource)` | 
Previous source of the player.

 |
| source | `[VideoSource](https://docs.expo.dev/versions/latest/sdk/video/#videosource)` | 

New source of the player.

 |

### `StatusChangeEventPayload`[](https://docs.expo.dev/versions/latest/sdk/video/#statuschangeeventpayload)

Data delivered with the [`statusChange`](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents) event.

| Property | Type | Description |
| --- | --- | --- |
| error(optional) | `[PlayerError](https://docs.expo.dev/versions/latest/sdk/video/#playererror)` | 
Error object containing information about the error that occurred.

 |
| oldStatus(optional) | `[VideoPlayerStatus](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerstatus)` | 

Previous status of the player.

 |
| status | `[VideoPlayerStatus](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerstatus)` | 

New status of the player.

 |

### `TimeUpdateEventPayload`[](https://docs.expo.dev/versions/latest/sdk/video/#timeupdateeventpayload)

Data delivered with the [`timeUpdate`](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents) event, contains information about the current playback progress.

| Property | Type | Description |
| --- | --- | --- |
| bufferedPosition | `number` | 
Only for: 

Android

iOS

  

Float value indicating how far the player has buffered the video in seconds. Same as the [`bufferedPosition`](https://docs.expo.dev/versions/latest/sdk/video/#bufferedPosition) property.



 |
| currentLiveTimestamp | `number | null` | 

Only for: 

Android

iOS

  

The exact timestamp when the currently displayed video frame was sent from the server, based on the `EXT-X-PROGRAM-DATE-TIME` tag in the livestream metadata. Same as the [`currentLiveTimestamp`](https://docs.expo.dev/versions/latest/sdk/video/#currentlivetimestamp) property.



 |
| currentOffsetFromLive | `number | null` | 

Only for: 

Android

iOS

  

Float value indicating the latency of the live stream in seconds. Same as the [`currentOffsetFromLive`](https://docs.expo.dev/versions/latest/sdk/video/#currentoffsetfromlive) property.



 |
| currentTime | `number` | 

Float value indicating the current playback time in seconds. Same as the [`currentTime`](https://docs.expo.dev/versions/latest/sdk/video/#currenttime) property.

 |

### `VideoContentFit`[](https://docs.expo.dev/versions/latest/sdk/video/#videocontentfit)

Literal Type: `string`

Describes how a video should be scaled to fit in a container.

-   `contain`: The video maintains its aspect ratio and fits inside the container, with possible letterboxing/pillarboxing.
-   `cover`: The video maintains its aspect ratio and covers the entire container, potentially cropping some portions.
-   `fill`: The video stretches/squeezes to completely fill the container, potentially causing distortion.

Acceptable values are: `'contain'` | `'cover'` | `'fill'`

### `VideoMetadata`[](https://docs.expo.dev/versions/latest/sdk/video/#videometadata)

Contains information that will be displayed in the now playing notification when the video is playing.

| Property | Type | Description |
| --- | --- | --- |
| artist(optional) | `string` | 
Only for: 

Android

iOS

  

Secondary text that will be displayed under the title.



 |
| artwork(optional) | `string` | 

Only for: 

Android

iOS

  

The uri of the video artwork.



 |
| title(optional) | `string` | 

Only for: 

Android

iOS

  

The title of the video.



 |

### `VideoPlayerEvents`[](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents)

Handlers for events which can be emitted by the player.

| Property | Type | Description |
| --- | --- | --- |
| availableSubtitleTracksChange | `(payload: [AvailableSubtitleTracksChangeEventPayload](https://docs.expo.dev/versions/latest/sdk/video/#availablesubtitletrackschangeeventpayload)) => void` | 
Handler for an event emitted when the available subtitle tracks change.

 |
| mutedChange | `(payload: [MutedChangeEventPayload](https://docs.expo.dev/versions/latest/sdk/video/#mutedchangeeventpayload)) => void` | 

Handler for an event emitted when the `muted` property of the player changes

 |
| playbackRateChange | `(payload: [PlaybackRateChangeEventPayload](https://docs.expo.dev/versions/latest/sdk/video/#playbackratechangeeventpayload)) => void` | 

Handler for an event emitted when the `playbackRate` property of the player changes.

 |
| playingChange | `(payload: [PlayingChangeEventPayload](https://docs.expo.dev/versions/latest/sdk/video/#playingchangeeventpayload)) => void` | 

Handler for an event emitted when the player starts or stops playback.

 |
| playToEnd | `() => void` | 

Handler for an event emitted when the player plays to the end of the current source.

 |
| sourceChange | `(payload: [SourceChangeEventPayload](https://docs.expo.dev/versions/latest/sdk/video/#sourcechangeeventpayload)) => void` | 

Handler for an event emitted when the current media source of the player changes.

 |
| statusChange | `(payload: [StatusChangeEventPayload](https://docs.expo.dev/versions/latest/sdk/video/#statuschangeeventpayload)) => void` | 

Handler for an event emitted when the status of the player changes.

 |
| subtitleTrackChange | `(payload: [SubtitleTrackChangeEventPayload](https://docs.expo.dev/versions/latest/sdk/video/#subtitletrackchangeeventpayload)) => void` | 

Handler for an event emitted when the current subtitle track changes.

 |
| timeUpdate | `(payload: [TimeUpdateEventPayload](https://docs.expo.dev/versions/latest/sdk/video/#timeupdateeventpayload)) => void` | 

Handler for an event emitted in a given interval specified by the `timeUpdateEventInterval`.

 |
| volumeChange | `(payload: [VolumeChangeEventPayload](https://docs.expo.dev/versions/latest/sdk/video/#volumechangeeventpayload)) => void` | 

Handler for an event emitted when the `volume` of `muted` property of the player changes.

 |

### `VideoPlayerStatus`[](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerstatus)

Literal Type: `string`

Describes the current status of the player.

-   `idle`: The player is not playing or loading any videos.
-   `loading`: The player is loading video data from the provided source
-   `readyToPlay`: The player has loaded enough data to start playing or to continue playback.
-   `error`: The player has encountered an error while loading or playing the video.

Acceptable values are: `'idle'` | `'loading'` | `'readyToPlay'` | `'error'`

### `VideoSource`[](https://docs.expo.dev/versions/latest/sdk/video/#videosource)

Type: `string` or `number` or `null` or `object` shaped as below:

| Property | Type | Description |
| --- | --- | --- |
| assetId(optional) | `number` | 
The asset ID of a local video asset, acquired with the `require` function. This property is exclusive with the `uri` property. When both are present, the `assetId` will be ignored.

 |
| drm(optional) | `[DRMOptions](https://docs.expo.dev/versions/latest/sdk/video/#drmoptions)` | 

Specifies the DRM options which will be used by the player while loading the video.

 |
| headers(optional) | `Record<string, string>` | 

Only for: 

Android

iOS

  

Specifies headers sent with the video request.

> For DRM license headers use the `headers` field of [`DRMOptions`](https://docs.expo.dev/versions/latest/sdk/video/#drmoptions).



 |
| metadata(optional) | `[VideoMetadata](https://docs.expo.dev/versions/latest/sdk/video/#videometadata)` | 

Only for: 

Android

iOS

  

Specifies information which will be displayed in the now playing notification. When undefined the player will display information contained in the video metadata.



 |
| uri(optional) | `string` | 

The URI of the video.

This property is exclusive with the `assetId` property. When both are present, the `assetId` will be ignored.



 |

### `VolumeChangeEventPayload`[](https://docs.expo.dev/versions/latest/sdk/video/#volumechangeeventpayload)

Data delivered with the [`volumeChange`](https://docs.expo.dev/versions/latest/sdk/video/#videoplayerevents) event.

| Property | Type | Description |
| --- | --- | --- |
| oldVolume(optional) | `number` | 
Previous value of the `volume` property.

 |
| volume | `number` | 

Float value indicating the current volume of the player.

 |