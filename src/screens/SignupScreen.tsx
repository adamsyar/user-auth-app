import { useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../auth/AuthContext';
import { validateSignup } from '../auth/validation';
import type { FieldErrors, SignupInput } from '../auth/types';
import { Screen } from '../components/Screen';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { common } from '../theme/theme';
export function SignupScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Signup'>) {
  const { signup, isLoading } = useAuth();
  const [form, setForm] = useState<SignupInput>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  function change(field: keyof SignupInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setError('');
  }
  async function submit() {
    if (isLoading) return;
    const issues = validateSignup(form);
    setErrors(issues);
    setError('');
    if (Object.keys(issues).length) return;
    Keyboard.dismiss();
    try {
      await signup(form);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to sign up. Please try again.',
      );
    }
  }
  return (
    <Screen>
      <Text style={common.eyebrow}>SOMETHING GOOD STARTS HERE</Text>
      <Text accessibilityRole="header" style={common.title}>
        Make yourself{'\n'}at home.
      </Text>
      <Text style={common.description}>
        A few details, and you’re one of us.
      </Text>
      <View style={common.form}>
        <Field
          label="Name"
          placeholder="Your full name"
          value={form.name}
          onChangeText={(value) => change('name', value)}
          error={errors.name}
          autoComplete="name"
          autoCapitalize="words"
          editable={!isLoading}
        />
        <Field
          label="Email"
          placeholder="you@example.com"
          value={form.email}
          onChangeText={(value) => change('email', value)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!isLoading}
        />
        <Field
          label="Password"
          placeholder="At least 6 characters"
          value={form.password}
          onChangeText={(value) => change('password', value)}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          returnKeyType="go"
          onSubmitEditing={submit}
          editable={!isLoading}
        />
        {error ? (
          <Text
            style={common.error}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {error}
          </Text>
        ) : null}
        <Button title="Signup" onPress={submit} loading={isLoading} />
        <Text style={common.footer}>Already part of the community?</Text>
        <Button
          title="Go to Login"
          secondary
          disabled={isLoading}
          onPress={() => navigation.popTo('Login')}
        />
      </View>
    </Screen>
  );
}
