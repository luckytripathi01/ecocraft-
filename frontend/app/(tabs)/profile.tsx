import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Profile = () => {

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            router.replace("../(auth)/login");
          },
        },
      ]
    );
  };

  // Settings page open karne ke liye
  const openSettings = () => {
    router.push("/setting");
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* ================= HEADER ================= */}

        <View style={styles.header}>

          <Text style={styles.title}>
            My Profile
          </Text>

          {/* SETTINGS ICON */}

          <TouchableOpacity
            style={styles.settingsButton}
            activeOpacity={0.7}
            onPress={openSettings}
          >
            <Ionicons
              name="settings-outline"
              size={23}
              color="#1B4332"
            />
          </TouchableOpacity>

        </View>


        {/* ================= PROFILE CARD ================= */}

        <View style={styles.profileCard}>

          <View style={styles.avatarContainer}>

            <Text style={styles.avatarText}>
              R
            </Text>

            <TouchableOpacity
              style={styles.editAvatar}
            >
              <Ionicons
                name="camera"
                size={14}
                color="#FFFFFF"
              />
            </TouchableOpacity>

          </View>


          <Text style={styles.userName}>
            Eco User
          </Text>

          <Text style={styles.userEmail}>
            eco.user@gmail.com
          </Text>

          <View style={styles.levelBadge}>

            <Ionicons
              name="leaf"
              size={15}
              color="#2E8B57"
            />

            <Text style={styles.levelText}>
              Eco Explorer
            </Text>

          </View>

        </View>


        {/* ================= STATS ================= */}

        <View style={styles.statsContainer}>

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              24
            </Text>

            <Text style={styles.statLabel}>
              Items Reused
            </Text>
          </View>


          <View style={styles.statDivider} />


          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              850
            </Text>

            <Text style={styles.statLabel}>
              Eco Points
            </Text>
          </View>


          <View style={styles.statDivider} />


          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              12
            </Text>

            <Text style={styles.statLabel}>
              Ideas Tried
            </Text>
          </View>

        </View>


        {/* ================= ECO JOURNEY ================= */}

        <View style={styles.levelCard}>

          <View style={styles.levelHeader}>

            <View>

              <Text style={styles.levelTitle}>
                Your Eco Journey 🌱
              </Text>

              <Text style={styles.levelSubtitle}>
                150 points to reach Eco Hero
              </Text>

            </View>

            <Text style={styles.pointsText}>
              850 / 1000
            </Text>

          </View>


          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>


          <View style={styles.progressFooter}>

            <Text style={styles.progressText}>
              Eco Explorer
            </Text>

            <Text style={styles.progressText}>
              Eco Hero 🏆
            </Text>

          </View>

        </View>


        {/* ================= ACCOUNT ================= */}

        <Text style={styles.sectionTitle}>
          Account
        </Text>


        {/* Edit Profile */}

        <TouchableOpacity
          style={styles.menuItem}
        >

          <View
            style={[
              styles.menuIcon,
              { backgroundColor: "#DDF4E3" },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={21}
              color="#2E8B57"
            />
          </View>

          <View style={styles.menuContent}>

            <Text style={styles.menuTitle}>
              Edit Profile
            </Text>

            <Text style={styles.menuSubtitle}>
              Update your personal information
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />

        </TouchableOpacity>


        {/* Favorites */}

        <TouchableOpacity
          style={styles.menuItem}
        >

          <View
            style={[
              styles.menuIcon,
              { backgroundColor: "#FFF4D6" },
            ]}
          >
            <Ionicons
              name="heart-outline"
              size={21}
              color="#E5A800"
            />
          </View>

          <View style={styles.menuContent}>

            <Text style={styles.menuTitle}>
              My Favorites
            </Text>

            <Text style={styles.menuSubtitle}>
              View your saved reuse ideas
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />

        </TouchableOpacity>


        {/* Achievements */}

        <TouchableOpacity
          style={styles.menuItem}
        >

          <View
            style={[
              styles.menuIcon,
              { backgroundColor: "#E7E0FF" },
            ]}
          >
            <Ionicons
              name="trophy-outline"
              size={21}
              color="#7C3AED"
            />
          </View>

          <View style={styles.menuContent}>

            <Text style={styles.menuTitle}>
              My Achievements
            </Text>

            <Text style={styles.menuSubtitle}>
              Check your eco achievements
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />

        </TouchableOpacity>


        {/* ================= APP SETTINGS ================= */}

        <Text style={styles.sectionTitle}>
          App Settings
        </Text>


        {/* SETTINGS OPTION */}

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.7}
          onPress={openSettings}
        >

          <View
            style={[
              styles.menuIcon,
              { backgroundColor: "#DDF4E3" },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={21}
              color="#2E8B57"
            />
          </View>

          <View style={styles.menuContent}>

            <Text style={styles.menuTitle}>
              Settings
            </Text>

            <Text style={styles.menuSubtitle}>
              Manage your app preferences
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />

        </TouchableOpacity>


        {/* Notifications */}

        <TouchableOpacity
          style={styles.menuItem}
        >

          <View
            style={[
              styles.menuIcon,
              { backgroundColor: "#E0F2FE" },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={21}
              color="#0284C7"
            />
          </View>

          <View style={styles.menuContent}>

            <Text style={styles.menuTitle}>
              Notifications
            </Text>

            <Text style={styles.menuSubtitle}>
              Manage your notifications
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />

        </TouchableOpacity>


        {/* Help */}

        <TouchableOpacity
          style={styles.menuItem}
        >

          <View
            style={[
              styles.menuIcon,
              { backgroundColor: "#F1F5F9" },
            ]}
          >
            <Ionicons
              name="help-circle-outline"
              size={21}
              color="#64748B"
            />
          </View>

          <View style={styles.menuContent}>

            <Text style={styles.menuTitle}>
              Help & Support
            </Text>

            <Text style={styles.menuSubtitle}>
              Get help with EcoCraft
            </Text>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />

        </TouchableOpacity>


        {/* ================= LOGOUT ================= */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >

          <Ionicons
            name="log-out-outline"
            size={22}
            color="#E63946"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>

        </TouchableOpacity>


        {/* ================= FOOTER ================= */}

        <View style={styles.footer}>

          <Ionicons
            name="leaf"
            size={17}
            color="#2E8B57"
          />

          <Text style={styles.footerText}>
            Keep creating a greener future 🌍
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default Profile;


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#F4FBF5",
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B4332",
  },

  settingsButton: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    alignItems: "center",
    paddingVertical: 25,
    elevation: 4,
  },

  avatarContainer: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#2E8B57",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  avatarText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  editAvatar: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#1B4332",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  userName: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1B4332",
    marginTop: 13,
  },

  userEmail: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },

  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DDF4E3",
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 7,
    marginTop: 12,
  },

  levelText: {
    color: "#2E8B57",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 5,
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    marginTop: 15,
    elevation: 2,
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2E8B57",
  },

  statLabel: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 5,
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: "#E2E8F0",
  },

  levelCard: {
    backgroundColor: "#2E8B57",
    borderRadius: 22,
    padding: 18,
    marginTop: 15,
  },

  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  levelTitle: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  levelSubtitle: {
    fontSize: 11,
    color: "#DDF4E3",
    marginTop: 5,
  },

  pointsText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  progressBackground: {
    height: 9,
    borderRadius: 10,
    backgroundColor: "#78B892",
    marginTop: 18,
    overflow: "hidden",
  },

  progressFill: {
    width: "85%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },

  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  progressText: {
    fontSize: 10,
    color: "#DDF4E3",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B4332",
    marginTop: 25,
    marginBottom: 12,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 13,
    marginBottom: 10,
    elevation: 2,
  },

  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  menuContent: {
    flex: 1,
    marginLeft: 12,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
  },

  menuSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },

  logoutButton: {
    height: 55,
    borderRadius: 17,
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FECDD3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  logoutText: {
    color: "#E63946",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 8,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  footerText: {
    fontSize: 11,
    color: "#94A3B8",
    marginLeft: 6,
  },

});