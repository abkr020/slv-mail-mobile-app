import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemeColors } from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

interface HeaderProps {
  onMenuPress: () => void;
}

export function Header({ onMenuPress }: HeaderProps) {
  const { user } = useAuth();
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      {/* LEFT: Hamburger */}
      <TouchableOpacity style={styles.menuIcon} onPress={onMenuPress}>
        <Text style={styles.menuIconText}>☰</Text>
      </TouchableOpacity>

      {/* CENTER */}
      <View>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>{user?.email}</Text>
      </View>

      {/* RIGHT */}
      <TouchableOpacity style={styles.profileIcon}>
        <Text style={styles.profileIconText}>👤</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      // marginBottom: 20,
    },
    title: {
      color: theme.text,
      fontSize: 28,
      fontWeight: "700",
    },
    subtitle: {
      color: theme.mutedText,
      fontSize: 16,
      marginTop: 4,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
    },
    menuIconText: {
      fontSize: 20,
      color:theme.text,
  backgroundColor:theme.background
    },
    profileIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
    },
    profileIconText: {
      fontSize: 20,
    },
  });