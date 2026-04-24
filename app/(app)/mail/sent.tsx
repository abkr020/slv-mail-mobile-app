import { SentList } from "@/components/SentList";
import { Sidebar } from "@/components/Sidebar";
import { LAYOUT } from "@/constants/layout";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SentScreen() {
  const { theme } = useTheme();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, paddingHorizontal: LAYOUT.screenPadding }}>
      {/* <Header onMenuPress={() => setSidebarVisible(true)} /> */}

      <SentList />

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </SafeAreaView>
  );
}