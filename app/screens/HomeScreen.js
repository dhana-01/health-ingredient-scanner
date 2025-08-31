import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { useUser } from '../context/UserContext';
import ScanCard from '../components/ScanCard';
import ScreenHeader from '../components/ScreenHeader';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const { profile, user, refreshProfile } = useUser();
  const navigation = useNavigation();

  // Debug: Log the profile data to see what's available
  console.log('HomeScreen - Profile data:', profile);
  console.log('HomeScreen - User data:', user);
  console.log('HomeScreen - Profile first_name:', profile?.first_name);
  console.log('HomeScreen - Profile full_name:', profile?.full_name);
  console.log('HomeScreen - User metadata full_name:', user?.user_metadata?.full_name);

  // Get the user's name from profile or user metadata
  const getUserName = () => {
    // Try profile fields first
    if (profile?.first_name) return profile.first_name;
    if (profile?.full_name) return profile.full_name;
    
    // Fallback to user metadata (from signup)
    if (user?.user_metadata?.full_name) {
      const fullName = user.user_metadata.full_name;
      // Extract first name from full name
      return fullName.split(' ')[0];
    }
    
    return 'User';
  };

  const userName = getUserName();

  // Refresh profile when component mounts to ensure we have the latest data
  React.useEffect(() => {
    if (user && !profile?.first_name && !profile?.full_name) {
      console.log('HomeScreen: Refreshing profile to get user name');
      refreshProfile();
    }
  }, [user, profile, refreshProfile]);

  // Dummy data for recent scans
  const recentScans = [
    {
      id: '1',
      imageSource: require('../assets/protein.jpeg'),
      productName: 'Protein Bar Pro',
      timestamp: '2 hours ago',
      healthScore: 85,
    },
    {
      id: '2',
      imageSource: require('../assets/organic.jpg'),
      productName: 'Organic Granola',
      timestamp: '1 day ago',
      healthScore: 92,
    },
    {
      id: '3',
      imageSource: require('../assets/bread.jpg'),
      productName: 'Whole Grain Bread',
      timestamp: '3 days ago',
      healthScore: 78,
    },
    {
      id: '4',
      imageSource: require('../assets/avacado.jpeg'),
      productName: 'Fresh Avocado',
      timestamp: '1 week ago',
      healthScore: 95,
    },
  ];

  const handleQuickScan = () => {
    navigation.navigate('Scan');
  };

  const handleSeeAll = () => {
    navigation.navigate('History');
  };



  const renderScanCard = ({ item }) => (
    <ScanCard
      imageSource={item.imageSource}
      productName={item.productName}
      timestamp={item.timestamp}
      healthScore={item.healthScore}
    />
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header Title and Divider */}
      <View style={styles.headerContainer}>
        <ScreenHeader title="Home" />
        <View style={styles.headerDivider} />
      </View>

      {/* Top Container with Greeting and Quick Scan */}
      <View style={styles.topContainer}>
        <Text style={styles.greeting}>Hello, {userName} !</Text>
        <Text style={styles.subtitle}>Ready to discover what's in your food?</Text>

        <TouchableOpacity style={styles.quickScanButton} onPress={handleQuickScan}>
          <Ionicons name="scan-outline" size={22} color="white" style={styles.scanIcon} />
          <Text style={styles.quickScanText}>Quick Scan</Text>
        </TouchableOpacity>


      </View>

      {/* Recent Scans Section */}
      <View style={styles.recentScansSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAllLink}>See All →</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={recentScans}
          renderItem={renderScanCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scanListContainer}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 40,
  },
  headerContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#2C2C2E',
    width: '100%',
  },
  topContainer: {
    backgroundColor: '#072621',
    borderRadius: 20,
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: '#D0D0D0',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  quickScanButton: {
    backgroundColor: '#289484',
    borderRadius: 999,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanIcon: {
    marginRight: SPACING.sm,
  },
  quickScanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  recentScansSection: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  seeAllLink: {
    color: '#289484',
    fontSize: 16,
    fontWeight: '600',
  },
  scanListContainer: {
    paddingRight: SPACING.md,
  },
});
