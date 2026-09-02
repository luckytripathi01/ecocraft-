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
import { router, useLocalSearchParams } from "expo-router";
import { API_URL } from "../../constants/api";

const ResetPassword = () => {
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  // Password rules
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const isValidPassword =
    hasLength &&
    hasUppercase &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch;

  const handleResetPassword = async () => {
  if (!token) {
    Alert.alert(
      "Invalid Reset Link",
      "The password reset link is missing or invalid. Please request a new reset link."
    );
    return;
  }

  if (!isValidPassword) {
    Alert.alert(
      "Invalid Password",
      "Please make sure your password satisfies all requirements and both passwords match."
    );
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      `${API_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: password,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      Alert.alert(
        "Reset Failed",
        result?.detail ||
          "Unable to reset your password. Please request a new reset link."
      );
      return;
    }

    Alert.alert(
      "Password Reset",
      "Your password has been reset successfully!",
      [
        {
          text: "Go to Login",
          onPress: () => {
            router.replace("/(auth)/signin");
          },
        },
      ]
    );
  } catch (error) {
    console.error("Reset password error:", error);

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
            disabled={loading}
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
                name="key-outline"
                size={42}
                color="#2E8B57"
              />
            </View>

            <Text style={styles.title}>
              Reset Password
            </Text>

            <Text style={styles.subtitle}>
              Create a new strong password for your
            </Text>

            <Text style={styles.subtitle}>
              EcoCraft account 🌱
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.heading}>
              Create New Password
            </Text>

            <Text style={styles.description}>
              Your new password must be different from your
              previous password and should satisfy all the
              requirements below.
            </Text>

            {/* New Password */}
            <Text style={styles.label}>
              New Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color="#2E8B57"
              />

              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
                disabled={loading}
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

            {/* Password Rules */}
            <View style={styles.rulesContainer}>
              <PasswordRule
                valid={hasLength}
                text="At least 8 characters"
              />

              <PasswordRule
                valid={hasUppercase}
                text="One uppercase letter"
              />

              <PasswordRule
                valid={hasNumber}
                text="One number"
              />

              <PasswordRule
                valid={hasSpecial}
                text="One special character"
              />
            </View>

            {/* Confirm Password */}
            <Text style={styles.confirmLabel}>
              Confirm Password
            </Text>

            <View
              style={[
                styles.inputContainer,
                confirmPassword.length > 0 &&
                  !passwordsMatch &&
                  styles.errorInput,
                passwordsMatch &&
                  styles.successInput,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={21}
                color={
                  passwordsMatch
                    ? "#2E8B57"
                    : confirmPassword.length > 0
                    ? "#DC2626"
                    : "#2E8B57"
                }
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
                disabled={loading}
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* Match Message */}
            {confirmPassword.length > 0 && (
              <View style={styles.matchRow}>
                <Ionicons
                  name={
                    passwordsMatch
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={17}
                  color={
                    passwordsMatch
                      ? "#2E8B57"
                      : "#DC2626"
                  }
                />

                <Text
                  style={[
                    styles.matchText,
                    passwordsMatch
                      ? styles.matchSuccess
                      : styles.matchError,
                  ]}
                >
                  {passwordsMatch
                    ? "Passwords match"
                    : "Passwords do not match"}
                </Text>
              </View>
            )}

            {/* Reset Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.resetButton,
                (!isValidPassword || loading) &&
                  styles.disabledButton,
              ]}
              onPress={handleResetPassword}
              disabled={!isValidPassword || loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Text style={styles.resetButtonText}>
                    Reset Password
                  </Text>

                  <Ionicons
                    name="checkmark"
                    size={21}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.loginContainer}
              onPress={() =>
                router.replace("/(auth)/signin")
              }
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

          {/* Security */}
          <View style={styles.bottomContainer}>
            <View style={styles.secureRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#2E8B57"
              />

              <Text style={styles.secureText}>
                Your password is securely protected
              </Text>
            </View>

            <Text style={styles.expiryText}>
              Reset links are valid for 15 minutes.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const PasswordRule = ({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) => {
  return (
    <View style={styles.ruleRow}>
      <Ionicons
        name={
          valid
            ? "checkmark-circle"
            : "ellipse-outline"
        }
        size={18}
        color={
          valid
            ? "#2E8B57"
            : "#94A3B8"
        }
      />

      <Text
        style={[
          styles.ruleText,
          valid && styles.validRuleText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

export default ResetPassword;

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
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
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
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 21,
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 10,
  },

  confirmLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B4332",
    marginTop: 20,
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

  errorInput: {
    borderColor: "#DC2626",
  },

  successInput: {
    borderColor: "#2E8B57",
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    marginLeft: 12,
  },

  rulesContainer: {
    marginTop: 16,
  },

  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  ruleText: {
    fontSize: 13,
    color: "#94A3B8",
    marginLeft: 8,
  },

  validRuleText: {
    color: "#2E8B57",
  },

  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  matchText: {
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "600",
  },

  matchSuccess: {
    color: "#2E8B57",
  },

  matchError: {
    color: "#DC2626",
  },

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