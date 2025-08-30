import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { BlurView } from 'expo-blur';
import ScreenHeader from '../components/ScreenHeader';

export default function ScanScreen() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleTakePicture = async () => {
    try {
      setIsLoading(true);

      if (!cameraRef.current) {
        throw new Error('Camera is not ready');
      }

      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8, base64: true });
      if (!photo?.base64) {
        throw new Error('Failed to capture image');
      }

      console.log('1. Picture taken successfully. Base64 length:', photo.base64.length);

      // Step 1: Get AI analysis
      console.log('2. Calling analyze-ingredient-image function...');
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-ingredient-image', {
        body: { imageBase64: photo.base64 },
      });

      if (analysisError) {
        throw analysisError;
      }

      console.log('3. Analysis received successfully');

      // Step 2: Save to history
      console.log('4. Calling save-scan-history function...');
      const { data: saveData, error: saveError } = await supabase.functions.invoke('save-scan-history', {
        body: { 
          analysis: analysisData, 
          imageBase64: photo.base64 
        },
      });

      if (saveError) {
        throw saveError;
      }

      console.log('5. Scan saved successfully');

      // Navigate to Result screen
      navigation.navigate('Result', { 
        analysis: analysisData, 
        imageBase64: photo.base64 
      });

    } catch (error) {
      console.error('An error occurred in handleTakePicture:', error);
      
      // Check if it's an Edge Function error with a specific message
      let message;
      if (error?.data?.error) {
        message = error.data.error;
      } else {
        message = error?.message || 'Something went wrong while analyzing the image';
      }
      
      Alert.alert('Scan Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top header and divider */}
      <View style={styles.headerBar}>
        <ScreenHeader title="Scan" />
      </View>
      <View style={styles.headerDivider} />

      {/* Instruction text */}
      <View style={styles.instructionWrapper}>
        <Text style={styles.instructionText}>Align product label within the frame</Text>
      </View>

      {/* Framed camera area */}
      <View style={styles.cameraFrame}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          enableTorch={false}
          zoom={0}
        />

        {isLoading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <BlurView intensity={40} tint="dark" style={styles.blurFill} />
            <View style={styles.loaderContent}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Analyzing...</Text>
            </View>
          </View>
        )}

        {/* Shaded borders to simulate top/bottom framing */}
        <View style={styles.topShade} pointerEvents="none" />
        <View style={styles.bottomShade} pointerEvents="none" />

        {/* Capture button */}
        <View style={styles.bottomControls} pointerEvents="box-none">
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture} activeOpacity={0.8} disabled={isLoading}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBar: {
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerDivider: {
    height: 2,
    backgroundColor: '#289484',
    opacity: 0.6,
  },
  instructionWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  instructionText: {
    color: '#A9A9A9',
    fontSize: 14,
  },
  cameraFrame: {
    flex: 1,
    marginHorizontal: 12,
    marginTop: 20, // Add more padding from the top
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
    borderWidth: 0.5, // Reduce border from 1 to 0.5
    borderColor: '#1f1f1f',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  topShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bottomShade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#C8CDD0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E6EEF2',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurFill: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContent: {
    position: 'absolute',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionText: {
    color: '#FFFFFF',
    marginBottom: 12,
    fontSize: 16,
  },
  permissionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#289484',
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
