import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../constants/api";
import { router } from "expo-router";

const Market = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/marketplace/listings`);
      const data = await response.json();

      if (response.ok) {
        console.log("Marketplace products:", data);
        setProducts(data);
      } else {
        console.log("Marketplace API error:", data);
      }
    } catch (error) {
      console.log("Marketplace fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Marketplace</Text>
            <Text style={styles.subtitle}>
              Discover creative eco-friendly products
            </Text>
          </View>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#1B4332" />
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="leaf" size={30} color="#2E8B57" />
          </View>

          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Buy. Sell. Reuse.</Text>
            <Text style={styles.bannerSubtitle}>
              Support creators and choose sustainable products.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          <TouchableOpacity style={styles.category}>
            <Ionicons name="grid-outline" size={20} color="#2E8B57" />
            <Text style={styles.categoryText}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.category}>
            <Ionicons name="home-outline" size={20} color="#2E8B57" />
            <Text style={styles.categoryText}>Home Decor</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.category}>
            <Ionicons name="color-palette-outline" size={20} color="#2E8B57" />
            <Text style={styles.categoryText}>Art</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.category}>
            <Ionicons name="shirt-outline" size={20} color="#2E8B57" />
            <Text style={styles.categoryText}>Fashion</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.productsHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>

          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.emptyCard}>
            <ActivityIndicator size="large" color="#2E8B57" />
            <Text style={styles.emptyTitle}>Loading products...</Text>
          </View>
        ) : products.length > 0 ? (
          products.map((product) => (
            <View key={product.listing_id} style={styles.productCard}>
              <View style={styles.productIcon}>
                <Ionicons name="leaf-outline" size={38} color="#2E8B57" />
              </View>

              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{product.title}</Text>

                <Text style={styles.productDescription} numberOfLines={2}>
                  {product.description || "Eco-friendly product"}
                </Text>

                <View style={styles.productBottom}>
                  <Text style={styles.productPrice}>
                    ?{product.price}
                  </Text>

                  <Text style={styles.productQuantity}>
                    {product.quantity} available
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="storefront-outline" size={42} color="#2E8B57" />
            </View>

            <Text style={styles.emptyTitle}>Products coming soon</Text>

            <Text style={styles.emptyText}>
              Creative products from EcoCraft users will appear here.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.sellButton}
          onPress={() => router.push("/(tabs)/sell-product")}
        >
          <Ionicons name="add-circle-outline" size={23} color="#FFFFFF" />
          <Text style={styles.sellButtonText}>Sell Your Product</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Market;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAF9",
  },

  container: {
    padding: 20,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1B4332",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "#64748B",
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    borderRadius: 18,
    padding: 18,
    marginBottom: 26,
  },

  bannerIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  bannerText: {
    flex: 1,
  },

  bannerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B4332",
  },

  bannerSubtitle: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: "#52705F",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1B4332",
  },

  categories: {
    paddingTop: 14,
    paddingBottom: 24,
    gap: 10,
  },

  category: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingVertical: 11,
    gap: 7,
    elevation: 2,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  productsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  seeAll: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2E8B57",
  },

  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  productIcon: {
    width: 85,
    height: 85,
    borderRadius: 16,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  productInfo: {
    flex: 1,
    justifyContent: "center",
  },

  productTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1B4332",
  },

  productDescription: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    color: "#64748B",
  },

  productBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
  },

  productPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2E8B57",
  },

  productQuantity: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 2,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B4332",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
  },

  sellButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E8B57",
    borderRadius: 15,
    paddingVertical: 15,
    marginTop: 20,
    gap: 8,
  },

  sellButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});







