import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { API_URL } from "../../constants/api";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        Alert.alert(
          "Login Failed",
          result?.detail || "Invalid email or password."
        );
        return;
      }

      console.log("Login successful:", result);

      Alert.alert(
        "Login Successful",
        "Welcome back to EcoCraft!",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ]
      );

    } catch (error) {
      console.error("Login error:", error);

      Alert.alert(
        "Connection Error",
        `Cannot connect to backend.\n\nMake sure the backend is running on ${API_URL}`
      );

    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#1B4332"
            />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons
                name="leaf"
                size={42}
                color="#2E8B57"
              />
            </View>

            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>
              Sign in to continue your EcoCraft journey ðŸŒ±
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.heading}>Login to your account</Text>

            {/* Email */}
            <Text style={styles.label}>Email Address</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={21}
                color="#2E8B57"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Password</Text>

              <TouchableOpacity
                onPress={() =>
                  router.push("/(auth)/forgotPassword")
                }
              >
                <Text style={styles.forgotText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color="#2E8B57"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.loginButton,
                loading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Text style={styles.loginText}>
                    Login
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={21}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>

            {/* Create Account */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>
                Don't have an account?
              </Text>

              <TouchableOpacity
                onPress={() =>
                  router.replace("/(auth)/login")
                }
              >
                <Text style={styles.signupLink}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Security */}
          <View style={styles.bottomContainer}>
            <View style={styles.secureRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#2E8B57"
              />

              <Text style={styles.secureText}>
                Your account information is secure
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#F4FBF5",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,

    shadowColor: "#1B4332",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 4,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1B4332",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },

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

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 10,
  },

  passwordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },

  forgotText: {
    fontSize: 13,
    color: "#2E8B57",
    fontWeight: "700",
  },

  inputContainer: {
    height: 60,
    borderWidth: 1.5,
    borderColor: "#DDE5DF",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#F8FAFC",
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    marginLeft: 12,
  },

  loginButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: "#2E8B57",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  disabledButton: {
    backgroundColor: "#A7C9B2",
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  signupText: {
    fontSize: 13,
    color: "#64748B",
  },

  signupLink: {
    fontSize: 13,
    color: "#2E8B57",
    fontWeight: "800",
    marginLeft: 5,
  },

  bottomContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  secureRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  secureText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 7,
  },
});




