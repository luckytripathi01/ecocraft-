
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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
  if (!email.trim()) {
    Alert.alert(
      "Email Required",
      "Please enter your email address."
    );
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;;

  if (!emailRegex.test(email.trim())) {
    Alert.alert(
      "Invalid Email",
      "Please enter a valid email address."
    );
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      `${API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      Alert.alert(
        "Error",
        result?.detail || "Unable to send reset link."
      );
      return;
    }

    Alert.alert(
      "Reset Link Sent",
      result?.message ||
        "If this email is registered with EcoCraft, a password reset link has been sent to your email.",
      [
        {
          text: "OK",
        },
      ]
    );
  } catch (error) {
    console.error("Forgot password error:", error);

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
                name="lock-open-outline"
                size={42}
                color="#2E8B57"
              />
            </View>

            <Text style={styles.title}>
              Forgot Password?
            </Text>

            <Text style={styles.subtitle}>
              Don't worry! Enter your email address and
            </Text>

            <Text style={styles.subtitle}>
              we'll help you reset your password 🌱
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.heading}>
              Reset your password
            </Text>

            <Text style={styles.description}>
              Enter the email address associated with your
              EcoCraft account. We'll send you a link to
              create a new password.
            </Text>

            {/* Email Label */}
            <Text style={styles.label}>
              Email Address
            </Text>

            {/* Email Input */}
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
                editable={!loading}
              />
            </View>

            {/* Send Reset Link */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.resetButton,
                loading && styles.disabledButton,
              ]}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Text style={styles.resetButtonText}>
                    Send Reset Link
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={21}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.loginContainer}
              onPress={() => router.replace("/(auth)/signin")}
              disabled={loading}
            >
              <Ionicons
                name="arrow-back"
                size={17}
                color="#2E8B57"
              />

              <Text style={styles.loginText}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>

          {/* Security Information */}
          <View style={styles.bottomContainer}>
            <View style={styles.secureRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#2E8B57"
              />

              <Text style={styles.secureText}>
                Your information is kept secure
              </Text>
            </View>

            <Text style={styles.expiryText}>
              Reset links expire after 15 minutes.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPassword;

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

  /* Back Button */
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  /* Header */
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
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
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

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 21,
    marginBottom: 25,
  },

  /* Email */
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 10,
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

  /* Reset Button */
  resetButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: "#2E8B57",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  disabledButton: {
    backgroundColor: "#A7C9B2",
  },

  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },

  /* Login */
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  loginText: {
    fontSize: 14,
    color: "#2E8B57",
    fontWeight: "700",
    marginLeft: 6,
  },

  /* Bottom */
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

  expiryText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 8,
  },
});