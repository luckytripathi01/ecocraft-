import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ideasData = [
  {
    id: 1,
    title: "Plastic Bottle",
    subtitle: "Beautiful Plant Pot",
    category: "Plastic",
    emoji: "🪴",
    time: "15 min",
    level: "Easy",
    color: "#DDF4E3",
  },
  {
    id: 2,
    title: "Old T-Shirt",
    subtitle: "Reusable Tote Bag",
    category: "Clothes",
    emoji: "👜",
    time: "30 min",
    level: "Easy",
    color: "#FFF4D6",
  },
  {
    id: 3,
    title: "Cardboard Box",
    subtitle: "Home Storage Box",
    category: "Paper",
    emoji: "📦",
    time: "25 min",
    level: "Easy",
    color: "#E7E0FF",
  },
  {
    id: 4,
    title: "Glass Bottle",
    subtitle: "Beautiful Table Decor",
    category: "Glass",
    emoji: "🏺",
    time: "20 min",
    level: "Medium",
    color: "#DDF4E3",
  },
  {
    id: 5,
    title: "Old Tyre",
    subtitle: "Garden Seat",
    category: "Other",
    emoji: "🛞",
    time: "60 min",
    level: "Hard",
    color: "#FFE1E1",
  },
  {
    id: 6,
    title: "Tin Can",
    subtitle: "Creative Pen Stand",
    category: "Metal",
    emoji: "🖊️",
    time: "10 min",
    level: "Easy",
    color: "#FFF4D6",
  },
];

const categories = [
  "All",
  "Plastic",
  "Paper",
  "Clothes",
  "Glass",
  "Metal",
  "Other",
];

const Ideas = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [searchText, setSearchText] = useState("");

  const filteredIdeas = ideasData.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" || item.category === selectedCategory;

    const searchMatch =
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchText.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>Get Creative ✨</Text>

            <Text style={styles.title}>Reuse Ideas</Text>
          </View>

          <View style={styles.ideaIcon}>
            <Ionicons name="bulb" size={26} color="#E5A800" />
          </View>
        </View>

        {/* ================= HERO ================= */}

        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>One Waste,</Text>

            <Text style={styles.heroTitle}>Many Possibilities ♻️</Text>

            <Text style={styles.heroSubtitle}>
              Discover creative ways to turn waste into something useful.
            </Text>
          </View>

          <Text style={styles.heroEmoji}>💡</Text>
        </View>

        {/* ================= SEARCH ================= */}

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={22} color="#94A3B8" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search ideas..."
            placeholderTextColor="#94A3B8"
            value={searchText}
            onChangeText={setSearchText}
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={21} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* ================= CATEGORIES ================= */}

        <Text style={styles.sectionTitle}>Explore by Category</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.activeCategory,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ================= POPULAR ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Ideas 🔥</Text>

          <Text style={styles.ideaCount}>{filteredIdeas.length} Ideas</Text>
        </View>

        {/* ================= IDEA LIST ================= */}

        {filteredIdeas.length > 0 ? (
          <View style={styles.ideaGrid}>
            {filteredIdeas.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.ideaCard}
                activeOpacity={0.8}
              >
                {/* IMAGE / EMOJI */}

                <View
                  style={[
                    styles.ideaImage,
                    {
                      backgroundColor: item.color,
                    },
                  ]}
                >
                  <Text style={styles.emoji}>{item.emoji}</Text>

                  <View style={styles.favoriteButton}>
                    <Ionicons name="heart-outline" size={17} color="#E63946" />
                  </View>
                </View>

                {/* CONTENT */}

                <Text style={styles.itemTitle}>{item.title}</Text>

                <Text style={styles.itemSubtitle}>{item.subtitle}</Text>

                {/* DETAILS */}

                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={14} color="#64748B" />

                    <Text style={styles.detailText}>{item.time}</Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons
                      name="bar-chart-outline"
                      size={14}
                      color="#64748B"
                    />

                    <Text style={styles.detailText}>{item.level}</Text>
                  </View>
                </View>

                {/* VIEW BUTTON */}

                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Idea</Text>

                  <Ionicons name="arrow-forward" size={16} color="#2E8B57" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          /* NO RESULT */

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>

            <Text style={styles.emptyTitle}>No Ideas Found</Text>

            <Text style={styles.emptyText}>
              Try searching for another waste item.
            </Text>
          </View>
        )}

        {/* ================= AI SCAN CTA ================= */}

        <TouchableOpacity
          style={styles.aiCard}
          onPress={() => router.push("/(tabs)/scan")}
        >
          <View style={styles.aiIconContainer}>
            <Ionicons name="sparkles" size={27} color="#2E8B57" />
          </View>

          <View style={styles.aiContent}>
            <Text style={styles.aiTitle}>Can't find your waste? 🤔</Text>

            <Text style={styles.aiSubtitle}>
              Let AI scan your waste and find personalized ideas for you.
            </Text>
          </View>

          <Ionicons name="arrow-forward-circle" size={28} color="#2E8B57" />
        </TouchableOpacity>

        {/* ================= FOOTER ================= */}

        <View style={styles.footer}>
          <Ionicons name="leaf-outline" size={18} color="#2E8B57" />

          <Text style={styles.footerText}>
            Create • Reuse • Save the Planet 🌍
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Ideas;

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
    paddingBottom: 30,
  },

  // Header

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 22,
  },

  smallText: {
    fontSize: 13,
    color: "#2E8B57",
    fontWeight: "700",
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    color: "#1B4332",
    fontWeight: "800",
  },

  ideaIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#FFF4D6",
    alignItems: "center",
    justifyContent: "center",
  },

  // Hero

  heroCard: {
    minHeight: 155,
    borderRadius: 25,
    backgroundColor: "#2E8B57",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 28,
  },

  heroSubtitle: {
    fontSize: 12,
    color: "#DDF4E3",
    lineHeight: 18,
    marginTop: 9,
    maxWidth: 230,
  },

  heroEmoji: {
    fontSize: 65,
    marginLeft: 8,
  },

  // Search

  searchContainer: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 22,
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#334155",
    marginLeft: 10,
  },

  // Section

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B4332",
    marginTop: 25,
    marginBottom: 13,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ideaCount: {
    fontSize: 12,
    color: "#2E8B57",
    fontWeight: "700",
  },

  // Category

  categoryScroll: {
    marginBottom: 5,
  },

  categoryButton: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    marginRight: 9,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  activeCategory: {
    backgroundColor: "#2E8B57",
    borderColor: "#2E8B57",
  },

  categoryText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  activeCategoryText: {
    color: "#FFFFFF",
  },

  // Grid

  ideaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  ideaCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    marginBottom: 15,
    elevation: 3,
  },

  ideaImage: {
    height: 125,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },

  emoji: {
    fontSize: 52,
  },

  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  itemTitle: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },

  itemSubtitle: {
    fontSize: 14,
    color: "#1B4332",
    fontWeight: "800",
    marginTop: 3,
  },

  // Details

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailText: {
    fontSize: 10,
    color: "#64748B",
    marginLeft: 3,
  },

  // View Button

  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 10,
    paddingTop: 10,
  },

  viewButtonText: {
    fontSize: 11,
    color: "#2E8B57",
    fontWeight: "800",
    marginRight: 5,
  },

  // Empty

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 40,
    marginTop: 10,
  },

  emptyEmoji: {
    fontSize: 45,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1B4332",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 5,
  },

  // AI Card

  aiCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  aiIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  aiContent: {
    flex: 1,
  },

  aiTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1B4332",
  },

  aiSubtitle: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 16,
    marginTop: 4,
  },

  // Footer

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
