import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  const [currentStream, setCurrentStream] = useState(null);
  const videoRef = useRef(null);

  const streams = [
    { 
      name: 'Hidayet Radyo', 
      url: 'https://canli.hidayetradyolari.com/listen/mpl_radyo/radio.mp3',
      type: 'audio'
    },
    { 
      name: 'Abraham TV', 
      url: 'http://ibrahimiptv.com:1935/hak_ru/hak_ru/playlist.m3u8',
      type: 'video'
    }
  ];

  const checkNetworkConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      console.log(' Состояние сети:', state);
      
      if (!state.isConnected) {
        Alert.alert('Ошибка сети', 'Отсутствует подключение к интернету');
        return false;
      }
      return true;
    } catch (error) {
      console.error(' Ошибка проверки сети:', error);
      return false;
    }
  };

  const testStreamAvailability = async (url) => {
    try {
      console.log(' Проверка доступности URL:', url);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут

      const response = await fetch(url, { 
        method: 'HEAD', 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': '*/*'
        }
      });

      clearTimeout(timeoutId);
      
      console.log(' Статус URL:', response.status);
      console.log(' Заголовки:', JSON.stringify(Object.fromEntries(response.headers), null, 2));
      
      return response.status === 200;
    } catch (error) {
      console.error(' Ошибка проверки URL:', error);
      return false;
    }
  };

  const playStream = async (stream) => {
    // Проверка сетевого подключения
    const isConnected = await checkNetworkConnection();
    if (!isConnected) return;

    // Проверка доступности потока
    const isStreamAvailable = await testStreamAvailability(stream.url);
    if (!isStreamAvailable) {
      Alert.alert(
        'Ошибка потока', 
        'Не удается получить доступ к потоку. Возможно, он недоступен.',
        [
          { text: 'Отмена' },
          { 
            text: 'Открыть в браузере', 
            onPress: () => Linking.openURL(stream.url).catch(err => 
              Alert.alert('Ошибка', 'Не удалось открыть URL в браузере')
            )
          }
        ]
      );
      return;
    }

    try {
      if (videoRef.current) {
        // Если текущий поток такой же - остановить
        if (currentStream && currentStream.url === stream.url) {
          await videoRef.current.stopAsync();
          setCurrentStream(null);
          return;
        }

        // Остановить предыдущий поток
        if (currentStream) {
          await videoRef.current.stopAsync();
        }

        setCurrentStream(stream);

        try {
          await videoRef.current.loadAsync(
            { 
              uri: stream.url,
              type: stream.type === 'video' ? 'hls' : undefined
            },
            { 
              shouldPlay: true,
              isLooping: false,
              androidImplementation: stream.type === 'video' ? 'ExoPlayer' : 'MediaPlayer'
            }
          );
        } catch (loadError) {
          console.error(' Ошибка загрузки потока:', loadError);
          Alert.alert(
            'Ошибка воспроизведения', 
            `Не удалось загрузить поток: ${loadError.message}`,
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error(' Критическая ошибка воспроизведения:', error);
      Alert.alert('Ошибка', 'Не удалось воспроизвести поток');
    }
  };

  return (
    <View style={styles.container}>
      {streams.map((stream, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.streamButton, 
            currentStream?.url === stream.url && styles.activeStreamButton
          ]}
          onPress={() => playStream(stream)}
        >
          <Text style={styles.streamButtonText}>{stream.name}</Text>
        </TouchableOpacity>
      ))}

      <Video
        ref={videoRef}
        style={currentStream?.type === 'video' ? styles.video : { width: 0, height: 0 }}
        source={{ 
          uri: currentStream?.url || '',
          type: currentStream?.type === 'video' ? 'hls' : undefined
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        shouldPlay={!!currentStream}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a'
  },
  streamButton: {
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10
  },
  activeStreamButton: {
    backgroundColor: '#2a2a2a'
  },
  streamButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  video: {
    width: '90%',
    height: 250,
    backgroundColor: 'black',
    marginTop: 20
  }
});
