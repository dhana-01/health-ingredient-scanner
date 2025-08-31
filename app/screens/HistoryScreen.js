import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import HistoryItem from '../components/HistoryItem';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { supabase } from '../lib/supabase';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [scans, setScans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const filters = [
    { id: 'All', label: 'All' },
    { id: 'Beneficial', label: 'Beneficial' },
    { id: 'Harmful', label: 'Harmful' },
    { id: 'Neutral', label: 'Neutral' },
  ];

  // Fetch history data from Supabase
  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch scans with analysis results
      const { data, error: fetchError } = await supabase
        .from('scans')
        .select(`
          *,
          analysis_results (
            beneficial,
            harmful,
            neutral,
            summary
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Process the data to determine status for filtering
      const processedScans = data?.map(scan => {
        const analysis = scan.analysis_results?.[0];
        let status = 'neutral';
        
        if (analysis) {
          if (analysis.harmful && analysis.harmful.length > 0) {
            status = 'harmful';
          } else if (analysis.beneficial && analysis.beneficial.length > 0) {
            status = 'beneficial';
          }
        }
        
        return {
          ...scan,
          status,
          // Format the date for display
          formattedDate: new Date(scan.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
      }) || [];

      setScans(processedScans);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchHistory();
    }, [])
  );

  // Pull to refresh handler
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  }, []);

  // Handler function for filter selection
  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
  };

  // Filter the data based on active filter and search query
  const filteredScans = useMemo(() => {
    let filtered = scans;

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
        item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.formattedDate?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activeFilter, searchQuery, scans]);

  const handleHistoryItemPress = (item) => {
    // Navigate to Result screen with the scan data
    navigation.navigate('Result', { 
      analysis: item.analysis_results?.[0] || {}, 
      imageUrl: item.image_url 
    });
  };

  const renderHistoryItem = ({ item }) => (
    <HistoryItem 
      item={item} 
      onPress={() => handleHistoryItemPress(item)}
    />
  );

  // Loading state
  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your scan history...</Text>
        </View>
      </ScreenContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={COLORS.danger} />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchHistory}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

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

        {/* History List or Empty State */}
        {filteredScans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="scan-outline" size={64} color={COLORS.secondaryText} />
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptyMessage}>Your scan history will appear here</Text>
          </View>
        ) : (
          <FlatList
            data={filteredScans}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          />
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loadingText: {
    marginTop: SPACING.sm,
    color: COLORS.secondaryText,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  errorMessage: {
    color: COLORS.secondaryText,
    fontSize: 16,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    color: COLORS.secondaryText,
    fontSize: 16,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
});
