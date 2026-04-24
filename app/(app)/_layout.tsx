import { Stack } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useTheme } from "@/context/ThemeContext";
import { View } from "react-native";
import { LAYOUT } from "@/constants/layout";

export default function AppLayout() {
  const { theme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>

      {/* ✅ COMMON HEADER */}
      <View style={{  paddingHorizontal: LAYOUT.screenPadding }}>
        <Header onMenuPress={() => setSidebarVisible(true)} />
      </View>

      {/* ✅ NAVIGATION STACK */}

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profile" />
        <Stack.Screen name="mail/[id]" />
        <Stack.Screen name="mail/compose" />
        <Stack.Screen name="mail/sent" />
      </Stack>

      {/* ✅ COMMON SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

    </SafeAreaView>
  );
}