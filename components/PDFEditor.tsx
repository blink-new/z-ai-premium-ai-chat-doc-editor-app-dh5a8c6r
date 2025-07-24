import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  FileText,
  Edit3,
  Highlighter,
  Type,
  Square,
  Circle,
  ArrowRight,
  Trash2,
  Download,
  Share,
  ZoomIn,
  ZoomOut,
  RotateCw,
  X,
  Plus,
  Minus,
  Save,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface PDFEditorProps {
  pdfUri: string;
  onSave: (annotations: Annotation[]) => void;
  onClose: () => void;
}

interface Annotation {
  id: string;
  type: 'highlight' | 'text' | 'shape' | 'arrow';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  page: number;
}

const ANNOTATION_COLORS = [
  '#FBBF24', // Yellow
  '#34D399', // Green
  '#60A5FA', // Blue
  '#F87171', // Red
  '#A78BFA', // Purple
  '#FB7185', // Pink
];

const ANNOTATION_TOOLS = [
  { id: 'highlight', icon: Highlighter, label: 'Highlight' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'rectangle', icon: Square, label: 'Rectangle' },
  { id: 'circle', icon: Circle, label: 'Circle' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
];

export function PDFEditor({ pdfUri, onSave, onClose }: PDFEditorProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('highlight');
  const [selectedColor, setSelectedColor] = useState(ANNOTATION_COLORS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5); // Mock total pages
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
  const [textInputValue, setTextInputValue] = useState('');

  const handlePageTouch = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    
    if (selectedTool === 'text') {
      setTextInputPosition({ x: locationX, y: locationY });
      setShowTextInput(true);
      return;
    }

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: selectedTool as any,
      x: locationX,
      y: locationY,
      color: selectedColor,
      page: currentPage,
      width: selectedTool === 'highlight' ? 100 : 50,
      height: selectedTool === 'highlight' ? 20 : 50,
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addTextAnnotation = () => {
    if (!textInputValue.trim()) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: 'text',
      x: textInputPosition.x,
      y: textInputPosition.y,
      text: textInputValue,
      color: selectedColor,
      page: currentPage,
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setShowTextInput(false);
    setTextInputValue('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const deleteAnnotation = (annotationId: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== annotationId));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const changePage = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const changeZoom = (direction: 'in' | 'out') => {
    if (direction === 'in' && zoomLevel < 3) {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    } else if (direction === 'out' && zoomLevel > 0.5) {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = () => {
    onSave(annotations);
    Alert.alert('Saved', 'PDF annotations have been saved successfully!');
  };

  const handleExport = () => {
    Alert.alert(
      'Export PDF',
      'Choose export option:',
      [
        { text: 'Save to Files', onPress: () => console.log('Save to Files') },
        { text: 'Share', onPress: () => console.log('Share PDF') },
        { text: 'Email', onPress: () => console.log('Email PDF') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const currentPageAnnotations = annotations.filter(a => a.page === currentPage);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BlurView intensity={100} style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#374151" />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <FileText size={20} color="#6366F1" />
              <Text style={styles.headerTitle}>PDF Editor</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
                <Save size={18} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleExport}>
                <Share size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>

      {/* PDF Viewer */}
      <ScrollView 
        style={styles.pdfContainer}
        contentContainerStyle={styles.pdfContent}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={3}
        minimumZoomScale={0.5}
        zoomScale={zoomLevel}
      >
        <TouchableOpacity
          style={[
            styles.pdfPage,
            {
              transform: [{ scale: zoomLevel }],
            },
          ]}
          onPress={handlePageTouch}
          activeOpacity={1}
        >
          {/* Mock PDF Page */}
          <View style={styles.mockPdfContent}>
            <Text style={styles.mockTitle}>Document Title - Page {currentPage}</Text>
            <Text style={styles.mockText}>
              This is a sample PDF document that demonstrates the PDF editing capabilities.
              You can add highlights, text annotations, shapes, and arrows to mark up the content.
              
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris.
              
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </Text>
          </View>

          {/* Render Annotations */}
          {currentPageAnnotations.map((annotation) => (
            <View
              key={annotation.id}
              style={[
                styles.annotation,
                {
                  left: annotation.x,
                  top: annotation.y,
                  width: annotation.width,
                  height: annotation.height,
                  backgroundColor: annotation.type === 'highlight' 
                    ? `${annotation.color}40` 
                    : 'transparent',
                  borderColor: annotation.color,
                  borderWidth: annotation.type !== 'highlight' && annotation.type !== 'text' ? 2 : 0,
                  borderRadius: annotation.type === 'circle' ? 25 : 0,
                },
              ]}
            >
              {annotation.type === 'text' && (
                <Text style={[styles.annotationText, { color: annotation.color }]}>
                  {annotation.text}
                </Text>
              )}
              <TouchableOpacity
                style={styles.deleteAnnotation}
                onPress={() => deleteAnnotation(annotation.id)}
              >
                <Trash2 size={12} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
        </TouchableOpacity>
      </ScrollView>

      {/* Text Input Modal */}
      {showTextInput && (
        <View style={styles.textInputModal}>
          <BlurView intensity={100} style={styles.textInputBlur}>
            <View style={styles.textInputContent}>
              <Text style={styles.textInputTitle}>Add Text Annotation</Text>
              <TextInput
                style={styles.textInput}
                value={textInputValue}
                onChangeText={setTextInputValue}
                placeholder="Enter your annotation..."
                multiline
                autoFocus
              />
              <View style={styles.textInputActions}>
                <TouchableOpacity
                  style={styles.textInputButton}
                  onPress={() => setShowTextInput(false)}
                >
                  <Text style={styles.textInputButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.textInputButton, styles.textInputButtonPrimary]}
                  onPress={addTextAnnotation}
                >
                  <Text style={styles.textInputButtonTextPrimary}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      )}

      {/* Bottom Toolbar */}
      <View style={styles.toolbar}>
        <BlurView intensity={100} style={styles.toolbarBlur}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolbarContent}
          >
            {/* Annotation Tools */}
            <View style={styles.toolSection}>
              {ANNOTATION_TOOLS.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <TouchableOpacity
                    key={tool.id}
                    style={[
                      styles.toolButton,
                      selectedTool === tool.id && styles.toolButtonActive,
                    ]}
                    onPress={() => {
                      setSelectedTool(tool.id);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                  >
                    <IconComponent 
                      size={18} 
                      color={selectedTool === tool.id ? '#FFFFFF' : '#6366F1'} 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.toolDivider} />

            {/* Color Palette */}
            <View style={styles.toolSection}>
              {ANNOTATION_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && styles.colorButtonActive,
                  ]}
                  onPress={() => {
                    setSelectedColor(color);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                />
              ))}
            </View>

            <View style={styles.toolDivider} />

            {/* Zoom Controls */}
            <View style={styles.toolSection}>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => changeZoom('out')}
              >
                <ZoomOut size={18} color="#6366F1" />
              </TouchableOpacity>
              <Text style={styles.zoomText}>{Math.round(zoomLevel * 100)}%</Text>
              <TouchableOpacity
                style={styles.toolButton}
                onPress={() => changeZoom('in')}
              >
                <ZoomIn size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </BlurView>
      </View>

      {/* Page Navigation */}
      <View style={styles.pageNavigation}>
        <BlurView intensity={100} style={styles.pageNavBlur}>
          <View style={styles.pageNavContent}>
            <TouchableOpacity
              style={[styles.pageNavButton, currentPage === 1 && styles.pageNavButtonDisabled]}
              onPress={() => changePage('prev')}
              disabled={currentPage === 1}
            >
              <Minus size={16} color={currentPage === 1 ? '#9CA3AF' : '#6366F1'} />
            </TouchableOpacity>
            
            <Text style={styles.pageInfo}>
              {currentPage} / {totalPages}
            </Text>
            
            <TouchableOpacity
              style={[styles.pageNavButton, currentPage === totalPages && styles.pageNavButtonDisabled]}
              onPress={() => changePage('next')}
              disabled={currentPage === totalPages}
            >
              <Plus size={16} color={currentPage === totalPages ? '#9CA3AF' : '#6366F1'} />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    paddingTop: 50,
    zIndex: 100,
  },
  headerBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  pdfContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pdfPage: {
    width: width - 40,
    minHeight: 600,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  mockPdfContent: {
    padding: 24,
  },
  mockTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  mockText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
    textAlign: 'justify',
  },
  annotation: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  annotationText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteAnnotation: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textInputModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 200,
  },
  textInputBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '80%',
    maxWidth: 300,
  },
  textInputContent: {
    padding: 20,
  },
  textInputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  textInputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  textInputButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    alignItems: 'center',
  },
  textInputButtonPrimary: {
    backgroundColor: '#6366F1',
  },
  textInputButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  textInputButtonTextPrimary: {
    color: '#FFFFFF',
  },
  toolbar: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
  toolbarBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  toolbarContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toolSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolButtonActive: {
    backgroundColor: '#6366F1',
  },
  toolDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 12,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: '#374151',
  },
  zoomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
    marginHorizontal: 8,
    minWidth: 40,
    textAlign: 'center',
  },
  pageNavigation: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  pageNavBlur: {
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  pageNavContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  pageNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNavButtonDisabled: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    minWidth: 60,
    textAlign: 'center',
  },
});