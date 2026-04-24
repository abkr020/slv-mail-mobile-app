import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { showAlert } from "@/debug/DevAlert";
import { api } from "@/services/api";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function SentList() {
  const { token ,user} = useAuth();
  const { theme } = useTheme();

  const [mails, setMails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMails();
  }, [token]);

  const loadMails = async () => {
    setLoading(true);
    await showAlert({title:"getMySentMails",message: JSON.stringify(user)})
    const data = await api.getMySentMails(token);
    setMails(data || []);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const data = await api.getMySentMails(token);
    setMails(data || []);
    setRefreshing(false);
  }, [token]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/mail/[id]",
          params: {
            id: item._id,
            from: item.to, // 👈 important difference
            subject: item.subject,
            text: item.text,
            date: new Date(item.createdAt).toLocaleString(),
          },
        })
      }
    >
      <View style={[styles.card, { backgroundColor: theme.card }]}>

        <View style={styles.rowBetween}>
          <Text style={[styles.from, { color: theme.text }]}>
            To: {item.to}
          </Text>

          <Text style={[styles.date, { color: theme.mutedText }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <Text style={[styles.subject, { color: theme.text }]}>
          {item.subject || "No Subject"}
        </Text>

        <Text style={[styles.message, { color: theme.mutedText }]}>
          {item.text || "No content"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={mails}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}
const styles = StyleSheet.create({
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  from: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },

  date: {
    fontSize: 12,
  },

  subject: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },

  message: {
    fontSize: 13,
    marginTop: 2,
  },

  list: {
    paddingBottom: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },

  card: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
});