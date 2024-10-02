import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AudioRecorder, AudioUtils } from 'react-native-audio';

const VoiceChatComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const audioPath = AudioUtils.DocumentDirectoryPath + '/voiceMessage.wav';

  const startRecording = async () => {
    setIsRecording(true);
    try {
      await AudioRecorder.requestAuthorization();
      await AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: 'High',
        AudioEncoding: 'wav'
      });
      await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    try {
      await AudioRecorder.stopRecording();
      // Burada kaydedilen sesi gönderebilir veya oynatabilirsiniz
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRecording && styles.recordingButton]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Kaydı Durdur' : 'Kaydı Başlat'}
        </Text>
      </TouchableOpacity>
      {isRecording && <Text style={styles.recordingText}>Kaydediliyor...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 20,
    backgroundColor: '#008CBA',
    borderRadius: 5,
  },
  recordingButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  recordingText: {
    marginTop: 10,
    color: '#f44336',
  },
});

export default VoiceChatComponent;