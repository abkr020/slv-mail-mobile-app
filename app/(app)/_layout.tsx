import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profile" />

        {/* ✅ ADD THIS */}
        <Stack.Screen name="mail/[id]" 
          // options={{ headerShown: true, title: "Mail" }}

        />
        <Stack.Screen name="mail/compose" />
      </Stack>
    </SafeAreaView>
  );
}