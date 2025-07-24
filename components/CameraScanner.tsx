import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Camera,
  X,
  FlashOn,
  FlashOff,
  RotateCcw,
  CheckCircle,
  ScanLine,
  FileText,
  Image as ImageIcon,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface CameraScannerProps {
  onScanComplete: (text: string, imageUri?: string) => void;
  onClose: () => void;
  scanMode: 'document' | 'text' | 'business-card';
}

export function CameraScanner({ onScanComplete, onClose, scanMode }: CameraScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedText, setScannedText] = useState('');
  const cameraRef = useRef<any>(null);

  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    // In a real app, you would request camera permissions here
    // For demo purposes, we'll simulate permission granted
    setHasPermission(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    setIsScanning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      // Simulate camera capture and OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let mockText = '';
      switch (scanMode) {
        case 'document':
          mockText = `SCANNED DOCUMENT

This is a sample document that has been scanned using the camera. The OCR technology has successfully extracted the text content from the image.

Key features:
• High accuracy text recognition
• Support for multiple languages
• Automatic formatting detection
• Edge enhancement for better quality

The document scanning feature can handle various types of documents including contracts, receipts, notes, and printed materials.`;
          break;
        case 'text':
          mockText = 'This is sample text that was captured from the camera using OCR technology. The text recognition is highly accurate and supports multiple languages.';
          break;
        case 'business-card':
          mockText = `John Smith
Senior Software Engineer
Tech Solutions Inc.

Phone: +1 (555) 123-4567
Email: john.smith@techsolutions.com
Website: www.techsolutions.com
Address: 123 Tech Street, Silicon Valley, CA 94000`;
          break;
      }

      setScannedText(mockText);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Auto-close and return scanned text after a brief delay
      setTimeout(() => {
        onScanComplete(mockText, 'mock-image-uri');
      }, 1000);
      
    } catch (error) {
      Alert.alert('Scan Failed', 'Unable to scan the document. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsScanning(false);
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getScanModeInfo = () => {
    switch (scanMode) {
      case 'document':
        return {
          title: 'Document Scanner',
          subtitle: 'Position document within the frame',
          icon: <FileText size={24} color="#6366F1" />,
        };
      case 'text':
        return {
          title: 'Text Scanner',
          subtitle: 'Point camera at text to extract',
          icon: <ScanLine size={24} color="#8B5CF6" />,
        };
      case 'business-card':
        return {
          title: 'Business Card Scanner',
          subtitle: 'Align business card in the frame',
          icon: <ImageIcon size={24} color="#EC4899" />,
        };
    }
  };

  const modeInfo = getScanModeInfo();

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission denied</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera View Simulation */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraView}>
          {/* Scanning Overlay */}
          <View style={styles.scanOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {isScanning && (
                <View style={styles.scanningIndicator}>
                  <ScanLine size={32} color="#6366F1" />
                  <Text style={styles.scanningText}>Scanning...</Text>
                </View>
              )}
              
              {scannedText && (
                <View style={styles.successIndicator}>
                  <CheckCircle size={32} color="#10B981" />
                  <Text style={styles.successText}>Scan Complete!</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <BlurView intensity={100} style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              {modeInfo.icon}
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>{modeInfo.title}</Text>
                <Text style={styles.headerSubtitle}>{modeInfo.subtitle}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              {flashEnabled ? (
                <FlashOn size={24} color="#F59E0B" />
              ) : (
                <FlashOff size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <BlurView intensity={100} style={styles.controlsBlur}>
          <View style={styles.controlsContent}>
            <TouchableOpacity style={styles.controlButton}>
              <ImageIcon size={24} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.captureButton, isScanning && styles.captureButtonActive]}
              onPress={takePicture}
              disabled={isScanning}
            >
              <View style={styles.captureButtonInner}>
                <Camera size={32} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <RotateCcw size={24} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Rotate</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <BlurView intensity={80} style={styles.instructionsBlur}>
          <Text style={styles.instructionsText}>
            {scanMode === 'document' && 'Align document edges with the frame for best results'}
            {scanMode === 'text' && 'Ensure text is clear and well-lit for accurate recognition'}
            {scanMode === 'business-card' && 'Place business card flat within the scanning area'}
          </Text>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraContainer: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.8,
    height: height * 0.4,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#6366F1',
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  scanningIndicator: {
    alignItems: 'center',
    gap: 8,
  },
  scanningText: {
    color: '#6366F1',
    fontSize: 16,
    fontWeight: '600',
  },
  successIndicator: {
    alignItems: 'center',
    gap: 8,
  },
  successText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
  },
  headerBlur: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerText: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },
  controlsBlur: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controlsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  controlButton: {
    alignItems: 'center',
    gap: 8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  captureButtonActive: {
    backgroundColor: '#EF4444',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
  },
  instructionsBlur: {
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  instructionsText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    padding: 12,
    lineHeight: 18,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  permissionButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});