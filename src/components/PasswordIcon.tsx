import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/theme';

// Drawn with native views so the password control does not require a font loader.
export function PasswordIcon({ hidden }: { hidden: boolean }) {
  return (
    <View accessible={false} style={styles.container}>
      <View style={styles.outline}>
        <View style={styles.pupil} />
      </View>
      {hidden ? <View style={styles.slash} /> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    width: 18,
    height: 18,
    borderWidth: 1.7,
    borderColor: colors.muted,
    borderTopLeftRadius: 13,
    borderBottomRightRadius: 13,
    borderTopRightRadius: 3,
    borderBottomLeftRadius: 3,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {
    width: 6,
    height: 6,
    borderWidth: 1.5,
    borderColor: colors.muted,
    borderRadius: 3,
  },
  slash: {
    position: 'absolute',
    width: 26,
    height: 2,
    backgroundColor: colors.muted,
    transform: [{ rotate: '45deg' }],
  },
});
