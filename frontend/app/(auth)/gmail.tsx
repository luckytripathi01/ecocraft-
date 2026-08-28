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
import { router } from "expo-router";

const Gmail = () => {
  const [email, setEmail] = useState("");

  // Continue Button
  const handleContinue = () => {
    if (email.trim() === "") {
      return;
    }

    // Email ko password page par send karna
    router.push({
      pathname: "../(auth)/password",
      params: {
        email: email,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
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
            {/* Gmail Icon */}
            <View style={styles.logoContainer}>
              <Text style={styles.gmailLogo}>M</Text>
            </View>

            <Text style={styles.title}>Enter Your Gmail</Text>

            <Text style={styles.subtitle}>
              Enter your Gmail address to continue your
            </Text>

            <Text style={styles.subtitle}>journey with EcoCraft 🌱</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            {/* Label */}
            <Text style={styles.label}>Gmail Address</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={22} color="#2E8B57" />

              <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />

              {/* Email Validation Icon */}
              {email.length > 0 && (
                <Ionicons
                  name={
                    email.includes("@") ? "checkmark-circle" : "close-circle"
                  }
                  size={22}
                  color={email.includes("@") ? "#2E8B57" : "#EF4444"}
                />
              )}
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color="#2E8B57"
              />

              <Text style={styles.infoText}>
                We'll use your email to securely create your account.
              </Text>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.continueButton,
                email.length === 0 && styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={email.length === 0}
            >
              <Text style={styles.continueText}>Continue</Text>

              <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Bottom Text */}
          <View style={styles.bottomContainer}>
            {/* Security */}
            <View style={styles.secureRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#2E8B57"
              />

              <Text style={styles.secureText}>Your information is secure</Text>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text style={styles.link}>Terms & Conditions</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Gmail;

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

  /* Gmail Logo */

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

  gmailLogo: {
    fontSize: 48,
    fontWeight: "800",
    color: "#EA4335",
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

  /* Main Card */

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

  /* Input */

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

  /* Info */

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#64748B",
    marginLeft: 8,
    lineHeight: 18,
  },

  /* Continue Button */

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

  /* Bottom */

  bottomContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  secureText: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 7,
  },

  termsText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },

  link: {
    color: "#2E8B57",
    fontWeight: "700",
  },
});
