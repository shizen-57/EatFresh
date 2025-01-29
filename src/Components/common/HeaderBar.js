import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS, SPACING } from '../../theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HeaderBar({ 
  title, 
  onBack, 
  rightComponent,
  transparent,
  variant = 'default' // 'default' | 'large' | 'collapsed'
}) {
  const insets = useSafeAreaInsets();
  const isLarge = variant === 'large';

  return (
    <View style={[
      styles.container, 
      transparent && styles.transparentBg,
      { paddingTop: Platform.OS === 'ios' ? insets.top : SPACING.md }
    ]}>
      <View style={[
        styles.content,
        isLarge && styles.largeContent
      ]}>
        {onBack && (
          <TouchableOpacity 
            onPress={onBack} 
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="chevron-back" 
              size={28} 
              color={transparent ? COLORS.text.light : COLORS.text.primary} 
            />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          <Text style={[
            isLarge ? styles.largeTitle : styles.title,
            transparent && styles.lightText
          ]}>
            {title}
          </Text>
          {isLarge && (
            <Text style={[
              styles.subtitle,
              transparent && styles.lightText
            ]}>
              Explore what you want
            </Text>
          )}
        </View>

        {rightComponent && (
          <View style={styles.rightComponent}>
            {rightComponent}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  transparentBg: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 56,
  },
  largeContent: {
    minHeight: 80,
  },
  backButton: {
    marginRight: SPACING.sm,
    padding: SPACING.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  largeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
  lightText: {
    color: COLORS.text.light,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  rightComponent: {
    marginLeft: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  }
});
