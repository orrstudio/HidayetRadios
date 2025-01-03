import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Linking, 
  ScrollView, 
  Image, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  PanResponder,
  TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useVideoPlayer, VideoView } from 'expo-video';
import NetInfo from '@react-native-community/netinfo';
import * as ScreenOrientation from 'expo-screen-orientation';

const ResizableHandle = ({ 
  onResize, 
  orientation,
  videoWidthPercentage,
  initialWidth = 70  // Добавляем параметр с начальным значением 70%
}) => {
  const startWidthRef = useRef(videoWidthPercentage);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: () => {
        // Запоминаем начальную ширину при старте жеста
        startWidthRef.current = videoWidthPercentage;
      },
      
      onPanResponderMove: (evt, gestureState) => {
        const isLandscape = 
          orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT ||
          orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT;

        if (isLandscape) {
          // Более точный и мягкий коэффициент
          const widthChangePercent = gestureState.dx * 0.05;  // Уменьшен коэффициент
          const newWidth = startWidthRef.current + widthChangePercent;
          const constrainedWidth = Math.min(Math.max(newWidth, 30), 90);
          
          onResize(constrainedWidth);
        }
      },
      
      onPanResponderRelease: () => {}
    })
  ).current;

  if (
    orientation !== ScreenOrientation.Orientation.LANDSCAPE_RIGHT && 
    orientation !== ScreenOrientation.Orientation.LANDSCAPE_LEFT
  ) {
    return null;
  }

  return (
    <View 
      {...panResponder.panHandlers}
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: 20,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <View style={{
        width: 5,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 2.5
      }} />
    </View>
  );
};

export default function App() {
  const [currentStream, setCurrentStream] = useState(null);
  const [audioSound, setAudioSound] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);
  const [videoWidthPercentage, setVideoWidthPercentage] = useState(null);

  // Загрузка сохраненной ширины при инициализации
  useEffect(() => {
    const loadVideoWidth = async () => {
      try {
        const storedWidth = await AsyncStorage.getItem('videoWidthPercentage');
        if (storedWidth !== null) {
          setVideoWidthPercentage(parseFloat(storedWidth));
        }
      } catch (error) {
        console.error('Ошибка загрузки ширины видео', error);
      }
    };

    loadVideoWidth();
  }, []);

  const [currentVideoWidth, setCurrentVideoWidth] = useState(70);
  const [initialWidth, setInitialWidth] = useState(70);

  const player = useVideoPlayer(currentStream?.type === 'video' ? currentStream.url : null, (player) => {
    player.loop = false;
    if (currentStream?.type === 'video') {
      player.play();
    }
  });

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });
        
        const defaultStream = streams[4]; // 5-й канал
        setCurrentStream(defaultStream);
      } catch (error) {
        console.error('Ошибка настройки аудио:', error);
        Alert.alert('Ошибка', `Не удалось настроить аудио: ${error.message}`);
      }
    };

    setupAudio();
  }, []);

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);
    });

    // Разрешаем автоматическое вращение экрана
    ScreenOrientation.unlockAsync();

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  const checkNetworkConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        Alert.alert('Ошибка сети', 'Отсутствует подключение к интернету');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Ошибка проверки сети:', error);
      return false;
    }
  };

  const playStream = async (stream) => {
    const isConnected = await checkNetworkConnection();
    if (!isConnected) return;

    try {
      // Остановка текущего потока, если выбран тот же
      if (currentStream && currentStream.url === stream.url) {
        if (stream.type === 'audio' && audioSound) {
          await audioSound.stopAsync();
          setAudioSound(null);
        } else if (stream.type === 'video') {
          player.pause();
        }
        setCurrentStream(null);
        return;
      }

      // Остановка предыдущего потока
      if (currentStream) {
        if (currentStream.type === 'audio' && audioSound) {
          await audioSound.stopAsync();
          await audioSound.unloadAsync();
        } else if (currentStream.type === 'video') {
          player.pause();
        }
      }

      // Воспроизведение аудио
      if (stream.type === 'audio') {
        const { sound } = await Audio.Sound.createAsync(
          { uri: stream.url },
          { 
            shouldPlay: true,
            isLooping: true,
            volume: 1.0
          }
        );

        setAudioSound(sound);
      } 
      // Воспроизведение видео
      else if (stream.type === 'video') {
        player.replace(stream.url);
        player.play();
      }

      setCurrentStream(stream);
    } catch (error) {
      console.error('Критическая ошибка воспроизведения:', error);
      Alert.alert('Ошибка', 'Не удалось воспроизвести поток');
      setCurrentStream(null);
    }
  };

  const getStyles = (orientation) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1a1a1a',
      flexDirection: orientation === ScreenOrientation.Orientation.PORTRAIT_UP ? 'column' : 'row'
    },
    channelList: {
      flex: orientation === ScreenOrientation.Orientation.PORTRAIT_UP ? 1 : 0,
      width: orientation === ScreenOrientation.Orientation.PORTRAIT_UP ? '100%' : `${100 - videoWidthPercentage}%`
    },
    channelListContent: {
      paddingVertical: 10
    },
    channelButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#2a2a2a',
      marginHorizontal: 10,
      marginVertical: 5,
      padding: 10,
      borderRadius: 10
    },
    activeChannelButton: {
      backgroundColor: '#3a3a3a'
    },
    channelLogo: {
      width: 50,
      height: 50,
      marginRight: 10,
      borderRadius: 25
    },
    channelInfo: {
      flex: 1
    },
    channelName: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold'
    },
    channelGroup: {
      color: '#888',
      fontSize: 12
    }
  });

  const getVideoStyle = () => {
    const isLandscape = 
      orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT ||
      orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT;
    
    // Если videoWidthPercentage не загружен, используем значение по умолчанию
    const currentWidth = videoWidthPercentage !== null ? videoWidthPercentage : 70;
    
    if (isLandscape) {
      return {
        width: `${currentWidth}%`,
        height: '100%'
      };
    }
    
    return {
      width: '100%',
      aspectRatio: 16 / 9
    };
  };

  const handleResize = useCallback(async (newWidth) => {
    try {
      // Сохраняем новую ширину в AsyncStorage
      await AsyncStorage.setItem('videoWidthPercentage', newWidth.toString());
      
      // Обновляем состояние
      setVideoWidthPercentage(newWidth);
      
      console.log('Resize', {
        newWidth: newWidth,
        orientation
      });
    } catch (error) {
      console.error('Ошибка сохранения ширины видео', error);
    }
  }, [orientation]);

  const streams = [
    { id: '01', name: 'RADİO NUR', group: 'Hidayet', country: 'TR', url: 'https://canli.hidayetradyolari.com/listen/radyo_nur/radio.mp3', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'audio' },
    { id: '02', name: 'MPL RADİO', group: 'Hidayet', country: 'TR', url: 'https://canli.hidayetradyolari.com/listen/mpl_radyo/radio.mp3', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'audio' },
    { id: '03', name: 'MPL TV', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/mpltv/mpltv/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '04', name: 'NUR TV', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/nurtv/nurtv/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '05', name: 'HERAN KURAN HERAN MUTLULUK', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/herankuran/herankuran/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '06', name: 'HERAN KURAN HERAN ZİKİR', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/heranzikir/heranzikir/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '07', name: 'KURAN LAFZI VE 7 RUHU', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/kuran/kuran/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '08', name: 'İBRAHİM TV ALMANCA', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/abraham/abraham/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '09', name: 'İBRAHİM TV İNGİLİZCE', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_en/hak_en/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '10', name: 'İBRAHİM TV RUSÇA', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_ru/hak_ru/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '11', name: 'İBRAHİM TV ARAPÇA', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_ar/hak_ar/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '12', name: 'İBRAHİM TV KÜRTÇE', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_kr/hak_kr/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '13', name: 'İBRAHİM TV FRANSIZCA', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_fr/hak_fr/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '14', name: 'İBRAHİM TV İSPANYOLCA', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_es/hak_es/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '15', name: 'İBRAHİM TV ÇİNCE', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_ch/hak_ch/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '16', name: 'İBRAHİM TV BULGARCA', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_bg/hak_bg/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '17', name: 'İBRAHİM TV FLEMENKÇE', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_ne/hak_ne/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' },
    { id: '18', name: 'İBRAHİM TV FARSÇA', group: 'Hidayet', country: 'TR', url: 'http://ibrahimiptv.com:1935/hak_fa/hak_fa/playlist.m3u8', logo: 'https://cdn-radiotime-logos.tunein.com/s105291d.png', type: 'video' }
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <View style={getStyles(orientation).container}>
        <View 
          style={[
            getVideoStyle(), 
            orientation !== ScreenOrientation.Orientation.PORTRAIT_UP && { 
              position: 'relative' 
            }
          ]}
        >
          <VideoView 
            style={{ width: '100%', height: '100%' }}
            player={player}
            allowsFullscreen
          />
          {orientation !== ScreenOrientation.Orientation.PORTRAIT_UP && videoWidthPercentage !== null && (
            <ResizableHandle 
              onResize={handleResize} 
              orientation={orientation} 
              videoWidthPercentage={videoWidthPercentage}
              initialWidth={70}
            />
          )}
        </View>
        
        <ScrollView 
          style={getStyles(orientation).channelList}
          contentContainerStyle={getStyles(orientation).channelListContent}
        >
          {streams.map((stream) => (
            <TouchableOpacity 
              key={stream.id} 
              style={[
                getStyles(orientation).channelButton, 
                currentStream?.url === stream.url && getStyles(orientation).activeChannelButton
              ]}
              onPress={() => playStream(stream)}
            >
              <Image 
                source={{ uri: stream.logo }} 
                style={getStyles(orientation).channelLogo} 
                resizeMode="contain"
              />
              <View style={getStyles(orientation).channelInfo}>
                <Text style={getStyles(orientation).channelName}>{stream.name}</Text>
                <Text style={getStyles(orientation).channelGroup}>{stream.group} | {stream.country}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
