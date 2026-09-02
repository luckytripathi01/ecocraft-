import { Redirect, useLocalSearchParams } from "expo-router";

export default function ResetPasswordDeepLink() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  if (!token) {
    return <Redirect href="/(auth)/forgotPassword" />;
  }

  return (
    <Redirect
      href={{
        pathname: "/(auth)/resetPassword",
        params: { token },
      }}
    />
  );
}
