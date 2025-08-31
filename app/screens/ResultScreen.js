// File: app/screens/ResultScreen.js

import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HealthOverviewCard from '../components/HealthOverviewCard';
import IngredientCard from '../components/IngredientCard';
import StyledButton from '../components/StyledButton';

// Optional: Scans context if present; we'll create a lightweight fallback below if missing
import { useScans } from '../contexts/ScansContext';
import { supabase } from '../lib/supabase';

const COLORS = {
  appBg: '#000000',
  cardBg: '#0E1112',
  topCardBg: '#072621',
  primary: '#289484',
  muted: '#9CA3AF',
  white: '#FFFFFF',
  danger: '#D9534F',
  pillBg: '#0B1E1A',
};

const SPACING = { s: 8, m: 12, l: 16, xl: 20, xxl: 28 };

const DEFAULT_ANALYSIS = {
  beneficial: [
    { ingredient: 'Whey Protein Isolate', reason: 'A high-quality protein source, essential for muscle repair and growth.' },
  ],
  neutral: [
    { ingredient: 'Natural Flavors', reason: 'Derived from natural sources, may hide proprietary blends.' },
  ],
  harmful: [
    { ingredient: 'Sucralose', reason: 'Artificial sweeteners; some studies suggest concerns.' },
  ],
  summary: 'A protein bar with mixed health benefits.',
};

export default function ResultScreen({ route: propRoute, navigation: propNavigation }) {
  const route = propRoute || useRoute();
  const navigation = propNavigation || useNavigation();
  const { addScan } = useScans ? useScans() : { addScan: () => {} };
  const [isSaving, setIsSaving] = useState(false);

  const { analysis = DEFAULT_ANALYSIS, imageUrl = null, imageBase64 = null } = route.params || {};

  // Extract product name from analysis or use default
  const productName = analysis?.productName || 'Product';

  const computedScore = useMemo(() => {
    const b = (analysis?.beneficial || []).length;
    const h = (analysis?.harmful || []).length;
    return Math.max(0, Math.min(100, 50 + b * 6 - h * 8));
  }, [analysis]);

  const handleSave = async () => {
    if (!imageBase64) {
      Alert.alert('Error', 'Image data is missing. Cannot save scan.');
      return;
    }

    try {
      setIsSaving(true);

      // Ensure the analysis object includes the product name
      const analysisWithProductName = {
        ...analysis,
        productName: productName
      };

      console.log('Sending analysis with product name:', analysisWithProductName);

      // Call our new Edge Function to save the scan
      const { data: saveData, error: saveError } = await supabase.functions.invoke('save-scan-history', {
        body: { 
          analysis: analysisWithProductName, 
          imageBase64: imageBase64 
        },
      });

      if (saveError) {
        throw saveError;
      }

      // Show success message
      Alert.alert('Success!', 'Your scan has been saved to your history.');

      // Navigate to History screen
      navigation.navigate('MainTabs', { screen: 'History' });

    } catch (error) {
      console.error('Error saving scan:', error);
      
      // Check if it's an Edge Function error with a specific message
      let message;
      if (error?.data?.error) {
        message = error.data.error;
      } else {
        message = error?.message || 'Failed to save scan to history';
      }
      
      Alert.alert('Save Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  const beneficial = analysis?.beneficial || [];
  const neutral = analysis?.neutral || [];
  const harmful = analysis?.harmful || [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="chevron-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Results</Text>
          <View style={{ width: 22 }} />
        </View>
        <View style={styles.separator} />

        <View style={styles.imageWrap}>
          <ImageBackground
            source={imageUrl ? { uri: imageUrl } : undefined}
            style={styles.image}
            imageStyle={{ borderRadius: 14 }}
          >
            <View style={styles.overlay} />
            <View style={styles.imageFooter}>
              <Ionicons name="scan-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.imageTitle} numberOfLines={1}>{productName}</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={{ marginTop: -24 }}>
          <HealthOverviewCard analysis={analysis} score={computedScore} />
        </View>

        <Text style={styles.sectionTitle}>Ingredients Breakdown</Text>

        {beneficial.map((item, idx) => (
          <IngredientCard key={`b-${idx}`} title={item.ingredient} description={item.reason} tag="Beneficial" />
        ))}
        {neutral.map((item, idx) => (
          <IngredientCard key={`n-${idx}`} title={item.ingredient} description={item.reason} tag="Neutral" />
        ))}
        {harmful.map((item, idx) => (
          <IngredientCard key={`h-${idx}`} title={item.ingredient} description={item.reason} tag="Harmful" />
        ))}

        <View style={styles.alertCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.alertTitle}>Allergy Alert</Text>
            <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
          </View>
          <Text style={styles.alertBody}>Detected Allergens: Almonds, Milk. Please exercise caution.</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Understanding Ingredients</Text>
          <Text style={styles.infoBody}>
            Always check for added sugars and artificial ingredients. Natural alternatives are usually a better choice for long-term health.
          </Text>
          <Text style={styles.learnMore}>Learn More</Text>
        </View>

        <StyledButton 
          title={isSaving ? "Saving..." : "Save to History"} 
          onPress={handleSave} 
          style={{ marginTop: SPACING.xl, marginBottom: 24 }}
          disabled={isSaving}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.appBg,
  },
  content: {
    padding: SPACING.l,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    height: SPACING.s,
    backgroundColor: COLORS.cardBg,
    marginBottom: SPACING.l,
  },
  imageWrap: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: SPACING.l,
    height: 200,
  },
  image: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SPACING.l,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: SPACING.s,
  },
  imageTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: SPACING.xl,
    marginBottom: SPACING.m,
  },
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: SPACING.l,
    marginTop: SPACING.l,
  },
  infoTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoBody: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.s,
  },
  learnMore: {
    color: COLORS.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  alertCard: {
    backgroundColor: COLORS.pillBg,
    borderRadius: 12,
    padding: SPACING.l,
    marginTop: SPACING.l,
    marginBottom: SPACING.l,
  },
  alertTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alertBody: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});