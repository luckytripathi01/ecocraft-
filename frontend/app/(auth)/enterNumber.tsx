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

const EnterNumber = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleContinue = () => {
    if (phoneNumber.length !== 10) {
      return;
    }

    // Phone number ko OTP page par bhejna
    router.push({
      pathname: "../(auth)/otp",
      params: {
        phone: phoneNumber,
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
            <View style={styles.logoContainer}>
              <Ionicons
                name="phone-portrait-outline"
                size={45}
                color="#2E8B57"
              />
            </View>

            <Text style={styles.title}>Enter Your Number</Text>

            <Text style={styles.subtitle}>
              Enter your mobile number to continue your
            </Text>

            <Text style={styles.subtitle}>journey with EcoCraft 🌱</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            <Text style={styles.label}>Mobile Number</Text>

            {/* Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={22} color="#2E8B57" />

              <Text style={styles.countryCode}>+91</Text>

              <View style={styles.verticalLine} />

              <TextInput
                style={styles.input}
                placeholder="Enter 10 digit number"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={(text) => {
                  const onlyNumbers = text.replace(/[^0-9]/g, "");

                  setPhoneNumber(onlyNumbers);
                }}
              />

              {/* Validation Icon */}
              {phoneNumber.length > 0 && (
                <Ionicons
                  name={
                    phoneNumber.length === 10
                      ? "checkmark-circle"
                      : "close-circle"
                  }
                  size={22}
                  color={phoneNumber.length === 10 ? "#2E8B57" : "#EF4444"}
                />
              )}
            </View>

            {/* Number Status */}
            {phoneNumber.length > 0 && (
              <Text
                style={[
                  styles.statusText,
                  {
                    color: phoneNumber.length === 10 ? "#2E8B57" : "#EF4444",
                  },
                ]}
              >
                {phoneNumber.length === 10
                  ? "Valid mobile number ✓"
                  : `Enter ${10 - phoneNumber.length} more digit(s)`}
              </Text>
            )}

            {/* Info */}
            <View style={styles.infoContainer}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color="#2E8B57"
              />

              <Text style={styles.infoText}>
                We'll send you a verification code on this number.
              </Text>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.continueButton,
                phoneNumber.length !== 10 && styles.disabledButton,
              ]}
              onPress={handleContinue}
              disabled={phoneNumber.length !== 10}
            >
              <Text style={styles.continueText}>Continue</Text>

              <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Bottom */}
          <View style={styles.bottomContainer}>
            <View style={styles.secureRow}>
              <Ionicons
                name="shield-checkmark-outline"
                size={18}
                color="#2E8B57"
              />

              <Text style={styles.secureText}>
                Your number is safe and secure
              </Text>
            </View>

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

export default EnterNumber;

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

  countryCode: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
    marginLeft: 10,
  },

  verticalLine: {
    width: 1,
    height: 25,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 12,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },

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
