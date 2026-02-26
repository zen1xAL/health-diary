import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  color?: string;       
  textColor?: string;   
  style?: ViewStyle;   
}

export const CustomButton = ({ title, onPress, color = '#007AFF', textColor = '#fff', style }: CustomButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color }, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  }
});