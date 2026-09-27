import { PasswordIcon } from './PasswordIcon';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors } from '../theme/theme';
type Props = TextInputProps & { label: string; error?: string };
export function Field({ label, error, secureTextEntry, ...props }: Props) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focused && styles.focused,
          !!error && styles.invalid,
        ]}
      >
        <TextInput
          key={secureTextEntry ? String(visible) : label}
          {...props}
          testID={props.testID ?? label.toLowerCase()}
          secureTextEntry={secureTextEntry && !visible}
          accessibilityLabel={label}
          accessibilityHint={error}
          placeholderTextColor="#89918b"
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Hide password' : 'Show password'}
            accessibilityState={{ disabled: props.editable === false }}
            disabled={props.editable === false}
            onPress={() => {
              setFocused(false);
              setVisible((current) => !current);
            }}
            style={{
              width: 48,
              minHeight: 48,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PasswordIcon hidden={visible} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={styles.error}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { color: colors.ink, fontSize: 14, fontWeight: '600' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.ink,
    fontSize: 16,
  },
  focused: { borderColor: colors.primary },
  invalid: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 12, lineHeight: 18 },
});
