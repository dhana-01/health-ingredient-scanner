import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  appBg: '#000000',
  cardBg: '#0E1112',
  primary: '#289484',
  muted: '#9CA3AF',
  white: '#FFFFFF',
  danger: '#D9534F',
};

export default function HealthOverviewCard({ analysis = {}, score }) {
  const counts = useMemo(() => {
    const beneficial = (analysis.beneficial || []).length;
    const neutral = (analysis.neutral || []).length;
    const harmful = (analysis.harmful || []).length;
    return { beneficial, neutral, harmful };
  }, [analysis]);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.scoreBox}>
          <Text style={styles.score}>{score ?? 85}</Text>
          <Text style={styles.scoreDen}>/100</Text>
        </View>
        <View style={styles.list}>
          <View style={styles.itemRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.itemText}>{counts.beneficial} Beneficial Ingredients</Text>
          </View>
          <View style={styles.itemRow}>
            <Ionicons name="ellipse-outline" size={18} color={COLORS.muted} style={styles.icon} />
            <Text style={styles.itemText}>{counts.neutral} Neutral Ingredients</Text>
          </View>
          <View style={styles.itemRow}>
            <Ionicons name="close-circle-outline" size={18} color={COLORS.danger} style={styles.icon} />
            <Text style={styles.itemText}>{counts.harmful} Harmful Ingredients</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 16,
  },
  score: {
    color: COLORS.primary,
    fontSize: 44,
    fontWeight: '800',
  },
  scoreDen: {
    color: COLORS.muted,
    marginLeft: 4,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
    justifyContent: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  itemText: {
    color: COLORS.white,
    fontSize: 14,
  },
});


