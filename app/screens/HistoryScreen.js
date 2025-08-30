import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import HistoryItem from '../components/HistoryItem';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Dummy data for history items
  const dummyHistoryData = [
    {
      id: '1',
      name: 'Organic Almond Milk',
      date: 'October 26, 2023',
      status: 'beneficial',
      category: 'dairy',
      image: require('../assets/icon.png'),
    },
    {
      id: '2',
      name: 'Whole Grain Bread',
      date: 'October 25, 2023',
      status: 'beneficial',
      category: 'grains',
      image: require('../assets/adaptive-icon.png'),
    },
    {
      id: '3',
      name: 'Protein Bar, Chocolate',
      date: 'October 24, 2023',
      status: 'neutral',
      category: 'snacks',
      image: require('../assets/splash-icon.png'),
    },
    {
      id: '4',
      name: 'Natural Greek Yogurt',
      date: 'October 23, 2023',
      status: 'beneficial',
      category: 'dairy',
      image: require('../assets/logo.png'),
    },
    {
      id: '5',
      name: 'Sparkling Water',
      date: 'October 22, 2023',
      status: 'neutral',
      category: 'beverages',
      image: require('../assets/icon.png'),
    },
    {
      id: '6',
      name: 'Organic Honey Oats',
      date: 'October 21, 2023',
      status: 'beneficial',
      category: 'grains',
      image: require('../assets/adaptive-icon.png'),
    },
    {
      id: '7',
      name: 'Fresh Avocados (2)',
      date: 'October 20, 2023',
      status: 'beneficial',
      category: 'produce',
      image: require('../assets/splash-icon.png'),
    },
    {
      id: '8',
      name: 'High-Fructose Corn Syrup',
      date: 'October 19, 2023',
      status: 'harmful',
      category: 'sweeteners',
      image: require('../assets/logo.png'),
    },
    {
      id: '9',
      name: 'Hydrogenated Vegetable Oil',
      date: 'October 18, 2023',
      status: 'harmful',
      category: 'oils',
      image: require('../assets/icon.png'),
    },
  ];

  const filters = [
    { id: 'All', label: 'All' },
    { id: 'Beneficial', label: 'Beneficial' },
    { id: 'Harmful', label: 'Harmful' },
    { id: 'Neutral', label: 'Neutral' },
  ];

  // Handler function for filter selection
  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
  };

  // Filter the data based on active filter and search query
  const filteredScans = useMemo(() => {
    let filtered = dummyHistoryData;

    // Apply status filter using switch statement
    switch (activeFilter) {
      case 'All':
        // Return all scans
        break;
      case 'Beneficial':
        // Return only scans where item.status === 'beneficial'
        filtered = filtered.filter(item => item.status === 'beneficial');
        break;
      case 'Harmful':
        // Return only scans where item.status === 'harmful'
        filtered = filtered.filter(item => item.status === 'harmful');
        break;
      case 'Neutral':
        // Return scans that have neutral status but no harmful ones
        filtered = filtered.filter(item => item.status === 'neutral');
        break;
      default:
        break;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  const handleHistoryItemPress = (item) => {
    // Navigate to Result screen with the scan data
    navigation.navigate('Result', { 
      analysis: {
        beneficial: item.status === 'beneficial' ? [{ name: item.name, desc: 'Good for health' }] : [],
        neutral: item.status === 'neutral' ? [{ name: item.name, desc: 'Neutral ingredient' }] : [],
        harmful: item.status === 'harmful' ? [{ name: item.name, desc: 'May be harmful' }] : [],
      },
      imageUrl: item.image,
      name: item.name
    });
  };



  const renderHistoryItem = ({ item }) => (
    <HistoryItem 
      item={item} 
      onPress={() => handleHistoryItemPress(item)}
    />
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {/* Header */}
        <ScreenHeader title="History" />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.secondaryText} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search past scans..."
            placeholderTextColor={COLORS.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Pills */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterPill,
                activeFilter === filter.id && styles.filterPillActive
              ]}
              onPress={() => handleFilterSelect(filter.id)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.id && styles.filterTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredScans.length} scan{filteredScans.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {/* History List */}
        <FlatList
          data={filteredScans}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    height: 48,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    marginLeft: SPACING.sm,
  },
  filtersContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  filterPill: {
    backgroundColor: '#2C2C2E',    // Dark gray for inactive chips
    borderRadius: 20,              // High borderRadius for pill shape
    paddingHorizontal: SPACING.lg, // Horizontal space for the text
    marginRight: SPACING.sm,       // Space between pills
    height: 40,                    // *** FIX #2: Set a fixed height ***
    justifyContent: 'center',      // Center the text vertically
    alignItems: 'center',          // Center the text horizontally
  },
  filterPillActive: {
    backgroundColor: COLORS.primary, // Solid green for active state
  },
  filterText: {
    color: COLORS.white,           // *** FIX #1: Text is ALWAYS white ***
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white, // This style is now redundant but harmless. Text is always white.
  },
  resultsContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  resultsText: {
    color: COLORS.secondaryText,
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: SPACING.xl * 2, // Extra padding for bottom nav
  },
});
