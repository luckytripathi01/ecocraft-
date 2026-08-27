import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Home = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.userName}>Welcome to EcoCraft</Text>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#1B4332" />

            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* ================= HERO CARD ================= */}

        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Turn Waste Into</Text>

            <Text style={styles.heroTitle}>Something Amazing ✨</Text>

            <Text style={styles.heroSubtitle}>
              Discover creative ways to reuse your everyday waste.
            </Text>

            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => router.push("/(tabs)/scan")}
            >
              <Ionicons name="scan-outline" size={20} color="#1B4332" />

              <Text style={styles.scanButtonText}>Scan My Waste</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroIconContainer}>
            <Text style={styles.heroEmoji}>♻️</Text>

            <Text style={styles.heroSmallEmoji}>🌱</Text>
          </View>
        </View>

        {/* ================= SECTION TITLE ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {/* ================= QUICK ACTIONS ================= */}

        <View style={styles.quickActions}>
          {/* SCAN */}

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/scan")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#DDF4E3" }]}>
              <Ionicons name="camera-outline" size={25} color="#2E8B57" />
            </View>

            <Text style={styles.actionTitle}>Scan Waste</Text>

            <Text style={styles.actionSubtitle}>Find ideas</Text>
          </TouchableOpacity>

          {/* IDEAS */}

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/ideas")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FFF4D6" }]}>
              <Ionicons name="bulb-outline" size={25} color="#E5A800" />
            </View>

            <Text style={styles.actionTitle}>Get Ideas</Text>

            <Text style={styles.actionSubtitle}>Explore crafts</Text>
          </TouchableOpacity>

          {/* SELL */}

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: "#E7E0FF" }]}>
              <Ionicons name="document-text-outline" size={25} color="#7357D9" />
            </View>

            <Text style={styles.actionTitle}>Certificate</Text>

            <Text style={styles.actionSubtitle}>Skills</Text>
          </TouchableOpacity>

          {/* LEARN */}

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(tabs)/ideas")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FFE1E1" }]}>
              <Ionicons name="book-outline" size={25} color="#E05A5A" />
            </View>

            <Text style={styles.actionTitle}>Learn</Text>

            <Text style={styles.actionSubtitle}>Learn & create</Text>
          </TouchableOpacity>
        </View>

        {/* ================= AI SCANNER ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Waste Scanner 🤖</Text>
        </View>

        <TouchableOpacity
          style={styles.scannerCard}
          onPress={() => router.push("/(tabs)/scan")}
        >
          <View style={styles.scannerIconContainer}>
            <Ionicons name="sparkles" size={35} color="#2E8B57" />
          </View>

          <View style={styles.scannerContent}>
            <Text style={styles.scannerTitle}>What waste do you have?</Text>

            <Text style={styles.scannerSubtitle}>
              Upload a photo and let AI discover creative reuse ideas for you.
            </Text>

            <View style={styles.tryNowRow}>
              <Text style={styles.tryNowText}>Try Now</Text>

              <Ionicons name="arrow-forward" size={18} color="#2E8B57" />
            </View>
          </View>
        </TouchableOpacity>

        {/* ================= TRENDING IDEAS ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Ideas 🔥</Text>

          <Text style={styles.seeAll}>View All </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Card 1 */}
          <TouchableOpacity style={styles.trendingCard}>
            <View
              style={[styles.trendingImage, { backgroundColor: "#DDF4E3" }]}
            >
              <Text style={styles.trendingEmoji}>🪴</Text>
            </View>

            <Text style={styles.trendingTitle}>Plastic Bottle</Text>

            <Text style={styles.trendingSubtitle}>Plant Pot 🌱</Text>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color="#64748B" />

              <Text style={styles.timeText}>15 min</Text>
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.trendingCard}>
            <View
              style={[styles.trendingImage, { backgroundColor: "#FFF4D6" }]}
            >
              <Text style={styles.trendingEmoji}>👜</Text>
            </View>

            <Text style={styles.trendingTitle}>Old T-Shirt</Text>

            <Text style={styles.trendingSubtitle}>Tote Bag 🛍️</Text>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color="#64748B" />

              <Text style={styles.timeText}>30 min</Text>
            </View>
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity style={styles.trendingCard}>
            <View
              style={[styles.trendingImage, { backgroundColor: "#E7E0FF" }]}
            >
              <Text style={styles.trendingEmoji}>🗂️</Text>
            </View>

            <Text style={styles.trendingTitle}>Cardboard</Text>

            <Text style={styles.trendingSubtitle}>Home Decor ✨</Text>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color="#64748B" />

              <Text style={styles.timeText}>25 min</Text>
            </View>
          </TouchableOpacity>
          {/* Card 4 */}
          <TouchableOpacity style={styles.trendingCard}>
            <View
              style={[styles.trendingImage, { backgroundColor: "#FFF4D6" }]}
            >
              <Text style={styles.trendingEmoji}>🗞️</Text>
            </View>

            <Text style={styles.trendingTitle}>Newspaper Waste</Text>

            <Text style={styles.trendingSubtitle}>Wall Decoration 🛍️</Text>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color="#64748B" />

              <Text style={styles.timeText}>30 min</Text>
            </View>
          </TouchableOpacity>
          {/* Card 5 */}
          <TouchableOpacity style={styles.trendingCard}>
            <View
              style={[styles.trendingImage, { backgroundColor: "#FFF4D6" }]}
            >
              <Text style={styles.trendingEmoji}>🥫</Text>
            </View>

            <Text style={styles.trendingTitle}>Steel Cans</Text>

            <Text style={styles.trendingSubtitle}>chandelier 🏠</Text>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color="#64748B" />

              <Text style={styles.timeText}>25 min</Text>
            </View>
          </TouchableOpacity>
          {/* Card 6 */}
          <TouchableOpacity style={styles.trendingCard}>
            <View
              style={[styles.trendingImage, { backgroundColor: "#FFF4D6" }]}
            >
              <Text style={styles.trendingEmoji}>🛋️</Text>
            </View>

            <Text style={styles.trendingTitle}>E-Waste</Text>

            <Text style={styles.trendingSubtitle}>Decorative Lamp💡</Text>

            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color="#64748B" />

              <Text style={styles.timeText}>30 min</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* ================= ECO IMPACT ================= */}

        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <View>
              <Text style={styles.impactTitle}>Your Eco Impact 🌍</Text>

              <Text style={styles.impactSubtitle}>
                Every small action makes a difference.
              </Text>
            </View>

            <Text style={styles.impactEmoji}>🌱</Text>
          </View>

          <View style={styles.impactStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>

              <Text style={styles.statLabel}>Items Reused</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8.5 kg</Text>

              <Text style={styles.statLabel}>Waste Saved</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>

              <Text style={styles.statLabel}>Trees Saved</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4FBF5",
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // Header

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 22,
  },

  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1B4332",
  },

  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#E63946",
  },

  // Hero

  heroCard: {
    minHeight: 205,
    borderRadius: 28,
    backgroundColor: "#2E8B57",
    padding: 22,
    flexDirection: "row",
    overflow: "hidden",
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 29,
  },

  heroSubtitle: {
    color: "#DDF4E3",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 10,
    maxWidth: 210,
  },

  scanButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 14,
    marginTop: 18,
  },

  scanButtonText: {
    color: "#1B4332",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 7,
  },

  heroIconContainer: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
  },

  heroEmoji: {
    fontSize: 68,
  },

  heroSmallEmoji: {
    fontSize: 30,
    position: "absolute",
    bottom: 10,
    right: 5,
  },

  // Section

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1B4332",
  },

  seeAll: {
    fontSize: 12,
    color: "#2E8B57",
    fontWeight: "700",
  },

  // Quick Actions

  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
  },

  actionSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },

  // Scanner

  scannerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  scannerIconContainer: {
    width: 65,
    height: 65,
    borderRadius: 20,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  scannerContent: {
    flex: 1,
  },

  scannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1B4332",
  },

  scannerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    marginTop: 5,
  },

  tryNowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  tryNowText: {
    fontSize: 13,
    color: "#2E8B57",
    fontWeight: "800",
    marginRight: 5,
  },

  // Trending

  trendingCard: {
    width: 155,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    marginRight: 14,
    elevation: 2,
  },

  trendingImage: {
    height: 110,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  trendingEmoji: {
    fontSize: 48,
  },

  trendingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
  },

  trendingSubtitle: {
    fontSize: 12,
    color: "#2E8B57",
    marginTop: 3,
    fontWeight: "600",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  timeText: {
    fontSize: 11,
    color: "#64748B",
    marginLeft: 4,
  },

  // Impact

  impactCard: {
    backgroundColor: "#1B4332",
    borderRadius: 24,
    padding: 20,
    marginTop: 28,
  },

  impactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  impactTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  impactSubtitle: {
    color: "#B7D9C1",
    fontSize: 11,
    marginTop: 5,
  },

  impactEmoji: {
    fontSize: 35,
  },

  impactStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },

  statLabel: {
    color: "#B7D9C1",
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },

  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: "#477A5C",
  },
});
