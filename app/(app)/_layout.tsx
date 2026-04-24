import { Stack, usePathname } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { LAYOUT } from "@/constants/layout";
import { useTheme } from "@/context/ThemeContext";
import { CONFIG } from "@/constants/config";

export default function AppLayout() {
  const { theme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const pathname = usePathname();

  // ❌ Hide header for specific route
  const hideHeader =
    (pathname.startsWith("/mail/") && pathname !== "/mail/sent") ||
    pathname === "/accounts";
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>

      {/* ✅ CONDITIONAL HEADER */}
      {!hideHeader && (
        <View style={{ paddingHorizontal: LAYOUT.screenPadding }}>
          <Header onMenuPress={() => setSidebarVisible(true)} />
        </View>
      )}

      {/* ✅ NAVIGATION STACK */}
      <Stack screenOptions={{
        headerShown: CONFIG.MODE === "dev",
      }}>
        <Stack.Screen name="profile" />
        <Stack.Screen name="accounts" />  // ✅ add this
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