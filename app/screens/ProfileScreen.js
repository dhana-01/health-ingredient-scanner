import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '../components/ScreenContainer';
import SettingsItem from '../components/SettingsItem';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { profile, updateProfile } = useUser();
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              // Navigation will be handled by AppNavigator auth state change
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen (to be implemented)
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  return (
    <ScreenContainer>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          <Image
            source={require('../assets/logo.png')} // Placeholder - replace with actual profile image
            style={styles.profileImage}
          />
          <Text style={styles.userName}>
            {profile?.full_name || 'User Name'}
          </Text>
          <Text style={styles.userEmail}>
            {profile?.email || 'user@example.com'}
          </Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={16} color={COLORS.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Settings Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <SettingsItem
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => Alert.alert('Change Password', 'Password change functionality coming soon!')}
          />
          
          <SettingsItem
            icon="shield-outline"
            label="Privacy Settings"
            onPress={() => Alert.alert('Privacy Settings', 'Privacy settings functionality coming soon!')}
          />
        </View>

        {/* App Preferences Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <SettingsItem
            icon="restaurant-outline"
            label="Dietary Restrictions"
            description="Manage your dietary preferences"
            onPress={() => Alert.alert('Dietary Restrictions', 'Dietary preferences functionality coming soon!')}
          />
          
          <SettingsItem
            icon="notifications-outline"
            label="Notifications"
            description="Configure alert preferences"
            onPress={() => Alert.alert('Notifications', 'Notification settings functionality coming soon!')}
          />
          
          <SettingsItem
            icon="moon-outline"
            label="Dark Mode"
            description="Toggle app theme"
            type="toggle"
            value={darkMode}
            onValueChange={setDarkMode}
          />
        </View>

        {/* Log Out Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl * 2, // Extra padding for bottom nav
  },
  userCard: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: SPACING.md,
  },
  userName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  userEmail: {
    color: COLORS.secondaryText,
    fontSize: 14,
    marginBottom: SPACING.lg,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
  },
  editButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  sectionCard: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  logoutButton: {
    backgroundColor: '#D9534F',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
