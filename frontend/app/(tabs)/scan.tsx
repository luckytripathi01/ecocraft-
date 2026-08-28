import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Linking } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";


import { API_URL } from "../../constants/api";

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
    marginBottom: 25,
  },
  smallText: {
    fontSize: 13,
    color: "#2E8B57",
    fontWeight: "700",
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1B4332",
  },
  aiIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#DDF4E3",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#FFF9E6",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8A5D00",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: "#8A5D00",
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B4332",
  },
  resetText: {
    color: "#2E8B57",
    fontWeight: "600",
  },
  imageCard: {
    borderRadius: 20,
    backgroundColor: "#E7F6EB",
    marginBottom: 20,
  },
  selectedImage: {
    width: "100%",
    height: 260,
  },
  imageOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  imageCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2E8B57",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#CFEAD8",
    borderStyle: "dashed",
    borderRadius: 18,
    paddingVertical: 28,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#F7FCF8",
  },
  uploadIcon: {
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: "#5C6B63",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9EEE0",
  },
  optionIcon: {
    marginBottom: 6,
  },
  optionText: {
    color: "#2E8B57",
    fontWeight: "700",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E8B57",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 6,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginLeft: 8,
  },
  resultCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#E7F6EB",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1B4332",
    marginBottom: 6,
  },
  resultText: {
    color: "#2E8B57",
    lineHeight: 20,
  },
  scanAgainButton: {
  marginTop: 20,
  backgroundColor: "#2E8B57",
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
  elevation: 3,
},

scanAgainText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "700",
},
});

const Scan = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Gallery permission is required.");
      return;
    }

    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!image.canceled) {
      setSelectedImage(image.assets[0].uri);
      setShowResult(false);
      setResult(null);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required", "Camera permission is required.");
      return;
    }

    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!image.canceled) {
      setSelectedImage(image.assets[0].uri);
      setShowResult(false);
      setResult(null);
    }
  };

  const scanWaste = async () => {
    if (!selectedImage) {
      Alert.alert("No Image", "Please select an image first.");
      return;
    }

    setIsScanning(true);

    try {
      const formData = new FormData();

      formData.append("image", {
        uri: selectedImage,
        name: "waste.jpg",
        type: "image/jpeg",
      } as any);

      formData.append("language", "en");

      const response = await fetch(`${API_URL}/waste/scan`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data)

console.log("BACKEND RESPONSE:");
console.log(JSON.stringify(data, null, 2));

setResult(data);
setShowResult(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Cannot connect to backend.");
    }
    

    setIsScanning(false);
  };

  const resetScan = () => {
    setSelectedImage(null);
    setShowResult(false);
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>EcoCraft AI 🤖</Text>
            <Text style={styles.title}>Scan Your Waste</Text>
          </View>

          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={25} color="#2E8B57" />
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="bulb-outline" size={25} color="#E5A800" />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Discover New Possibilities ✨</Text>
            <Text style={styles.infoText}>
              Upload a photo of your waste and discover creative ways to recycle or reuse it.
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upload Waste Image</Text>

          {selectedImage && (
            <TouchableOpacity onPress={resetScan}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        {selectedImage ? (
          <View style={styles.imageCard}>
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
            <View style={styles.imageOverlay}>
              <View style={styles.imageCheck}>
                <Ionicons name="checkmark" size={22} color="#FFFFFF" />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.uploadBox}>
            <View style={styles.uploadIcon}>
              <Ionicons name="cloud-upload-outline" size={42} color="#2E8B57" />
            </View>

            <Text style={styles.uploadTitle}>Upload an Image</Text>
            <Text style={styles.uploadSubtitle}>Take a photo or choose from gallery</Text>
          </View>
        )}

        {!selectedImage && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
              <View style={styles.optionIcon}>
                <Ionicons name="camera-outline" size={25} color="#2E8B57" />
              </View>
              <Text style={styles.optionText}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
              <View style={styles.optionIcon}>
                <Ionicons name="images-outline" size={25} color="#2E8B57" />
              </View>
              <Text style={styles.optionText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedImage && !showResult && (
          <TouchableOpacity style={styles.scanButton} onPress={scanWaste} disabled={isScanning}>
            <Ionicons name={isScanning ? "sync-outline" : "sparkles-outline"} size={22} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>{isScanning ? "Analyzing..." : "Analyze with AI"}</Text>
          </TouchableOpacity>
        )}

        {showResult && result && (
  <View style={styles.resultCard}>
    <Text style={styles.resultTitle}>
      {result.detections[0].item}
    </Text>

    <Text style={styles.resultText}>
      Confidence: {Math.round(result.detections[0].confidence * 100)}%
    </Text>

    {result.detections.map((idea: any, index: number) => (
      <View
        key={index}
        style={{
          marginTop: 15,
          padding: 12,
          backgroundColor: "#F5F5F5",
          borderRadius: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          {idea.item}
        </Text>

        <Text style={{ marginTop: 8, fontWeight: "600" }}>
          ideas:
        </Text>
        <Text>• {idea.ideas}</Text>

       

        {/* <Text style={{ marginTop: 8, fontWeight: "600" }}>
          Steps:
        </Text> */}
{/* 
        {idea.steps.map((s: string, i: number) => (
          <Text key={i}>
            {i + 1}. {s}
          </Text>
        ))} */}

        {idea.videos?.length > 0 && (
          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: "#2E8B57",
              padding: 10,
              borderRadius: 8,
            }}
            onPress={() => Linking.openURL(idea.videos[0].url)}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              ▶ Watch Tutorial
            </Text>
          </TouchableOpacity>
        )}
      </View>
    ))}

    <TouchableOpacity
      style={styles.scanAgainButton}
      onPress={resetScan}
    >
      <Text style={styles.scanAgainText}>
        Scan Another Item
      </Text>
    </TouchableOpacity>
  </View>
  )}
  </ScrollView>
  </SafeAreaView>
  );
}
export default Scan;
