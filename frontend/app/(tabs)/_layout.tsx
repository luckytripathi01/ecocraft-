import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#2E8B57",
        tabBarInactiveTintColor: "#94A3B8",

        tabBarStyle: {
          height: 75,
          paddingTop: 8,
          paddingBottom: 10,

          backgroundColor: "#FFFFFF",

          borderTopWidth: 0,

          elevation: 10,

          shadowColor: "#1B4332",
          shadowOffset: {
            width: 0,
            height: -3,
          },

          shadowOpacity: 0.08,
          shadowRadius: 10,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      {/* HOME TAB */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* SCAN TAB */}
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "scan" : "scan-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />


      {/* MARKETPLACE TAB */}
      <Tabs.Screen
        name="market"
        options={{
          title: "Market",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "storefront" : "storefront-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      {/* IDEAS TAB */}
      <Tabs.Screen
        name="ideas"
        options={{
          title: "Ideas",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bulb" : "bulb-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE TAB */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

