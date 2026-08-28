import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* Header */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#1B4332"
            />
          </TouchableOpacity>

          <Text style={styles.title}>
            Settings
          </Text>

          <View style={styles.emptyView} />

        </View>


        {/* Preferences */}

        <Text style={styles.sectionTitle}>
          Preferences
        </Text>


        {/* Notifications */}

        <View style={styles.settingCard}>

          <View style={styles.iconBox}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#2E8B57"
            />
          </View>

          <View style={styles.settingContent}>

            <Text style={styles.settingTitle}>
              Notifications
            </Text>

            <Text style={styles.settingSubtitle}>
              Get updates about new ideas
            </Text>

          </View>

          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{
              false: "#CBD5E1",
              true: "#A7C9B2",
            }}
            thumbColor={
              notifications ? "#2E8B57" : "#F8FAFC"
            }
          />

        </View>


        {/* Dark Mode */}

        <View style={styles.settingCard}>

          <View
            style={[
              styles.iconBox,
              { backgroundColor: "#E7E0FF" },
            ]}
          >

            <Ionicons
              name="moon-outline"
              size={22}
              color="#7C3AED"
            />

          </View>

          <View style={styles.settingContent}>

            <Text style={styles.settingTitle}>
              Dark Mode
            </Text>

            <Text style={styles.settingSubtitle}>
              Change app appearance
            </Text>

          </View>

          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{
              false: "#CBD5E1",
              true: "#A7C9B2",
            }}
            thumbColor={
              darkMode ? "#2E8B57" : "#F8FAFC"
            }
          />

        </View>


        {/* Account */}

        <Text style={styles.sectionTitle}>
          Account
        </Text>


        <TouchableOpacity style={styles.settingCard}>

          <View
            style={[
              styles.iconBox,
              { backgroundColor: "#FFF4D6" },
            ]}
          >

            <Ionicons
              name="lock-closed-outline"
              size={22}
              color="#E5A800"
            />

          </View>

          <View style={styles.settingContent}>

            <Text style={styles.settingTitle}>
              Change Password
            </Text>

            <Text style={styles.settingSubtitle}>
              Update your account password
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#94A3B8"
          />

        </TouchableOpacity>


        <TouchableOpacity style={styles.settingCard}>

          <View
            style={[
              styles.iconBox,
              { backgroundColor: "#E0F2FE" },
            ]}
          >

            <Ionicons
              name="language-outline"
              size={22}
              color="#0284C7"
            />

          </View>

          <View style={styles.settingContent}>

            <Text style={styles.settingTitle}>
              Language
            </Text>

            <Text style={styles.settingSubtitle}>
              English
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#94A3B8"
          />

        </TouchableOpacity>


        {/* Privacy */}

        <Text style={styles.sectionTitle}>
          Privacy & Security
        </Text>


        <TouchableOpacity style={styles.settingCard}>

          <View
            style={[
              styles.iconBox,
              { backgroundColor: "#DDF4E3" },
            ]}
          >

            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#2E8B57"
            />

          </View>

          <View style={styles.settingContent}>

            <Text style={styles.settingTitle}>
              Privacy & Security
            </Text>

            <Text style={styles.settingSubtitle}>
              Manage your privacy settings
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#94A3B8"
          />

        </TouchableOpacity>


        {/* About */}

        <Text style={styles.sectionTitle}>
          About EcoCraft
        </Text>


        <TouchableOpacity style={styles.settingCard}>

          <View
            style={[
              styles.iconBox,
              { backgroundColor: "#F1F5F9" },
            ]}
          >

            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#64748B"
            />

          </View>

          <View style={styles.settingContent}>

            <Text style={styles.settingTitle}>
              About App
            </Text>

            <Text style={styles.settingSubtitle}>
              EcoCraft Version 1.0.0
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color="#94A3B8"
          />

        </TouchableOpacity>


        {/* Footer */}

        <View style={styles.footer}>

          <Ionicons
            name="leaf"
            size={18}
            color="#2E8B57"
          />

          <Text style={styles.footerText}>
            Build a greener future with EcoCraft 🌍
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default Settings;


const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#F4FBF5",
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 20,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1B4332",
  },

  emptyView: {
    width: 45,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B4332",
    marginTop: 20,
    marginBottom: 12,
  },

  settingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
  },

  settingContent: {
    flex: 1,
    marginLeft: 12,
  },

  settingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
  },

  settingSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  footerText: {
    fontSize: 11,
    color: "#94A3B8",
    marginLeft: 6,
  },

});