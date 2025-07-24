import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  User,
  Bell,
  Shield,
  Palette,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Download,
  Trash2,
  Star,
} from 'lucide-react-native';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  color?: string;
}

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Logout') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Delete account') },
      ]
    );
  };

  const settingSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          title: 'Profile',
          subtitle: 'Manage your account information',
          icon: User,
          type: 'navigation',
          onPress: () => console.log('Profile'),
        },
        {
          id: 'subscription',
          title: 'Subscription',
          subtitle: 'Manage your premium subscription',
          icon: Star,
          type: 'navigation',
          onPress: () => console.log('Subscription'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'darkMode',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          icon: Moon,
          type: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          id: 'notifications',
          title: 'Notifications',
          subtitle: 'Receive push notifications',
          icon: Bell,
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          id: 'autoSave',
          title: 'Auto Save',
          subtitle: 'Automatically save documents',
          icon: Download,
          type: 'toggle',
          value: autoSave,
          onToggle: setAutoSave,
        },
        {
          id: 'language',
          title: 'Language',
          subtitle: 'English',
          icon: Globe,
          type: 'navigation',
          onPress: () => console.log('Language'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'privacy',
          title: 'Privacy Settings',
          subtitle: 'Control your data and privacy',
          icon: Shield,
          type: 'navigation',
          onPress: () => console.log('Privacy'),
        },
        {
          id: 'dataExport',
          title: 'Export Data',
          subtitle: 'Download your data',
          icon: Download,
          type: 'navigation',
          onPress: () => console.log('Export data'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          subtitle: 'Get help and support',
          icon: HelpCircle,
          type: 'navigation',
          onPress: () => console.log('Help'),
        },
        {
          id: 'about',
          title: 'About',
          subtitle: 'App version and information',
          icon: Info,
          type: 'navigation',
          onPress: () => console.log('About'),
        },
      ] as SettingItem[],
    },
    {
      title: 'Account Actions',
      items: [
        {
          id: 'logout',
          title: 'Sign Out',
          icon: LogOut,
          type: 'action',
          onPress: handleLogout,
          color: '#EF4444',
        },
        {
          id: 'delete',
          title: 'Delete Account',
          icon: Trash2,
          type: 'action',
          onPress: handleDeleteAccount,
          color: '#DC2626',
        },
      ] as SettingItem[],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, item.color && { backgroundColor: `${item.color}20` }]}>
          <item.icon size={20} color={item.color || '#6366F1'} />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, item.color && { color: item.color }]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {item.type === 'toggle' && (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
            thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
          />
        )}
        {item.type === 'navigation' && (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FAFBFF', '#F3F4F6']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Customize your Z AI experience</Text>
          </View>

          {/* User Profile Card */}
          <View style={styles.profileSection}>
            <BlurView intensity={50} style={styles.profileCard}>
              <View style={styles.profileContent}>
                <View style={styles.avatar}>
                  <User size={32} color="#6366F1" />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>John Doe</Text>
                  <Text style={styles.profileEmail}>john.doe@example.com</Text>
                  <View style={styles.profileBadge}>
                    <Text style={styles.profileBadgeText}>Free Plan</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* Settings Sections */}
          {settingSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <BlurView intensity={50} style={styles.sectionCard}>
                <View style={styles.sectionContent}>
                  {section.items.map((item, itemIndex) => (
                    <View key={item.id}>
                      {renderSettingItem(item)}
                      {itemIndex < section.items.length - 1 && (
                        <View style={styles.separator} />
                      )}
                    </View>
                  ))}
                </View>
              </BlurView>
            </View>
          ))}

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>Z AI v1.0.0</Text>
            <Text style={styles.appInfoText}>Made with ❤️ by Z AI Team</Text>
          </View>
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
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  profileEmail: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  profileBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 16,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginLeft: 72,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingBottom: 120,
  },
  appInfoText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});