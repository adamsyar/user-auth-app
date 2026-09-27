import { Button, View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
export function SignupScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Signup'>) {
  return (
    <View>
      <Text>Signup</Text>
      <Button title="Go to Login" onPress={() => navigation.popTo('Login')} />
    </View>
  );
}
