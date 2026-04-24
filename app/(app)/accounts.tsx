// app/(app)/accounts.tsx

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";


export default function AccountsScreen() {
  const { theme } = useTheme();
  const { accounts, activeIndex, switchAccount } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>
      <Text style={{ fontSize: 24, color: theme.text }}>
        Accounts
      </Text>

      {accounts.map((acc: any, index: number) => (
        <View
          key={index}
          style={{
            marginTop: 15,
            padding: 12,
            borderRadius: 8,
            backgroundColor:
              index === activeIndex ? theme.primary : theme.card,
          }}
        >
          <Text style={{ color: theme.text }}>
            {acc.user.email}
          </Text>

          {index !== activeIndex && (
            <Text
              style={{ color: theme.secondary, marginTop: 5 }}
              onPress={() => switchAccount(index)}
            >
              Switch
            </Text>
          )}
        </View>
      ))}

      {/* ➕ Add Account */}
      <Text
        style={{ marginTop: 30, color: theme.primary }}
        onPress={() => {
          // navigate to login screen
          router.push({ pathname: "/login" });

        }}
      >
        + Add Account
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
});