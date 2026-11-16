import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import theme from '../theme';
import { initials } from '../utils/format';

const AVATAR_TONES = [theme.colors.secondary, theme.colors.ink, '#3D5A80', theme.colors.primary];

export function Screen({ children }) {
  return <View style={styles.screen}>{children}</View>;
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Title({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function ItemTitle({ children }) {
  return <Text style={styles.itemTitle}>{children}</Text>;
}

export function Subtitle({ children }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Muted({ children, style }) {
  return <Text style={[styles.muted, style]}>{children}</Text>;
}

export function Body({ children }) {
  return <Text style={styles.body}>{children}</Text>;
}

export function ScreenHeader({ title, subtitle, countLabel, onAction, actionLabel }) {
  return (
    <View style={styles.screenHeader}>
      <View style={styles.screenHeaderText}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {countLabel ? <Text style={styles.countLabel}>{countLabel}</Text> : null}
      </View>
      {onAction ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={styles.headerAction}
        >
          <Ionicons name="add" size={22} color={theme.colors.textInverse} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function Avatar({ name }) {
  const tone = AVATAR_TONES[(String(name).length + (name?.charCodeAt(0) || 0)) % AVATAR_TONES.length];

  return (
    <View style={[styles.avatar, { backgroundColor: tone }]}>
      <Text style={styles.avatarText}>{initials(name)}</Text>
    </View>
  );
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;

  return (
    <View style={styles.error}>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry}>
          <Text style={styles.retry}>Tentar de novo</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState({ message }) {
  return (
    <View style={styles.emptyWrap}>
      <Ionicons name="school-outline" size={36} color={theme.colors.secondary} />
      <Text style={styles.empty}>{message}</Text>
    </View>
  );
}

export function Loading({ label = 'Carregando…' }) {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={theme.colors.secondary} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  secureTextEntry,
  multiline,
  autoCapitalize = 'sentences',
  placeholder,
}) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

export function SearchBar({ value, onChangeText, onSubmit, placeholder = 'Buscar conteúdo' }) {
  return (
    <View style={styles.searchBar}>
      <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        style={styles.searchInput}
      />
      <Pressable onPress={onSubmit} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </Pressable>
    </View>
  );
}

export function Button({ title, onPress, variant = 'primary', disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'danger' && styles.buttonDanger,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant !== 'primary' && styles.buttonTextAlt,
          variant === 'danger' && styles.buttonTextDanger,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ label, name, onPress, variant = 'ghost' }) {
  const color = variant === 'danger' ? theme.colors.danger : theme.colors.ink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.iconButton, variant === 'danger' && styles.iconButtonDanger]}
    >
      <Ionicons name={name} size={18} color={color} />
    </Pressable>
  );
}

export function Tag({ children, onPress }) {
  const content = <Text style={styles.tagText}>{children}</Text>;

  if (!onPress) {
    return <View style={styles.tag}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Filtrar postagens de ${children}`}
      onPress={(event) => {
        event?.stopPropagation?.();
        onPress();
      }}
      style={styles.tag}
    >
      {content}
    </Pressable>
  );
}

export function Pager({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;

  return (
    <View style={styles.pager}>
      <Pressable onPress={onPrev} disabled={page <= 1} style={styles.pagerButton}>
        <Ionicons name="chevron-back" size={18} color={page <= 1 ? theme.colors.border : theme.colors.ink} />
      </Pressable>
      <Text style={styles.muted}>
        {page} / {totalPages}
      </Text>
      <Pressable onPress={onNext} disabled={page >= totalPages} style={styles.pagerButton}>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={page >= totalPages ? theme.colors.border : theme.colors.ink}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  screenHeaderText: {
    flex: 1,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.ink,
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.ink,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  muted: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
  countLabel: {
    color: theme.colors.secondaryDark,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  body: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginTop: theme.spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: theme.colors.textInverse,
    fontWeight: '700',
    fontSize: 13,
  },
  error: {
    backgroundColor: theme.colors.dangerLight,
    borderColor: '#F4C7B0',
    borderWidth: 1,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.danger,
  },
  retry: {
    marginTop: theme.spacing.sm,
    color: theme.colors.secondaryDark,
    fontWeight: '700',
  },
  emptyWrap: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  empty: {
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  loading: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xl,
  },
  field: {
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.ink,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 999,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 4,
    marginBottom: theme.spacing.md,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    color: theme.colors.text,
  },
  searchButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  searchButtonText: {
    color: theme.colors.textInverse,
    fontWeight: '700',
    fontSize: 13,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.sm,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonDanger: {
    backgroundColor: theme.colors.dangerLight,
    borderWidth: 1,
    borderColor: '#F4C7B0',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.textInverse,
    fontWeight: '700',
  },
  buttonTextAlt: {
    color: theme.colors.ink,
  },
  buttonTextDanger: {
    color: theme.colors.danger,
  },
  chip: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.secondary,
  },
  chipText: {
    color: theme.colors.ink,
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextSelected: {
    color: theme.colors.textInverse,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    marginLeft: 6,
  },
  iconButtonDanger: {
    backgroundColor: theme.colors.dangerLight,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.secondaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: theme.colors.secondaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: theme.spacing.md,
  },
  pagerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
