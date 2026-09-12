import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
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
                        await AsyncStorage.removeItem("ecocraft_user");

                        router.replace("/(auth)/login");
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >


                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.replace("/authority")}
                        style={styles.backButton}
                    >
                        <Text style={styles.backText}>‹</Text>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Authority Profile
                    </Text>

                    <View style={{ width: 40 }} />
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>

                    <View style={styles.profileCircle}>
                        <Text style={styles.profileIcon}>👤</Text>
                    </View>

                    <Text style={styles.name}>
                        {user?.name || "Authority"}
                    </Text>

                    <Text style={styles.role}>
                        Authority Administrator
                    </Text>
                </View>

                {/* Information */}
                <View style={styles.infoCard}>

                    <Text style={styles.sectionTitle}>
                        Personal Information
                    </Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>👤</Text>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>Name</Text>
                            <Text style={styles.value}>
                                {user?.name || "Not available"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📧</Text>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>
                                {user?.email || "Not available"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>📱</Text>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>Phone</Text>
                            <Text style={styles.value}>
                                {user?.phone || "Not available"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>🔐</Text>

                        <View style={styles.infoContent}>
                            <Text style={styles.label}>Account Type</Text>
                            <Text style={styles.value}>
                                {user?.role || "authority"}
                            </Text>
                        </View>
                    </View>

                </View>

                {/* Dashboard Button */}
                <TouchableOpacity
                    style={styles.dashboardButton}
                    onPress={() => router.replace("/authority")}
                >
                    <Text style={styles.dashboardButtonText}>
                        ← Back to Dashboard
                    </Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>
                        Logout
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4FAF7",
    },

    content: {
        flex: 1,
        padding: 20,
    },

    header: {
        height: 55,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 18,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E6F4EC",
        justifyContent: "center",
        alignItems: "center",
    },

    backText: {
        fontSize: 30,
        color: "#164E36",
        marginTop: -3,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "900",
        color: "#164E36",
    },

    profileCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 25,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E1EBE6",
        marginBottom: 15,
    },

    profileCircle: {
        width: 75,
        height: 75,
        borderRadius: 38,
        backgroundColor: "#E8F4ED",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    profileIcon: {
        fontSize: 35,
    },

    name: {
        fontSize: 21,
        fontWeight: "900",
        color: "#173B2C",
    },

    role: {
        fontSize: 11,
        color: "#64748B",
        marginTop: 4,
    },

    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: "#E1EBE6",
    },

    sectionTitle: {
        fontSize: 15,
        fontWeight: "900",
        color: "#233F52",
        marginBottom: 10,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 11,
    },

    infoIcon: {
        fontSize: 20,
        width: 35,
    },

    infoContent: {
        flex: 1,
    },

    label: {
        fontSize: 9,
        color: "#94A3B8",
        marginBottom: 3,
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

    dashboardButton: {
        marginTop: 18,
        backgroundColor: "#2E8B57",
        borderRadius: 10,
        paddingVertical: 13,
        alignItems: "center",
    },

    dashboardButtonText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
    },

    logoutButton: {
        marginTop: 10,
        backgroundColor: "#FFF1F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 10,
        paddingVertical: 13,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    logoutIcon: {
        fontSize: 16,
        marginRight: 7,
    },

    logoutText: {
        color: "#DC2626",
        fontSize: 12,
        fontWeight: "800",
    },

    contentContainer: {
        paddingBottom: 40,
    },
});