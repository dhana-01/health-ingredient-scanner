import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch, Alert, ScrollView } from 'react-native';
import StyledTextInput from '../components/StyledTextInput';
import StyledButton from '../components/StyledButton';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import ScreenContainer from '../components/ScreenContainer';
import { supabase } from '../lib/supabase';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Account created successfully! Please check your email for verification.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ScreenContainer>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <StyledTextInput 
          label="Full Name" 
          value={fullName} 
          onChangeText={setFullName} 
          placeholder="John Doe" 
          autoCapitalize="words"
        />
        <StyledTextInput 
          label="Email" 
          value={email} 
          onChangeText={setEmail} 
          placeholder="john.doe@example.com" 
        />
        <StyledTextInput 
          label="Password" 
          value={password} 
          onChangeText={setPassword} 
          placeholder="Enter your password" 
          secureTextEntry 
        />
        <StyledTextInput 
          label="Confirm Password" 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
          placeholder="Confirm your password" 
          secureTextEntry 
        />

        <View style={styles.termsRow}>
          <Switch 
            value={agreed} 
            onValueChange={setAgreed} 
            thumbColor={agreed ? COLORS.primary : '#666'}
            trackColor={{ false: '#333', true: COLORS.primary + '40' }}
          />
          <Text style={styles.termsText}>I agree to the Terms of Service and Privacy Policy.</Text>
        </View>
        
        <StyledButton 
          title="Create Account" 
          variant="primary" 
          onPress={handleSignUp} 
          disabled={!agreed} 
        />
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  termsText: {
    color: COLORS.secondaryText,
    marginLeft: SPACING.md,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});


