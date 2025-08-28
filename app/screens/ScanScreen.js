import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScanScreen() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

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

  const handleCapture = async () => {
    try {
      if (cameraRef.current) {
        await cameraRef.current.takePictureAsync();
      }
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      {/* Top header and divider */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Scan</Text>
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

        {/* Shaded borders to simulate top/bottom framing */}
        <View style={styles.topShade} pointerEvents="none" />
        <View style={styles.bottomShade} pointerEvents="none" />

        {/* Capture button */}
        <View style={styles.bottomControls} pointerEvents="box-none">
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture} activeOpacity={0.8}>
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
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',
    borderWidth: 1,
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
