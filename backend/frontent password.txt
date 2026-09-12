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
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const Password = () => {
  const { email } = useLocalSearchParams();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password Rules
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const isValidPassword = hasLength && hasUppercase && hasNumber && hasSpecial;

  // Create Account and Open Home
  const handleContinue = () => {
    if (!isValidPassword) {
      return;
    }

    // Account create hone ke baad Home page open hoga
    router.replace("/(tabs)/home");
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
            <Ionicons name="arrow-back" size={24} color="#1B4332" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            {/* Lock Icon */}
            <View style={styles.logoContainer}>
              <Ionicons name="lock-closed" size={42} color="#2E8B57" />
            </View>

            <Text style={styles.title}>Create Password</Text>

            <Text style={styles.subtitle}>
              Create a strong password to secure your
            </Text>

            <Text style={styles.subtitle}>EcoCraft account 🔐</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            {/* Email Box */}
            <View style={styles.emailBox}>
              <View style={styles.emailIcon}>
                <Ionicons name="mail" size={19} color="#2E8B57" />
              </View>

              <View style={styles.emailContent}>
                <Text style={styles.emailLabel}>Creating account for</Text>

                <Text style={styles.emailText} numberOfLines={1}>
                  {email || "Your Gmail"}
                </Text>
              </View>
            </View>

            {/* Password Label */}
            <Text style={styles.label}>Create Password</Text>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#2E8B57" />

              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                maxLength={8}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthHeader}>
                  <Text style={styles.strengthTitle}>Password Strength</Text>

                  <Text
                    style={[
                      styles.strengthText,
                      {
                        color: isValidPassword ? "#2E8B57" : "#F59E0B",
                      },
                    ]}
                  >
                    {isValidPassword ? "Strong" : "Improve Password"}
                  </Text>
                </View>

                {/* Progress Background */}
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${
                          [
                            hasLength,
                            hasUppercase,
                            hasNumber,
                            hasSpecial,
                          ].filter(Boolean).length * 25
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>
            )}

            {/* Password Rules */}
            <View style={styles.rulesContainer}>
              <Text style={styles.rulesTitle}>
                Your password should contain:
              </Text>

              <PasswordRule text="At least 8 characters" valid={hasLength} />

              <PasswordRule text="One uppercase letter" valid={hasUppercase} />

              <PasswordRule text="One number" valid={hasNumber} />

              <PasswordRule
                text="One special character (!@#$)"
                valid={hasSpecial}
              />
            </View>

            {/* Create Account Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.continueButton,
                !isValidPassword && styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!isValidPassword}
            >
              <Text style={styles.continueText}>Create Account</Text>

              <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Secure Text */}
          <View style={styles.secureContainer}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#2E8B57"
            />

            <Text style={styles.secureText}>
              Your password is securely protected
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Password Rule Component
const PasswordRule = ({ text, valid }: { text: string; valid: boolean }) => {
  return (
    <View style={styles.ruleRow}>
      <Ionicons
        name={valid ? "checkmark-circle" : "ellipse-outline"}
        size={17}
        color={valid ? "#2E8B57" : "#94A3B8"}
      />

      <Text style={[styles.ruleText, valid && styles.validRule]}>{text}</Text>
    </View>
  );
};

export default Password;

// ================= STYLES =================

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

  // Back Button
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  // Header
  header: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
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
  },

  // Card
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

  // Email Box
  emailBox: {
    minHeight: 62,
    borderRadius: 16,
    backgroundColor: "#F0FDF4",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 25,
  },

  emailIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  emailContent: {
    flex: 1,
  },

  emailLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 3,
  },

  emailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  // Label
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 10,
  },

  // Input
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

  // Strength
  strengthContainer: {
    marginTop: 18,
  },

  strengthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  strengthTitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  strengthText: {
    fontSize: 12,
    fontWeight: "700",
  },

  progressBackground: {
    height: 6,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#2E8B57",
  },

  // Rules
  rulesContainer: {
    marginTop: 20,
  },

  rulesTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 7,
  },

  ruleText: {
    fontSize: 12,
    color: "#94A3B8",
    marginLeft: 8,
  },

  validRule: {
    color: "#2E8B57",
  },

  // Button
  continueButton: {
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

  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },

  // Secure
  secureContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  secureText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 7,
  },
});
