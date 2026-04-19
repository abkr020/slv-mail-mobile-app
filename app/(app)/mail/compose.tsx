import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import GlobalTextInput from "@/global/ui/GlobalTextInput";
import { api } from "@/services/api";


export default function ComposeMail() {
  const { theme } = useTheme();
  const { token } = useAuth();


  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 pick file
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      // type: "application/pdf",
          type: ["application/pdf", "image/*"], // ✅ allow PDF + all image types
          // type: ["application/pdf", "image/jpeg", "image/png"]

    });

    if (result.canceled) return;

    const picked = result.assets[0];

    setFile({
      uri: picked.uri,
      name: picked.name,
      type: picked.mimeType || "application/pdf",
    });
  };

  // 🔹 send mail
  
const handleSend = async () => {
  if (!to || !subject || !message) {
    alert("All fields are required");
    return;
  }

  try {
    setLoading(true);

    const res = await api.sendMail(token, {
      to,
      subject,
      text: message,
      file, // 👈 pass file directly
    });

    if (!res?.success) {
      alert(res?.message || "Failed to send mail");
      return;
    }

    alert("Mail sent successfully ✅");
    router.back();

  } catch (error) {
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: theme.text }}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>
          Compose
        </Text>

        <TouchableOpacity onPress={handleSend} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Text style={{ color: theme.primary, fontWeight: "600" }}>
              Send
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <GlobalTextInput
          placeholder="To"
          value={to}
          onChangeText={setTo}
        />

        <GlobalTextInput
          placeholder="Subject"
          value={subject}
          onChangeText={setSubject}
        />

        <GlobalTextInput
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          multiline
          style={{ minHeight: 120, textAlignVertical: "top" }}
        />

        {/* ATTACHMENT */}
        <TouchableOpacity
          onPress={pickFile}
          style={[styles.attachBtn, { borderColor: theme.border }]}
        >
          <Text style={{ color: theme.text ,backgroundColor:theme.background}}>
            {file ? `📎 ${file.name}` : "Attach PDF"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  form: {
    padding: 16,
    gap: 12,
  },
  attachBtn: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
});