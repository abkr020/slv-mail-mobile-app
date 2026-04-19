import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";


interface GlobalTextInputProps extends TextInputProps {}

export default function GlobalTextInput(props: GlobalTextInputProps) {
  const { theme } = useTheme();

  return (
    <TextInput
      {...props}
      style={[
        styles.input,
        {
          backgroundColor: theme.card,
          borderColor: theme.inputBorder,
          color: theme.text,
        },
        props.style,
      ]}
      placeholderTextColor={theme.mutedText}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
});