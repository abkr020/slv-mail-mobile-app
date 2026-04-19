import { api } from "@/services/api";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text, TouchableOpacity, View
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function InboxList() {
  const { token } = useAuth();
  const { theme } = useTheme();

  const [mails, setMails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMails();
  }, [token]);

  const loadMails = async () => {
    setLoading(true);
    const data = await api.getMyInBoxMails(token);
    setMails(data || []);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const data = await api.getMyInBoxMails(token);
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
            from: item.from,
            subject: item.subject,
            text: item.text,
            date: new Date(item.createdAt).toLocaleString(),
          },
        })
      }
    >
      <View style={[styles.card, { backgroundColor: theme.card }]}>

        {/* ROW 1 */}
        <View style={styles.rowBetween}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.from, { color: theme.text }]}
          >
            {item.from}
          </Text>

          <Text style={[styles.date, { color: theme.mutedText }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* ROW 2 */}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.subject, { color: theme.text }]}
        >
          {item.subject || "No Subject"}
        </Text>

        {/* ROW 3 */}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.message, { color: theme.mutedText }]}
        >
          {item.text || "No content"}
        </Text>

      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.mutedText, marginTop: 10 }}>
          Loading mails...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={mails}
      keyExtractor={(item) => item._id || item.messageId}
      renderItem={renderItem}
      contentContainerStyle={[
        styles.list,
        mails.length === 0 && styles.center,
      ]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      ListEmptyComponent={
        <Text style={{ color: theme.mutedText }}>
          No mails found
        </Text>
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
  // subject: {
  //   fontSize: 16,
  //   fontWeight: "600",
  // },
  // from: {
  //   fontSize: 13,
  //   marginTop: 2,
  // },
  text: {
    fontSize: 14,
    marginTop: 6,
  },
  // date: {
  //   fontSize: 11,
  //   marginTop: 8,
  //   textAlign: "right",
  // },
});