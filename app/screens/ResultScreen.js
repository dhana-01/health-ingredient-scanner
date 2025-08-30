import React, { useMemo } from 'react';
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
    { name: 'Whey Protein Isolate', desc: 'A high-quality protein source, essential for muscle repair and growth.' },
  ],
  neutral: [
    { name: 'Natural Flavors', desc: 'Derived from natural sources, may hide proprietary blends.' },
  ],
  harmful: [
    { name: 'Sucralose', desc: 'Artificial sweeteners; some studies suggest concerns.' },
  ],
};

export default function ResultScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { addScan } = useScans ? useScans() : { addScan: () => {} };

  const { analysis = DEFAULT_ANALYSIS, imageUrl = null, name = 'Product' } = route.params || {};

  const computedScore = useMemo(() => {
    const b = (analysis?.beneficial || []).length;
    const h = (analysis?.harmful || []).length;
    return Math.max(0, Math.min(100, 50 + b * 6 - h * 8));
  }, [analysis]);

  const handleSave = async () => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user?.id) {
        throw new Error('You must be signed in to save scans.');
      }

      const userId = userData.user.id;
      const rawText = route?.params?.rawText || analysis?.rawText || null;

      const { data: scanRow, error: scanError } = await supabase
        .from('scans')
        .insert({ user_id: userId, image_url: imageUrl || null, raw_text: rawText })
        .select('id')
        .single();

      if (scanError) {
        throw scanError;
      }

      const scanId = scanRow?.id;

      const payload = {
        scan_id: scanId,
        beneficial: analysis?.beneficial ?? [],
        neutral: analysis?.neutral ?? [],
        harmful: analysis?.harmful ?? [],
        summary: analysis?.summary ?? { score: computedScore },
      };

      const { error: analysisError } = await supabase
        .from('analysis_results')
        .insert(payload);

      if (analysisError) {
        throw analysisError;
      }

      const scan = {
        id: String(scanId ?? Date.now()),
        title: name || 'Scan result',
        image: imageUrl,
        analysis,
        score: computedScore,
        timeLabel: 'Just now',
      };
      try { addScan(scan); } catch (e) {}

      Alert.alert('Saved', 'Your scan has been saved to history.');
      navigation.navigate('History');
    } catch (err) {
      const message = err?.message || 'Failed to save scan';
      Alert.alert('Save Error', message);
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
              <Text style={styles.imageTitle} numberOfLines={1}>{name || 'Product'}</Text>
            </View>
          </ImageBackground>
        </View>

        <View style={{ marginTop: -24 }}>
          <HealthOverviewCard analysis={analysis} score={computedScore} />
        </View>

        <Text style={styles.sectionTitle}>Ingredients Breakdown</Text>

        {beneficial.map((item, idx) => (
          <IngredientCard key={`b-${idx}`} title={item.name} description={item.desc} tag="Beneficial" />
        ))}
        {neutral.map((item, idx) => (
          <IngredientCard key={`n-${idx}`} title={item.name} description={item.desc} tag="Neutral" />
        ))}
        {harmful.map((item, idx) => (
          <IngredientCard key={`h-${idx}`} title={item.name} description={item.desc} tag="Harmful" />
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

        <StyledButton title="Save to History" onPress={handleSave} style={{ marginTop: SPACING.xl, marginBottom: 24 }} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#111',
    marginVertical: SPACING.m,
  },
  imageWrap: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  image: {
    height: 200,
    width: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  imageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
  },
  imageTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: SPACING.xl,
    marginBottom: SPACING.m,
  },
  alertCard: {
    borderColor: COLORS.danger,
    borderWidth: 1,
    borderRadius: 12,
    padding: SPACING.l,
    marginTop: SPACING.l,
  },
  alertTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  alertBody: {
    color: COLORS.white,
    marginTop: 8,
    fontSize: 14,
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
    fontWeight: '800',
    marginBottom: 8,
  },
  infoBody: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  learnMore: {
    marginTop: 12,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});


