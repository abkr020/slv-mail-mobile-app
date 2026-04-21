import AsyncStorage from "@react-native-async-storage/async-storage";
import { showAlert } from "../debug/DevAlert";
import { MailQueue } from "./mail/mail.queue";

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



  login: async (email: string, password: string) => {
    try {
      await showAlert({ title: "login" });
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

      await showAlert({ title: "catch error", message: JSON.stringify(error) })
      return;
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
        await MailQueue.addToQueue(mailData);

        return {
          success: false,
          queued: true,
          message: data?.message || "Failed, added to queue",
        };
      }

      return {
        success: true,
        queued: false,
        data,
      };
    } catch (error) {
      // ❌ Network / crash fallback → QUEUE IT
      await MailQueue.addToQueue(mailData);

      return {
        success: false,
        queued: true,
        message: "Network error. Email added to queue and will retry later.",
      };
    }
  }

};
