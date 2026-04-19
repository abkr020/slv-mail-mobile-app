import { useTheme } from "@/context/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { useTheme } from "../../context/ThemeContext";

export default function MailDetail() {
  const { theme } = useTheme();
  const { subject, from, text, date } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>

      {/* ✅ CUSTOM HEADER */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        {/* <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 18 }}>←</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            padding: 8,
            borderRadius: 20,
            backgroundColor: theme.card,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: theme.text,
            }}
          >
            ←
          </Text>
        </TouchableOpacity>
        <Text
          numberOfLines={1}
          style={[styles.headerTitle, { color: theme.text }]}
        >
          {subject}
        </Text>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.container}>
        <Text style={[styles.meta, { color: theme.mutedText }]}>
          From: {from}
        </Text>

        <Text style={[styles.meta, { color: theme.mutedText }]}>
          {date}
        </Text>

        <View style={styles.divider} />

        <Text style={[styles.body, { color: theme.text }]}>
          {text}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  container: {
    padding: 16,
  },
  meta: {
    fontSize: 13,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 12,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
});