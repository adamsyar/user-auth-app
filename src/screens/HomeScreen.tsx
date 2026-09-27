import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { colors, common } from '../theme/theme';
export function HomeScreen() {
  const { user, logout, isLoading } = useAuth();
  const [error, setError] = useState('');
  if (!user) return null;
  async function signOut() {
    setError('');
    try {
      await logout();
    } catch {
      setError('We couldn’t finish logging out. Please try again.');
    }
  }
  return (
    <Screen>
      <View style={styles.badge}>
        <View style={styles.dot} />
        <Text style={styles.badgeText}>YOU’RE IN GOOD COMPANY</Text>
      </View>
      <Text accessibilityRole="header" style={common.title}>
        You’re home.
      </Text>
      <Text style={common.description}>
        Glad you’re here, {user.name.split(' ')[0]}.{'\n'}This little corner is
        all yours.
      </Text>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>
            {Array.from(user.name)[0]?.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.member}>YOUR PERSONAL PROFILE</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>FULL NAME</Text>
        <Text selectable style={styles.value}>
          {user.name}
        </Text>
        <Text style={styles.label}>EMAIL ADDRESS</Text>
        <Text selectable style={styles.value}>
          {user.email}
        </Text>
      </View>
      <View style={styles.note}>
        <Text style={styles.noteTitle}>A fresh start, every day.</Text>
        <Text style={styles.noteText}>
          You’re right where you belong. Take a moment and make yourself
          comfortable.
        </Text>
      </View>
      {error ? (
        <Text accessibilityRole="alert" style={common.error}>
          {error}
        </Text>
      ) : null}
      <Button title="Logout" secondary onPress={signOut} loading={isLoading} />
    </Screen>
  );
}
const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 18,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  badgeText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    marginVertical: 28,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.pale,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  initial: { fontSize: 28, color: colors.primary, fontWeight: '600' },
  name: { fontSize: 23, fontWeight: '600', color: colors.ink },
  member: {
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.muted,
    marginTop: 8,
  },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 22 },
  label: {
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.muted,
    marginBottom: 8,
  },
  value: { color: colors.ink, fontSize: 16, marginBottom: 18 },
  note: { marginBottom: 24 },
  noteTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 7,
  },
  noteText: { color: colors.muted, fontSize: 14, lineHeight: 22 },
});
