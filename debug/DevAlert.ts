import { Alert } from "react-native";
// const DEV_ALERTS = Constants.expoConfig?.extra?.DEV_ALERTS === "true";
// const DEV_ALERTS = process.env.EXPO_PUBLIC_DEV_ALERTS === "true";


interface ShowAlertProps {
  title?: string;
  message?: string;
  // buttons?: {
  //   text: string;
  //   onPress?: () => void;
  //   style?: "default" | "cancel" | "destructive";
  // }[];
}

export const showAlert = (props : ShowAlertProps) => {
     //   if (__DEV__ && DEV_ALERTS) {
    //     Alert.alert(title, message);
    //   }
  return new Promise<void>((resolve) => {
    Alert.alert(props.title ?? "test", props.message ?? "dummy message", [
      { text: 'OK', onPress: () => resolve() }
    ]);
  });
};
