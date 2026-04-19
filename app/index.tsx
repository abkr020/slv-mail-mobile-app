import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";
// import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? (
    <Redirect href="/(app)/profile" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}