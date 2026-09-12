import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function AuthorityLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2E8B57",
                tabBarInactiveTintColor: "#64748B",
                tabBarStyle: {
                    height: 65,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            }}
        >

            {/* Dashboard */}
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="home-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    href: null,
                    tabBarStyle: {
                        display: "none",
                    },
                }}
            />

            {/* Smart Bins */}
            <Tabs.Screen
                name="bins"
                options={{
                    title: "Smart Bins",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="trash-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Live Monitoring */}
            <Tabs.Screen
                name="monitoring"
                options={{
                    title: "Live",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="pulse-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Alerts */}
            <Tabs.Screen
                name="alerts"
                options={{
                    title: "Alerts",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="notifications-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* Analytics */}
            <Tabs.Screen
                name="analytics"
                options={{
                    title: "Analytics",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="stats-chart-outline"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

        </Tabs>
    );
}