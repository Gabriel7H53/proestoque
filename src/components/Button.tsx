import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacityProps, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  disabled,
  style,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const getContainerStyle = (): ViewStyle => {
    let baseStyle: ViewStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle = {
          backgroundColor: theme.colors.primary[500],
          borderColor: theme.colors.primary[500],
          borderWidth: 1,
        };
        break;
      case 'outline':
        baseStyle = {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary[500],
          borderWidth: 1,
        };
        break;
      case 'ghost':
        baseStyle = {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
        break;
      case 'danger':
        baseStyle = {
          backgroundColor: theme.colors.danger.base,
          borderColor: theme.colors.danger.base,
          borderWidth: 1,
        };
        break;
    }

    // Size styles
    switch (size) {
      case 'sm':
        baseStyle = { ...baseStyle, height: 36, paddingHorizontal: theme.spacing[3] };
        break;
      case 'md':
        baseStyle = { ...baseStyle, height: 48, paddingHorizontal: theme.spacing[4] };
        break;
      case 'lg':
        baseStyle = { ...baseStyle, height: 56, paddingHorizontal: theme.spacing[6] };
        break;
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (isDisabled) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    let textStyle: TextStyle = {};

    switch (variant) {
      case 'primary':
      case 'danger':
        textStyle.color = theme.colors.white;
        break;
      case 'outline':
      case 'ghost':
        textStyle.color = theme.colors.primary[500];
        break;
    }

    switch (size) {
      case 'sm':
        textStyle.fontSize = theme.typography.fontSize.sm;
        break;
      case 'md':
        textStyle.fontSize = theme.typography.fontSize.md;
        break;
      case 'lg':
        textStyle.fontSize = theme.typography.fontSize.lg;
        break;
    }

    return textStyle;
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return theme.colors.white;
      case 'outline':
      case 'ghost':
        return theme.colors.primary[500];
    }
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  return (
    <TouchableOpacity
      style={[styles.container, getContainerStyle(), style]}
      disabled={isDisabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getIconColor()} size="small" />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={getIconColor()}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, getTextStyle()]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  text: {
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
  icon: {
    marginRight: theme.spacing[2],
  },
});
