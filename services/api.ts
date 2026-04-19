import AsyncStorage from "@react-native-async-storage/async-storage";
import { showAlert } from "../debug/DevAlert";

// const BASE_URL = "http://localhost:3334"; // backend URL
// const BASE_URL = "http://192.168.1.2:3334"; // backend URL
// const BASE_URL = "http://192.168.1.2:3334"; // backend URL
// const BASE_SSO_AUTH_URL = "https://sso-auth-backend.onrender.com"; // backend URL

// const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
// const BASE_SSO_AUTH_URL = process.env.EXPO_PUBLIC_SSO_URL;

// const BASE_SSO_AUTH_URL = Constants.expoConfig?.extra?.SSO_URL;



// const BASE_SSO_AUTH_URL = "https://sso-auth-backend.onrender.com";
const BASE_SSO_AUTH_URL = "https://mail-server-backend.onrender.com";
// const BASE_URL = "https://gym-mobile-app-backend.onrender.com";
const BASE_URL = "https://mail-server-backend.onrender.com";



// const BASE_URL = Constants.expoConfig?.extra?.BASE_URL;
// const BASE_URL = "http://192.168.1.14:3334";
const PENDING_RECORDS_KEY = "pendingDailyRecords";
const CACHED_RECORDS_KEY = "cachedDailyRecords";

const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 8000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
};

const isServerReachable = async () => {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }, 8000);

    return response.ok || response.status === 404 || response.status === 500;
  } catch (error) {
    return false;
  }
};

const normalizeRecords = (raw: any[]) =>
  raw.map((item: any) => ({
    id: item.id?.toString() || `${Date.now()}`,
    date: item.createdAt || item.date || new Date().toISOString(),
    ...item,
  }));

const loadPendingRecords = async () => {
  const raw = await AsyncStorage.getItem(PENDING_RECORDS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const savePendingRecords = async (records: any[]) => {
  await AsyncStorage.setItem(PENDING_RECORDS_KEY, JSON.stringify(records));
};

const loadCachedRecords = async () => {
  const raw = await AsyncStorage.getItem(CACHED_RECORDS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveCachedRecords = async (records: any[]) => {
  await AsyncStorage.setItem(CACHED_RECORDS_KEY, JSON.stringify(records));
};

const createLocalId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const isLocalId = (id: any) => typeof id === 'string' && id.startsWith("local-");

export const api = {
  wakeServer: async () => {
    try {
      showAlert({ title: "test", message: "wake up server" })
      await Promise.allSettled([
        fetch(`${BASE_URL}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
        fetch(`${BASE_SSO_AUTH_URL}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      ]);
    } catch (error) {
      console.log("wakeServer failed:", error);
    }
  },

  syncPendingRecords: async (token: string | null) => {
    if (!token) return [];

    const pendingRecords = await loadPendingRecords();
    if (pendingRecords.length === 0) return [];
    if (!(await isServerReachable())) return pendingRecords;

    const successfullySynced: string[] = [];

    for (const record of pendingRecords) {
      try {
        let response: Response | null = null;
        if (record.action === "create") {
          response = await fetch(`${BASE_URL}/api/daily-records`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(record.body),
          });
        } else if (record.action === "update" && record.remoteId) {
          response = await fetch(`${BASE_URL}/api/daily-records/${record.remoteId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(record.body),
          });
        } else if (record.action === "update") {
          response = await fetch(`${BASE_URL}/api/daily-records`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(record.body),
          });
        }

        if (response && response.ok) {
          successfullySynced.push(record.localId);
        }
      } catch (error) {
        console.log("sync record failed", record.localId, error);
      }
    }

    if (successfullySynced.length > 0) {
      const remaining = pendingRecords.filter(
        (record: any) => !successfullySynced.includes(record.localId)
      );
      await savePendingRecords(remaining);

      try {
        // await api.getAllRecords(token, 30);
      } catch (error) {
        console.log("cache refresh after sync failed", error);
      }
    }

    return successfullySynced;
  },

  login: async (email: string, password: string) => {
    try {
      showAlert({ title: "login" });
      const res = await fetch(`${BASE_SSO_AUTH_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("data -", data);

      if (!res.ok || !data?.user) {
        await showAlert({ title: "Error", message: data?.message || "Login failed" });
        return null;
      }
      await showAlert({ title: "api data come", message: JSON.stringify(data) });
      return data;
    } catch (error) {
      await showAlert({ title: "Error", message: "Network error. Please try again." });
      return null;
    }
  },

  // signup: async (email: string, password: string) => {
  //   const res = await fetch(`${BASE_SSO_AUTH_URL}/sso/api/auth/signup`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   });

  //   return res.json();
  // },


  signup: async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${BASE_SSO_AUTH_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      // ✅ Check HTTP status first
      if (!res.ok || !data?.user) {
        // await showAlert("Error", data?.message || "Signup failed");
        await showAlert({
          title: "Error",
          message: data?.message || "Signup failed",
        });
        return null;
      }

      // ✅ Success case
      // await showAlert("Success", "Account created successfully 🎉");
      await showAlert({
        title: "Success",
        message: "Account created successfully 🎉",
      });
      return data;
    } catch (error) {
      // ✅ Network / unexpected error
      // await showAlert("Error", "Network error. Please try again.");
      await showAlert({
        title: "Error",
        message: "Network error. Please try again.",
      });
      return null;
    }
  },
  getMyInBoxMails: async (token: string | null) => {
    try {
      // if (!(await isServerReachable())) {
      //   const cached = await loadCachedRecords();
      //   // const cached: DailyRecord[] = await loadCachedRecords();
      //   if (!cached.length) return null;
      //   const today = new Date();

      //   const todayRecord = cached.find((item: any) =>
      //     isSameDay(new Date(item.createdAt), today)
      //   );

      //   // const latest = cached[0];
      //   console.log("getTodaysRecord cached", cached);

      //   // latest.createdAt === 
      //   return todayRecord || null;
      // }

      // // Sync pending records first
      // await api.syncPendingRecords(token);

      const res = await fetch(`${BASE_URL}/api/mail/my`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      // showAlert({ title: "my mail fetch", message: JSON.stringify(data?.mails) })
      // console.log("data===",data);
      // console.log("asdf",data.data);

      if (!res.ok) {
        return null;
      }
      // ✅ correct field
      return data.mails || [];
    } catch (error) {
      const cached = await loadCachedRecords();
      if (!cached.length) return null;
      return cached[cached.length - 1];
    }
  },
  sendMail: async (
    token: string | null,
    mailData: {
      to: string;
      subject: string;
      text: string;
      file: any; // file object
    }
  ) => {
    try {
      const formData = new FormData();

      formData.append("to", mailData.to);
      formData.append("subject", mailData.subject);
      formData.append("text", mailData.text);

      // ✅ Attach file
      if (mailData.file) {
        formData.append("attachments", {
          uri: mailData.file.uri,        // file path
          name: mailData.file.name,      // file name
          type: mailData.file.type,      // mime type
        } as any);
      }

      const res = await fetch(`${BASE_URL}/api/mail/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ DO NOT manually set Content-Type
          // React Native automatically sets multipart boundary
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data?.message };
      }

      return data; // { success: true, traceId: ... }
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  }

};
