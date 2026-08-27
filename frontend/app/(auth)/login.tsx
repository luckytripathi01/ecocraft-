import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const CreateAccount = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🌱</Text>
          </View>

          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Join EcoCraft and turn your waste into something valuable ♻️
          </Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Let's Get Started </Text>

          <Text style={styles.descText}>
            Create your free account and start your journey towards
          </Text>

          <Text style={styles.descText}>a cleaner and greener future.</Text>

          {/* Google Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button, styles.googleBtn]}
            onPress={() => router.push("../(auth)/google")}
          >
            <View style={styles.iconBox}>
              <Image
                source={require("../../assets/images/google.png")}
                style={styles.icon}
              />
            </View>

            <Text style={styles.googleText}>Continue with Google</Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
              style={styles.arrow}
            />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Gmail Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button, styles.gmailBtn]}
            onPress={() => router.push("../(auth)/gmail")}
          >
            <View style={styles.iconBox}>
              <Image
                source={require("../../assets/images/gmail.png")}
                style={styles.icon}
              />
            </View>

            <Text style={styles.darkText}>Continue with Gmail</Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#64748B"
              style={styles.arrow}
            />
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* Phone Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.button, styles.phoneBtn]}
            onPress={() => router.push("../(auth)/enterNumber")}
          >
            <View style={styles.iconBox}>
              <Image
                source={require("../../assets/images/contacts 1.png")}
                style={styles.icon}
              />
            </View>

            <Text style={styles.darkText}>Continue with Number</Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color="#64748B"
              style={styles.arrow}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Text */}
        <Text style={styles.bottomText}>
          By continuing, you agree to our{" "}
          <Text style={styles.link}>Terms & Conditions</Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4FBF5",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  /* Header */
  header: {
    alignItems: "center",
    marginTop: 45,
    marginBottom: 25,
  },

  logoContainer: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: "#DDF4E3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  logo: {
    fontSize: 40,
    
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1B4332",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  /* Card */
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
    shadowRadius: 15,

    elevation: 5,
  },

  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 12,
  },

  descText: {
    fontSize: 14,
    color: "#64748B",
    lineHeight: 21,
  },

  /* Buttons */
  button: {
    height: 58,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginTop: 18,
  },

  googleBtn: {
    backgroundColor: "#2E8B57",
  },

  gmailBtn: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  phoneBtn: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    width: 21,
    height: 21,
    resizeMode: "contain",
  },

  googleText: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  darkText: {
    flex: 1,
    textAlign: "center",
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
  },

  arrow: {
    marginLeft: 8,
  },

  /* Divider */
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  orText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    marginHorizontal: 12,
  },

  /* Bottom */
  bottomText: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 22,
    lineHeight: 18,
  },

  link: {
    color: "#2E8B57",
    fontWeight: "700",
  },
});
