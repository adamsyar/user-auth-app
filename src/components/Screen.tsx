import { useAuth } from '../auth/AuthContext';
import type { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/theme';
export function Screen({ children }: PropsWithChildren) {
  const { storageWarning } = useAuth();
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <View style={styles.brand}>
            <View style={styles.mark}>
              <Text style={styles.markText}>A.</Text>
            </View>
            <Text style={styles.brandText}>Adam</Text>
          </View>
          <View style={styles.content}>
            {storageWarning ? (
              <Text
                accessibilityRole="alert"
                style={{ color: colors.error, marginBottom: 16 }}
              >
                {storageWarning}
              </Text>
            ) : null}
            {children}
          </View>
          <Text style={styles.bottom}>YOUR SPACE. YOUR PEOPLE.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 44,
    gap: 10,
  },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { color: '#fff', fontSize: 26, fontWeight: '700', marginTop: -3 },
  brandText: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -1,
  },
  brandCaption: {
    flex: 1,
    textAlign: 'right',
    color: colors.muted,
    fontSize: 8,
    letterSpacing: 1.2,
  },
  content: { flex: 1 },
  bottom: {
    textAlign: 'center',
    fontSize: 9,
    letterSpacing: 2,
    color: colors.muted,
    paddingTop: 32,
  },
});
