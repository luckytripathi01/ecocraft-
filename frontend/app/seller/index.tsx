import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
} from "react-native";

export default function SellerDashboard() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <View style={styles.header}>
                    <Text style={styles.title}>Seller Dashboard</Text>

                    <Text style={styles.subtitle}>
                        Manage your products and grow your business
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📦 My Products</Text>

                    <Text style={styles.cardText}>
                        Add and manage your products
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🛒 Orders</Text>

                    <Text style={styles.cardText}>
                        View and manage customer orders
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>💰 Earnings</Text>

                    <Text style={styles.cardText}>
                        Track your sales and earnings
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4FBF5",
    },

    header: {
        padding: 25,
        paddingTop: 50,
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1B4332",
    },

    subtitle: {
        fontSize: 15,
        color: "#64748B",
        marginTop: 5,
    },

    card: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 20,
        borderRadius: 15,
        elevation: 3,
    },

    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1B4332",
    },

    cardText: {
        marginTop: 8,
        color: "#64748B",
    },
});