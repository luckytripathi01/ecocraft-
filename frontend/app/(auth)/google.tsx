import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      console.log("Google Login Success");

      setLoading(false);

      // Login ke baad home page
      // router.replace("/(tabs)/home");
    }

    if (response?.type === "error") {
      setLoading(false);
      console.log("Google Login Failed");
    }
  }, [response]);

  const handleGoogleLogin = () => {
    setLoading(true);
    promptAsync();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🌱</Text>
          </View>

          <Text style={styles.title}>Welcome Back 👋</Text>

          <Text style={styles.subtitle}>
            Login with your Google account and start
          </Text>

          <Text style={styles.subtitle}>
            creating something amazing from waste ♻️
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in to EcoCraft</Text>

          <Text style={styles.cardSubtitle}>
            Use your Google account to continue
          </Text>

          {/* Google Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!request || loading}
            onPress={handleGoogleLogin}
            style={styles.googleButton}
          >
            {/* Google Icon */}
            <View style={styles.iconContainer}>
              <Text style={styles.googleIcon}>G</Text>
            </View>

            {/* Button Text */}
            <Text style={styles.buttonText}>
              {loading ? "Connecting..." : "Continue with Google"}
            </Text>

            {/* Loading / Arrow */}
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="arrow-forward" size={22} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          {/* Security */}
          <View style={styles.securityContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#2E8B57"
            />

            <Text style={styles.securityText}>
              Your login is secure and protected
            </Text>
          </View>
        </View>

        {/* Bottom Text */}
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>By continuing, you agree to our</Text>

          <Text style={styles.termsText}>Terms & Conditions</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4FBF5",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  /* Logo Section */

  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 48,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1B4332",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
    textAlign: "center",
  },

  /* Card */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 24,

    shadowColor: "#1B4332",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,

    elevation: 5,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B4332",
    textAlign: "center",
    marginBottom: 8,
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 28,
  },

  /* Google Button */

  googleButton: {
    height: 60,
    borderRadius: 18,
    backgroundColor: "#2E8B57",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",
  },

  googleIcon: {
    fontSize: 23,
    fontWeight: "700",
    color: "#4285F4",
  },

  buttonText: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* Security */

  securityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  securityText: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 8,
  },

  /* Bottom */

  bottomContainer: {
    alignItems: "center",
    marginTop: 32,
  },

  bottomText: {
    fontSize: 13,
    color: "#94A3B8",
  },

  termsText: {
    fontSize: 13,
    color: "#2E8B57",
    fontWeight: "700",
    marginTop: 4,
  },
});
