import { Button, View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
export function LoginScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Login'>) {
  return (
    <View>
      <Text>Login</Text>
      <Button
        title="Go to Signup"
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
}
