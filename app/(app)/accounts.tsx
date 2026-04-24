import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AccountsScreen() {
  const { theme } = useTheme();
  const { accounts, activeIndex, switchAccount } = useAuth();

  const getInitial = (email: string) => {
    return email?.charAt(0).toUpperCase();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Title */}
      <Text style={[styles.title, { color: theme.text }]}>
        Accounts
      </Text>

      {/* Accounts List */}
      {accounts.map((acc: any, index: number) => {
        const isActive = index === activeIndex;

        return (
          <TouchableOpacity
            key={index}
            // onPress={() => switchAccount(index)}
            onPress={async () => {
              await switchAccount(index);
              router.replace("/profile"); // or "/" if home screen
            }}
            style={[
              styles.accountRow,
              {
                backgroundColor: isActive ? theme.card : "transparent",
                borderColor: theme.border,
              },
            ]}
          >
            {/* Avatar */}
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={styles.avatarText}>
                {getInitial(acc.user.email)}
              </Text>
            </View>

            {/* Email */}
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.email,
                  { color: theme.text },
                ]}
              >
                {acc.user.email}
              </Text>

              {isActive && (
                <Text
                  style={{
                    color: theme.secondary,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Active
                </Text>
              )}
            </View>

            {/* Checkmark */}
            {isActive && (
              <Text style={{ color: theme.primary, fontSize: 18 }}>
                ✓
              </Text>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: theme.border,
          marginVertical: 20,
        }}
      />

      {/* Add Account */}
      <TouchableOpacity
        style={styles.addRow}
        onPress={() => router.push("/login")}
      >
        <Text style={{ fontSize: 20 }}>＋</Text>
        <Text
          style={{
            marginLeft: 10,
            color: theme.primary,
            fontSize: 16,
          }}
        >
          Add another account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },

  email: {
    fontSize: 15,
    fontWeight: "500",
  },

  addRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
});