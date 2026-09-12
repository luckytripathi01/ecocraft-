import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const SellProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [condition, setCondition] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please enter your product title.");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Missing Price", "Please enter your product price.");
      return;
    }

    Alert.alert(
      "Ready to List",
      `Product: ${title}\nPrice: ₹${price}\nQuantity: ${quantity}`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1B4332" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>Sell Your Product</Text>
            <Text style={styles.headerSubtitle}>
              Give your product a new home
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Product Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Recycled Bottle Planter"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell buyers about your product..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Price (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 299"
            placeholderTextColor="#94A3B8"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 5"
            placeholderTextColor="#94A3B8"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Condition</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. New / Like New / Used"
            placeholderTextColor="#94A3B8"
            value={condition}
            onChangeText={setCondition}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
            <Text style={styles.submitText}>Create Listing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SellProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FAF7",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1B4332",
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    elevation: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 8,
    marginTop: 16,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D7E5DC",
    borderRadius: 14,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#1B4332",
    backgroundColor: "#FAFDFC",
  },

  textArea: {
    height: 120,
    paddingTop: 14,
  },

  submitButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2E8B57",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 28,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 8,
  },
});