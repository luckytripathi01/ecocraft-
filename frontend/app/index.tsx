import "../global.css";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from "react-native";
import { router, useRouter } from "expo-router";
const { width, height } = Dimensions.get("window");
const MAX_SCALE = Math.max(width, height) / 10;

const SplashScreen = () => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  const dotOpacity = useRef(new Animated.Value(0)).current;
  const dotY = useRef(new Animated.Value(-150)).current;
  const dotScale = useRef(new Animated.Value(1)).current;

  const welcomeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(500),

      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(dotOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),

      Animated.spring(dotY, {
        toValue: 0,
        friction: 2,
        tension: 100,
        useNativeDriver: true,
      }),

      // ⏱️ SCALE TIME REDUCED HERE ONLY
      Animated.timing(dotScale, {
        toValue: MAX_SCALE,
        duration: 200, // 👈 faster fill
        useNativeDriver: true,
      }),

      Animated.timing(welcomeOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.delay(800),
    ]).start(() => {
      // 🚀 Router navigation
      router.replace("/(auth)/login");
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
        <Image
          source={require("../assets/images/EcoCraft.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
        EcoCraft
      </Animated.Text>

      <Animated.View
        style={[
          styles.dot,
          {
            opacity: dotOpacity,
            transform: [{ translateY: dotY }, { scale: dotScale }],
          },
        ]}
      />

      <Animated.Text style={[styles.welcomeText, { opacity: welcomeOpacity }]}>
        WELCOME
      </Animated.Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  logoContainer: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    zIndex: 10,
  },

  logoImage: {
    width: 140,
    height: 140,
    marginTop: 250,
  },

  text: {
    position: "absolute",
    top: 240,
    alignSelf: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#2e7d32",
    zIndex: 10,
    marginTop: 220,
  },

  dot: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2ecc71",
    top: "50%",
    left: "50%",
    marginLeft: -10,
    marginTop: 20,
    zIndex: 5,
  },

  welcomeText: {
    position: "absolute",
    top: 450,
    alignSelf: "center",
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    zIndex: 20,
  },
});
