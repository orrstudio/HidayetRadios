import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, ScrollView, Image } from 'react-native';
import { Audio } from 'expo-av';
import { useVideoPlayer, VideoView } from 'expo-video';
import NetInfo from '@react-native-community/netinfo';

export default function App() {
  const [currentStream, setCurrentStream] = useState(null);
  const [audioSound, setAudioSound] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);

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

  return (
    <View style={styles.container}>
      <VideoView 
        style={currentStream?.type === 'video' ? styles.video : styles.audioPlayer}
        player={player}
        allowsFullscreen
      />
      
      <ScrollView 
        style={styles.channelList}
        contentContainerStyle={styles.channelListContent}
      >
        {streams.map((stream) => (
          <TouchableOpacity 
            key={stream.id} 
            style={[
              styles.channelButton, 
              currentStream?.url === stream.url && styles.activeChannelButton
            ]}
            onPress={() => playStream(stream)}
          >
            <Image 
              source={{ uri: stream.logo }} 
              style={styles.channelLogo} 
              resizeMode="contain"
            />
            <View style={styles.channelInfo}>
              <Text style={styles.channelName}>{stream.name}</Text>
              <Text style={styles.channelGroup}>{stream.group} | {stream.country}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a'
  },
  video: {
    width: '100%',
    height: 250,
    backgroundColor: 'black'
  },
  audioPlayer: {
    width: '100%',
    height: 250,
    backgroundColor: 'black'
  },
  channelList: {
    flex: 1
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
