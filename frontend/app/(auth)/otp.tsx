import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const OTP = () => {
  const { phone } = useLocalSearchParams();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [timer, setTimer] = useState(30);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((previousTimer) => {
        if (previousTimer <= 1) {
          clearInterval(interval);
          return 0;
        }

        return previousTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // OTP Input
  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace
  const handleKeyPress = (event: any, index: number) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      otp[index] === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Resend OTP
  const handleResend = () => {
    if (timer === 0) {
      setOtp(["", "", "", "", "", ""]);

      setTimer(30);

      inputRefs.current[0]?.focus();

      Alert.alert("OTP Resent", "Demo OTP is 123456");
    }
  };

  // Verify OTP
  const handleVerify = () => {
    const enteredOtp = otp.join("");

    // Demo OTP
    const demoOtp = "123456";

    if (enteredOtp.length !== 6) {
      Alert.alert("Incomplete OTP", "Please enter all 6 digits.");

      return;
    }

    if (enteredOtp === demoOtp) {
      Alert.alert(
        "Verification Successful 🎉",
        "Your mobile number has been verified.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.push({
                pathname: "../(auth)/password",
                params: {
                  phone: phone,
                },
              });
            },
          },
        ],
      );
    } else {
      Alert.alert("Invalid OTP ❌", "For demo, please enter 123456.");
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

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
          {/* Top Header */}
          <View style={styles.topHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={23} color="#1B4332" />
            </TouchableOpacity>

            <Text style={styles.stepText}>Step 2 of 3</Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            {/* Shield Icon */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="shield-checkmark" size={42} color="#2E8B57" />
              </View>
            </View>

            <Text style={styles.title}>Verify Your Number</Text>

            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code
            </Text>

            <Text style={styles.subtitle}>to your mobile number</Text>
          </View>

          {/* Main Card */}
          <View style={styles.card}>
            {/* Phone Number */}
            <View style={styles.phoneBox}>
              <View style={styles.phoneIconBox}>
                <Ionicons name="call" size={20} color="#2E8B57" />
              </View>

              <View style={styles.phoneContent}>
                <Text style={styles.sentText}>Verification code sent to</Text>

                <Text style={styles.phoneText}>+91 {phone}</Text>
              </View>

              <Ionicons name="checkmark-circle" size={23} color="#2E8B57" />
            </View>

            {/* OTP Title */}
            <Text style={styles.label}>Enter Verification Code</Text>

            <Text style={styles.helperText}>
              Enter the 6-digit code sent to your phone
            </Text>

            {/* OTP Boxes */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,

                    digit !== "" && styles.activeOtpInput,
                  ]}
                  value={digit}
                  onChangeText={(value) => {
                    const onlyNumber = value.replace(/[^0-9]/g, "");

                    handleOtpChange(onlyNumber, index);
                  }}
                  onKeyPress={(event) => handleKeyPress(event, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Demo Hint */}
            <View style={styles.demoBox}>
              <Ionicons name="flask-outline" size={18} color="#2E8B57" />

              <Text style={styles.demoText}>Demo OTP: 123456</Text>
            </View>

            {/* Resend */}
            <View style={styles.resendContainer}>
              <Text style={styles.didntReceive}>Didn't receive the code?</Text>

              {timer > 0 ? (
                <View style={styles.timerBox}>
                  <Ionicons name="time-outline" size={16} color="#64748B" />

                  <Text style={styles.timerText}>
                    Resend in 00:
                    {timer < 10 ? `0${timer}` : timer}
                  </Text>
                </View>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendText}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.verifyButton,

                !isOtpComplete && styles.disabledButton,
              ]}
              onPress={handleVerify}
              disabled={!isOtpComplete}
            >
              <Text style={styles.verifyText}>Verify & Continue</Text>

              <Ionicons name="arrow-forward" size={21} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.securityContainer}>
            <View style={styles.securityIcon}>
              <Ionicons name="lock-closed" size={17} color="#2E8B57" />
            </View>

            <View>
              <Text style={styles.securityTitle}>
                Your verification is secure
              </Text>

              <Text style={styles.securityText}>
                We never share your personal information.
              </Text>
            </View>
          </View>

          <Text style={styles.bottomText}>
            By continuing, you agree to our{" "}
            <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTP;

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
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
  },

  stepText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },

  header: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 28,
  },

  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 30,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B4332",
    marginBottom: 9,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,

    shadowColor: "#1B4332",
    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.08,
    shadowRadius: 16,

    elevation: 6,
  },

  phoneBox: {
    minHeight: 68,
    borderRadius: 17,
    backgroundColor: "#F0FDF4",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 25,
  },

  phoneIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  phoneContent: {
    flex: 1,
  },

  sentText: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 3,
  },

  phoneText: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "700",
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 5,
  },

  helperText: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 16,
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  otpInput: {
    width: 43,
    height: 56,
    borderWidth: 1.5,
    borderColor: "#DDE5DF",
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
    color: "#1B4332",
  },

  activeOtpInput: {
    borderColor: "#2E8B57",
    backgroundColor: "#F0FDF4",
  },

  demoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 18,
  },

  demoText: {
    fontSize: 12,
    color: "#2E8B57",
    fontWeight: "700",
    marginLeft: 7,
  },

  resendContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  didntReceive: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 8,
  },

  timerBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  timerText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
    marginLeft: 5,
  },

  resendText: {
    fontSize: 14,
    color: "#2E8B57",
    fontWeight: "800",
  },

  verifyButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: "#2E8B57",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
  },

  disabledButton: {
    backgroundColor: "#A7C9B2",
  },

  verifyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 10,
  },

  securityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },

  securityIcon: {
    width: 35,
    height: 35,
    borderRadius: 12,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },

  securityTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },

  securityText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },

  bottomText: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 22,
    lineHeight: 17,
  },

  link: {
    color: "#2E8B57",
    fontWeight: "700",
  },
});
