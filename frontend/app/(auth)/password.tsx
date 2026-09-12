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

const Password = () => {
  const { email } = useLocalSearchParams<{ email: string }>();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");

  // Password Rules
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const isValidPassword =
    hasLength &&
    hasUppercase &&
    hasNumber &&
    hasSpecial;

  const handleContinue = async () => {
    if (!email) {
      Alert.alert("Error", "Email address is missing.");
      return;
    }

    if (!isValidPassword) {
      Alert.alert(
        "Weak Password",
        "Password must contain at least 8 characters, one uppercase letter, one number and one special character."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: email.split("@")[0],
          email: email,
          password: password,
          phone: null,
          role: role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        Alert.alert(
          "Signup Failed",
          result?.detail || "Unable to create account."
        );
        return;
      }

      Alert.alert(
        "Account Created",
        "Your EcoCraft account has been created successfully!",
        [
          {
            text: "Continue",
            onPress: () => {

              if (result.role === "seller") {
                router.replace("/seller" as any);
              } else {
                router.replace("/(tabs)/home");
              }

            },
          },
        ]
      );
    } catch (error) {
      console.error("Signup error:", error);

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
                name="lock-closed"
                size={42}
                color="#2E8B57"
              />
            </View>

            <Text style={styles.title}>Create Password</Text>

            <Text style={styles.subtitle}>
              Create a strong password to secure your
            </Text>

            <Text style={styles.subtitle}>
              EcoCraft account 🌱
            </Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.label}>Password</Text>

            {/* Password Input */}
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
                onPress={() => setShowPassword(!showPassword)}
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

            {/* Account Type Selection */}

            <Text style={styles.label}>Select Account Type</Text>

            <View style={styles.rulesContainer}>

              {/* User */}
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "user" && styles.selectedRole,
                ]}
                onPress={() => setRole("user")}
              >
                <Ionicons
                  name="person-outline"
                  size={28}
                  color={role === "user" ? "#FFFFFF" : "#2E8B57"}
                />

                <Text
                  style={[
                    styles.ruleText,
                    role === "user" && styles.selectedRoleText,
                  ]}
                >
                  User
                </Text>

                <Text
                  style={[
                    styles.roleDescription,
                    role === "user" && styles.selectedRoleText,
                  ]}
                >
                  Explore & Create
                </Text>

              </TouchableOpacity>


              {/* Seller */}
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "seller" && styles.selectedRole,
                ]}
                onPress={() => setRole("seller")}
              >
                <Ionicons
                  name="storefront-outline"
                  size={28}
                  color={role === "seller" ? "#FFFFFF" : "#2E8B57"}
                />

                <Text
                  style={[
                    styles.ruleText,
                    role === "seller" && styles.selectedRoleText,
                  ]}
                >
                  Seller
                </Text>

                <Text
                  style={[
                    styles.roleDescription,
                    role === "seller" && styles.selectedRoleText,
                  ]}
                >
                  Sell Products
                </Text>

              </TouchableOpacity>

            </View>
            {/* Create Account Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.continueButton,
                (!isValidPassword || loading) &&
                styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={!isValidPassword || loading}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Text style={styles.continueText}>
                    Create Account
                  </Text>

                  <Ionicons
                    name="arrow-forward"
                    size={21}
                    color="#FFFFFF"
                  />
                </>
              )}
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
                Your password is securely encrypted
              </Text>
            </View>
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
        name={valid ? "checkmark-circle" : "ellipse-outline"}
        size={18}
        color={valid ? "#2E8B57" : "#94A3B8"}
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

export default Password;

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

  rulesContainer: {
    marginTop: 18,
  },

  roleButton: {
    minHeight: 82,
    borderWidth: 1.5,
    borderColor: "#DDE5DF",
    borderRadius: 17,
    backgroundColor: "#F8FAFC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  selectedRole: {
    backgroundColor: "#2E8B57",
    borderColor: "#2E8B57",
  },

  selectedRoleText: {
    color: "#FFFFFF",
  },

  roleDescription: {
    flex: 1,
    fontSize: 12,
    color: "#64748B",
    marginLeft: 12,
  },

  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  ruleText: {
    fontSize: 13,
    color: "#94A3B8",
    marginLeft: 8,
  },

  validRuleText: {
    color: "#2E8B57",
  },

  continueButton: {
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

  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
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
