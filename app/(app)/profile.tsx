// import { DailyRecordForm } from "@/components/DailyRecordForm";
import { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { DailyRecordsChart } from "../../components/DailyRecordsChart";
import { InboxList } from "@/components/InboxList";
import { LAYOUT } from "@/constants/layout";
import { router } from "expo-router";
import { Sidebar } from "../../components/Sidebar";
import { ThemeColors } from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const styles = useMemo(() => createProfileStyles(theme), [theme]);

  useEffect(() => {
    loadRecords();
  }, [token]);

  const loadRecords = async () => {
    setLoading(true);
    // const data = await api.getAllRecords(token, 30);
    // setRecords(data);
    setLoading(false);
  };

  const openModal = () => {
    // setModalVisible(true);
    router.push("/mail/compose");

  };

  return (
    <SafeAreaView style={{...styles.container,paddingHorizontal: LAYOUT.screenPadding}}>

      {/* ✅ Fixed Header */}
      {/* <Header onMenuPress={() => setSidebarVisible(true)} /> */}

      {/* ✅ Scrollable Content */}
      {/* <ScrollView 
      // showsVerticalScrollIndicator={false}
      >
        <InboxList />
      </ScrollView> */}
      <View style={{ flex: 1 }}>
        <InboxList />
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </SafeAreaView>
  );
}

const createProfileStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
    },

    menuIconText: {
      fontSize: 20,
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingRight: 10,
      paddingLeft: 10,
    },
    // header: {
    //   flexDirection: "row",
    //   justifyContent: "space-between",
    //   marginBottom: 20,
    // },
    title: {
      color: theme.text,
      fontSize: 28,
      fontWeight: "700",
    },
    profileIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
    },
    profileIconText: {
      fontSize: 20,
    },
    subtitle: {
      color: theme.mutedText,
      fontSize: 16,
      marginTop: 4,
    },
    loadingContainer: {
      borderRadius: 12,
      padding: 32,
      marginVertical: 12,
      justifyContent: "center",
      alignItems: "center",
      minHeight: 250,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      fontWeight: "500",
    },
    fab: {
      position: "absolute",
      bottom: 30,
      right: 30,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 8,
    },
    fabText: {
      fontSize: 32,
      color: theme.text,
      fontWeight: "bold",
    },
  });
