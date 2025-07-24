import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  FileText,
  Upload,
  Download,
  Share,
  Edit3,
  Sparkles,
  Plus,
  Search,
  Filter,
} from 'lucide-react-native';

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'pdf' | 'docx' | 'txt';
  createdAt: Date;
  modifiedAt: Date;
  size: string;
}

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Meeting Notes',
      content: 'Important discussion points from today\'s meeting...',
      type: 'txt',
      createdAt: new Date('2024-01-15'),
      modifiedAt: new Date('2024-01-15'),
      size: '2.1 KB',
    },
    {
      id: '2',
      title: 'Project Proposal',
      content: 'Comprehensive project proposal for Q2 initiatives...',
      type: 'docx',
      createdAt: new Date('2024-01-14'),
      modifiedAt: new Date('2024-01-14'),
      size: '15.3 KB',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const pickDocument = async () => {
    Alert.alert('Upload Document', 'Document picker would open here');
  };

  const openDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setEditContent(doc.content);
    setIsEditing(false);
  };

  const saveDocument = () => {
    if (selectedDocument) {
      setDocuments(prev =>
        prev.map(doc =>
          doc.id === selectedDocument.id
            ? { ...doc, content: editContent, modifiedAt: new Date() }
            : doc
        )
      );
      setSelectedDocument({ ...selectedDocument, content: editContent });
      setIsEditing(false);
      Alert.alert('Success', 'Document saved successfully!');
    }
  };

  const enhanceWithAI = () => {
    Alert.alert(
      'AI Enhancement',
      'Choose enhancement type:',
      [
        { text: 'Grammar Check', onPress: () => console.log('Grammar check') },
        { text: 'Rephrase', onPress: () => console.log('Rephrase') },
        { text: 'Summarize', onPress: () => console.log('Summarize') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const exportDocument = () => {
    Alert.alert(
      'Export Document',
      'Choose export format:',
      [
        { text: 'PDF', onPress: () => console.log('Export PDF') },
        { text: 'DOCX', onPress: () => console.log('Export DOCX') },
        { text: 'TXT', onPress: () => console.log('Export TXT') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    return <FileText size={20} color="#6366F1" />;
  };

  if (selectedDocument) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#FAFBFF', '#F3F4F6']} style={styles.gradient}>
          {/* Document Header */}
          <View style={styles.documentHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedDocument(null)}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.documentTitle}>{selectedDocument.title}</Text>
            <View style={styles.documentActions}>
              <TouchableOpacity style={styles.actionButton} onPress={enhanceWithAI}>
                <Sparkles size={18} color="#8B5CF6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={exportDocument}>
                <Download size={18} color="#6366F1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Document Editor */}
          <ScrollView style={styles.editorContainer}>
            <BlurView intensity={50} style={styles.editorBlur}>
              <View style={styles.editorWrapper}>
                <View style={styles.editorToolbar}>
                  <TouchableOpacity
                    style={[styles.toolbarButton, isEditing && styles.toolbarButtonActive]}
                    onPress={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 size={16} color={isEditing ? '#FFFFFF' : '#6366F1'} />
                    <Text style={[styles.toolbarText, isEditing && styles.toolbarTextActive]}>
                      {isEditing ? 'Editing' : 'Edit'}
                    </Text>
                  </TouchableOpacity>
                  {isEditing && (
                    <TouchableOpacity style={styles.saveButton} onPress={saveDocument}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                <TextInput
                  style={[styles.documentContent, !isEditing && styles.documentContentReadOnly]}
                  value={editContent}
                  onChangeText={setEditContent}
                  multiline
                  editable={isEditing}
                  placeholder="Start writing your document..."
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </BlurView>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FAFBFF', '#F3F4F6']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Documents</Text>
            <Text style={styles.headerSubtitle}>{documents.length} documents</Text>
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <BlurView intensity={100} style={styles.searchBlur}>
            <View style={styles.searchWrapper}>
              <Search size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search documents..."
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={styles.filterButton}>
                <Filter size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={pickDocument}>
            <Upload size={20} color="#6366F1" />
            <Text style={styles.quickActionText}>Upload</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <FileText size={20} color="#8B5CF6" />
            <Text style={styles.quickActionText}>New Doc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Sparkles size={20} color="#EC4899" />
            <Text style={styles.quickActionText}>AI Generate</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Documents List */}
        <ScrollView style={styles.documentsContainer} showsVerticalScrollIndicator={false}>
          {filteredDocuments.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={styles.documentCard}
              onPress={() => openDocument(doc)}
            >
              <BlurView intensity={50} style={styles.cardBlur}>
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.fileIconContainer}>
                      {getFileIcon(doc.type)}
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{doc.title}</Text>
                      <Text style={styles.cardMeta}>
                        {doc.type.toUpperCase()} • {doc.size} • {doc.modifiedAt.toLocaleDateString()}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.cardAction}>
                      <Text style={styles.cardActionText}>Open</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardPreview} numberOfLines={2}>
                    {doc.content}
                  </Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          ))}
          
          {filteredDocuments.length === 0 && (
            <View style={styles.emptyState}>
              <FileText size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No documents found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Try a different search term' : 'Upload your first document to get started'}
              </Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  uploadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBlur: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    padding: 4,
  },
  quickActions: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  quickAction: {
    alignItems: 'center',
    marginRight: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    minWidth: 80,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  documentsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  documentCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  cardMeta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  cardAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 8,
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  cardPreview: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  // Document Editor Styles
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '600',
  },
  documentTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  documentActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editorContainer: {
    flex: 1,
    padding: 20,
  },
  editorBlur: {
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 400,
  },
  editorWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    minHeight: 400,
  },
  editorToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  toolbarButtonActive: {
    backgroundColor: '#6366F1',
  },
  toolbarText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  toolbarTextActive: {
    color: '#FFFFFF',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  documentContent: {
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    minHeight: 300,
    textAlignVertical: 'top',
  },
  documentContentReadOnly: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
});