import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);
type Account = {
  user: any;
  token: string;
};
export const AuthProvider = ({ children }: any) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // ✅ derived state
  const currentAccount = accounts[activeIndex] || null;
  const user = currentAccount?.user || null;
  const token = currentAccount?.token || null;

  useEffect(() => {
    const loadAccounts = async () => {
      const storedAccounts = await AsyncStorage.getItem("accounts");
      const storedIndex = await AsyncStorage.getItem("activeIndex");

      if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
      if (storedIndex) setActiveIndex(Number(storedIndex));

      setLoading(false);
    };

    loadAccounts();
  }, []);

  // ✅ ADD ACCOUNT (login)
  const login = async (data: any) => {
    if (!data?.user || !data?.token) return;

    const newAccount = {
      user: data.user,
      token: data.token,
    };

    const updatedAccounts = [...accounts, newAccount];

    setAccounts(updatedAccounts);
    setActiveIndex(updatedAccounts.length - 1);

    await AsyncStorage.setItem("accounts", JSON.stringify(updatedAccounts));
    await AsyncStorage.setItem("activeIndex", String(updatedAccounts.length - 1));
  };

  // ✅ SWITCH ACCOUNT
  const switchAccount = async (index: number) => {
    setActiveIndex(index);
    await AsyncStorage.setItem("activeIndex", String(index));
  };

  // ✅ LOGOUT (remove current account only)
  const logout = async () => {
    const updated = accounts.filter((_, i) => i !== activeIndex);

    setAccounts(updated);
    setActiveIndex(0);

    await AsyncStorage.setItem("accounts", JSON.stringify(updated));
    await AsyncStorage.setItem("activeIndex", "0");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentAccount,
        token,
        accounts,
        activeIndex,
        login,
        logout,
        switchAccount,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);