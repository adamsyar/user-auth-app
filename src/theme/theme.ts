import { StyleSheet } from 'react-native';
export const colors = {
  background: '#f5f4f0',
  surface: '#ffffff',
  ink: '#183a31',
  muted: '#69736e',
  primary: '#24634e',
  border: '#d9dfd8',
  error: '#a52b36',
  pale: '#e5ede4',
};
export const common = StyleSheet.create({
  eyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    color: colors.ink,
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1.2,
    marginBottom: 12,
  },
  description: { color: colors.muted, fontSize: 16, lineHeight: 25 },
  form: { gap: 20, marginTop: 32 },
  error: { color: colors.error, fontSize: 14, lineHeight: 20 },
  footer: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
});
