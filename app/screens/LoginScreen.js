import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import StyledTextInput from '../components/StyledTextInput';
import StyledButton from '../components/StyledButton';
import SocialButton from '../components/SocialButton';
import { COLORS, SPACING } from '../constants/theme';
import ScreenContainer from '../components/ScreenContainer';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Logged in successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  return (
    <ScreenContainer>
      <StyledTextInput
        label="Email"
        placeholder="name@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <StyledTextInput
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <StyledButton title="Login" variant="primary" onPress={handleLogin} />
      <View style={{ height: SPACING.md }} />
      <SocialButton title="Continue with Google" />
      <SocialButton title="Continue with Apple" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
});


