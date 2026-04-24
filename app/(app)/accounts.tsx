import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

export default function AccountsScreen() {
  const { theme } = useTheme();
  const { accounts, activeIndex, switchAccount, removeAccount } = useAuth();

  const getInitial = (email: string) =>
    email?.charAt(0).toUpperCase();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <Text style={[styles.title, { color: theme.text }]}>
        Accounts
      </Text>

      {accounts.map((acc: any, index: number) => {
        const isActive = index === activeIndex;

        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.row,
              {
                backgroundColor: isActive ? theme.card : "transparent",
                borderColor: theme.border,
              },
            ]}
            onPress={async () => {
              if (!isActive) {
                await switchAccount(index);
              }
              router.replace("/profile");
            }}
          >
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
              <Text style={styles.avatarText}>
                {getInitial(acc.user.email)}
              </Text>
            </View>

            {/* Email */}
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.text }}>
                {acc.user.email}
              </Text>

              {isActive && (
                <Text style={{ color: theme.secondary, fontSize: 12 }}>
                  Active
                </Text>
              )}
            </View>

            {/* Logout button */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation(); // ✅ prevent switching
                removeAccount(index);
              }}
            >
              <Text style={{ color: theme.danger }}>
                Logout
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        );
      })}

      {/* Add Account */}
      <TouchableOpacity
        style={styles.addRow}
        onPress={() => router.push("/login")}
      >
        <Text style={{ fontSize: 20 }}>＋</Text>
        <Text style={{ marginLeft: 10, color: theme.primary }}>
          Add another account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  email: {
    fontSize: 15,
    fontWeight: "500",
  },

  activeLabel: {
    fontSize: 12,
    marginTop: 2,
  },

  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  logoutText: {
    fontSize: 13,
    fontWeight: "600",
  },

  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    paddingVertical: 12,
  },

  addText: {
    fontSize: 16,
    fontWeight: "500",
  },
});