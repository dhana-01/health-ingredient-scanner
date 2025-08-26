import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import StyledTextInput from '../components/StyledTextInput';
import StyledButton from '../components/StyledButton';
import { COLORS, SPACING } from '../constants/theme';
import ScreenContainer from '../components/ScreenContainer';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <ScreenContainer>
      <StyledTextInput label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" />
      <StyledTextInput label="Email" value={email} onChangeText={setEmail} placeholder="john.doe@example.com" />
      <StyledTextInput label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />
      <StyledTextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm your password" secureTextEntry />

      <View style={styles.termsRow}>
        <Switch value={agreed} onValueChange={setAgreed} thumbColor={agreed ? COLORS.primary : '#666'} />
        <Text style={styles.termsText}>I agree to the Terms of Service and Privacy Policy.</Text>
      </View>
      <StyledButton title="Create Account" variant="primary" onPress={() => {}} disabled={!agreed} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  termsText: {
    color: COLORS.secondaryText,
    marginLeft: SPACING.sm,
    flex: 1,
  },
});


