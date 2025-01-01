import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  const [screen, setScreen] = useState('Home');

  const renderScreen = () => {
    switch(screen) {
      case 'Home':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Главный экран</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setScreen('Details')}
            >
              <Text style={styles.buttonText}>Перейти к деталям</Text>
            </TouchableOpacity>
          </View>
        );
      case 'Details':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Экран деталей</Text>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setScreen('Home')}
            >
              <Text style={styles.buttonText}>Назад</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4a4a4a',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  }
});
