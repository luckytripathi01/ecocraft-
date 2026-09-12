import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Alert,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function AuthorityProfile() {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("ecocraft_user");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.log("Profile Load Error:", error);
        }
    };

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
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem("ecocraft_user");
                            router.replace("/(auth)/login");
                        } catch (error) {
                            console.log("Logout Error:", error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >

                {/* Header */}
                <View style={styles.header}>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.replace("/authority")}
                    >
                        <Text style={styles.backText}>‹</Text>
                    </TouchableOpacity>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>
                            Authority Profile
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Account Information
                        </Text>
                    </View>

                    <View style={styles.headerSpace} />

                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>

                    <View style={styles.profileCircle}>
                        <Text style={styles.profileIcon}>👤</Text>
                    </View>

                    <Text style={styles.name}>
                        {user?.name || "Authority"}
                    </Text>

                    <View style={styles.roleBadge}>
                        <Text style={styles.roleBadgeText}>
                            AUTHORITY
                        </Text>
                    </View>

                    <Text style={styles.roleText}>
                        Authority Administrator
                    </Text>

                </View>

                {/* Personal Information */}
                <View style={styles.infoCard}>

                    <Text style={styles.sectionTitle}>
                        Personal Information
                    </Text>

                    {/* Name */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Text style={styles.infoIcon}>👤</Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>
                                Full Name
                            </Text>

                            <Text style={styles.value}>
                                {user?.name || "Not available"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Email */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Text style={styles.infoIcon}>📧</Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>
                                Email Address
                            </Text>

                            <Text style={styles.value}>
                                {user?.email || "Not available"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Phone */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Text style={styles.infoIcon}>📱</Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>
                                Phone Number
                            </Text>

                            <Text style={styles.value}>
                                {user?.phone || "Not added"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Account Type */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Text style={styles.infoIcon}>🔐</Text>
                        </View>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>
                                Account Type
                            </Text>

                            <Text style={styles.value}>
                                {user?.role || "authority"}
                            </Text>
                        </View>
                    </View>

                </View>

                {/* Account Status */}
                <View style={styles.statusCard}>

                    <View style={styles.statusIcon}>
                        <Text style={styles.statusIconText}>✓</Text>
                    </View>

                    <View style={styles.statusContent}>
                        <Text style={styles.statusTitle}>
                            Account Active
                        </Text>

                        <Text style={styles.statusText}>
                            Your authority account is active and
                            connected to EcoCraft.
                        </Text>
                    </View>

                    <View style={styles.onlineDot} />

                </View>

                {/* Dashboard Button */}
                <TouchableOpacity
                    style={styles.dashboardButton}
                    onPress={() => router.replace("/authority")}
                    activeOpacity={0.8}
                >
                    <Text style={styles.dashboardIcon}>⌂</Text>

                    <Text style={styles.dashboardText}>
                        Back to Dashboard
                    </Text>
                </TouchableOpacity>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Text style={styles.logoutIcon}>↪</Text>

                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    EcoCraft • Smart Waste Management
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4FAF7",
    },

    content: {
        padding: 20,
        paddingBottom: 40,
    },

    header: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
    },

    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#E5F3EB",
        alignItems: "center",
        justifyContent: "center",
    },

    backText: {
        fontSize: 30,
        color: "#164E36",
        lineHeight: 32,
    },

    headerCenter: {
        alignItems: "center",
    },

    headerTitle: {
        fontSize: 19,
        fontWeight: "900",
        color: "#164E36",
    },

    headerSubtitle: {
        fontSize: 10,
        color: "#64748B",
        marginTop: 3,
    },

    headerSpace: {
        width: 42,
    },

    profileCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        paddingVertical: 25,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DFEBE5",
        marginBottom: 15,
    },

    profileCircle: {
        width: 78,
        height: 78,
        borderRadius: 39,
        backgroundColor: "#E8F5ED",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 11,
    },

    profileIcon: {
        fontSize: 36,
    },

    name: {
        fontSize: 21,
        fontWeight: "900",
        color: "#173B2C",
    },

    roleBadge: {
        backgroundColor: "#DDF3E6",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginTop: 7,
    },

    roleBadgeText: {
        fontSize: 8,
        fontWeight: "900",
        color: "#16804A",
    },

    roleText: {
        fontSize: 10,
        color: "#64748B",
        marginTop: 5,
    },

    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: "#DFEBE5",
        marginBottom: 15,
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: "900",
        color: "#233F52",
        marginBottom: 5,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 13,
    },

    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: "#F0F8F3",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    infoIcon: {
        fontSize: 18,
    },

    infoContent: {
        flex: 1,
    },

    label: {
        fontSize: 9,
        color: "#94A3B8",
        marginBottom: 4,
    },

    value: {
        fontSize: 12,
        fontWeight: "700",
        color: "#334155",
    },

    divider: {
        height: 1,
        backgroundColor: "#EEF2F0",
    },

    statusCard: {
        backgroundColor: "#ECF9F1",
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D5EFDF",
        marginBottom: 15,
    },

    statusIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#C9F1D8",
        alignItems: "center",
        justifyContent: "center",
    },

    statusIconText: {
        color: "#16804A",
        fontSize: 20,
        fontWeight: "900",
    },

    statusContent: {
        flex: 1,
        marginLeft: 11,
    },

    statusTitle: {
        fontSize: 11,
        fontWeight: "900",
        color: "#16804A",
    },

    statusText: {
        fontSize: 9,
        color: "#64748B",
        marginTop: 3,
        lineHeight: 14,
    },

    onlineDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: "#22C55E",
    },

    dashboardButton: {
        height: 48,
        borderRadius: 11,
        backgroundColor: "#2E8B57",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    dashboardIcon: {
        color: "#FFFFFF",
        fontSize: 20,
        marginRight: 8,
    },

    dashboardText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
    },

    logoutButton: {
        height: 48,
        borderRadius: 11,
        backgroundColor: "#FFF1F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    logoutIcon: {
        color: "#DC2626",
        fontSize: 21,
        marginRight: 8,
    },

    logoutText: {
        color: "#DC2626",
        fontSize: 12,
        fontWeight: "900",
    },

    footerText: {
        textAlign: "center",
        color: "#94A3B8",
        fontSize: 9,
        marginTop: 18,
    },
});