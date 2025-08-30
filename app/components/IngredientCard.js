import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TYPE_STYLES = {
  Beneficial: { backgroundColor: '#1F6F54', label: 'Beneficial' },
  Harmful: { backgroundColor: '#C53B3B', label: 'Harmful' },
  Neutral: { backgroundColor: '#55585C', label: 'Neutral' },
};

export default function IngredientCard({ ingredient, reason, type = 'Neutral', title, description, tag }) {
  const finalTitle = title ?? ingredient;
  const finalDesc = description ?? reason;
  const finalTag = tag ?? type;
  const pillStyle = TYPE_STYLES[finalTag] || TYPE_STYLES.Neutral;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.ingredient} numberOfLines={2}>
          {finalTitle}
        </Text>
        <View style={[styles.pill, { backgroundColor: pillStyle.backgroundColor }]}>
          <Text style={styles.pillText}>{pillStyle.label}</Text>
        </View>
      </View>
      {!!finalDesc && (
        <Text style={styles.reason} numberOfLines={4}>
          {finalDesc}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2329',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ingredient: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  reason: {
    color: '#B7BDC3',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    minWidth: 70,
    alignItems: 'center',
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});


