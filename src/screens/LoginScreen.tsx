import { useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { useAuth } from '../auth/AuthContext';
import { validateLogin } from '../auth/validation';
import type { FieldErrors } from '../auth/types';
import { Screen } from '../components/Screen';
import { Field } from '../components/Field';
import { Button } from '../components/Button';
import { common } from '../theme/theme';
export function LoginScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  function change(field: 'email' | 'password', value: string) {
    (field === 'email' ? setEmail : setPassword)(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
    setError('');
  }
  async function submit() {
    if (isLoading) return;
    const issues = validateLogin({ email, password });
    setErrors(issues);
    setError('');
    if (Object.keys(issues).length) return;
    Keyboard.dismiss();
    try {
      await login({ email, password });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to log in. Please try again.',
      );
    }
  }
  return (
    <Screen>
      <Text style={common.eyebrow}>GOOD TO SEE YOU AGAIN</Text>
      <Text accessibilityRole="header" style={common.title}>
        Welcome back.
      </Text>
      <Text style={common.description}>
        A familiar place, just for you.{'\n'}Log in to make yourself at home.
      </Text>
      <View style={common.form}>
        <Field
          label="Email"
          placeholder="you@example.com"
          value={email}
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
          placeholder="Enter your password"
          value={password}
          onChangeText={(value) => change('password', value)}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
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
        <Button title="Login" onPress={submit} loading={isLoading} />
        <Text style={common.footer}>
          New around here? There’s a place for you.
        </Text>
        <Button
          title="Go to Signup"
          secondary
          disabled={isLoading}
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    </Screen>
  );
}
