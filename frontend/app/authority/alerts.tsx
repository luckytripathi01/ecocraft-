import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { API_URL } from "../../constants/api";

export default function Alerts() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/iot/alerts`);
            const data = await response.json();

            setAlerts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log("Alerts API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const resolveAlert = async (alertId: number) => {
        try {
            const response = await fetch(
                `${API_URL}/iot/alerts/${alertId}/resolve`,
                {
                    method: "PUT",
                }
            );

            if (response.ok) {
                fetchAlerts();
            }
        } catch (error) {
            console.log("Resolve Alert Error:", error);
        }
    };

    const getPriorityStyle = (priority: string) => {
        if (priority === "CRITICAL") {
            return {
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
            };
        }

        if (priority === "HIGH") {
            return {
                backgroundColor: "#FEF3C7",
                color: "#D97706",
            };
        }

        if (priority === "MEDIUM") {
            return {
                backgroundColor: "#FEF3C7",
                color: "#B45309",
            };
        }

        return {
            backgroundColor: "#DCFCE7",
            color: "#16A34A",
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Alert Management</Text>
                        <Text style={styles.subtitle}>
                            Monitor and manage active smart bin alerts
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={fetchAlerts}
                    >
                        <Text style={styles.refreshText}>↻</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <Text style={styles.emptyText}>
                        Loading alerts...
                    </Text>
                ) : alerts.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyIcon}>✓</Text>
                        <Text style={styles.emptyTitle}>
                            No Active Alerts
                        </Text>
                        <Text style={styles.emptyText}>
                            All smart bins are currently operating normally.
                        </Text>
                    </View>
                ) : (
                    alerts.map((alert) => {
                        const priorityStyle = getPriorityStyle(
                            alert.priority
                        );

                        return (
                            <View
                                key={alert.alert_id}
                                style={styles.alertCard}
                            >
                                <View
                                    style={[
                                        styles.iconCircle,
                                        {
                                            backgroundColor:
                                                priorityStyle.backgroundColor,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.iconText,
                                            {
                                                color: priorityStyle.color,
                                            },
                                        ]}
                                    >
                                        !
                                    </Text>
                                </View>

                                <View style={styles.alertContent}>
                                    <View style={styles.alertTopRow}>
                                        <Text style={styles.alertType}>
                                            {alert.alert_type || "Alert"}
                                        </Text>

                                        <View
                                            style={[
                                                styles.badge,
                                                {
                                                    backgroundColor:
                                                        priorityStyle.backgroundColor,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        priorityStyle.color,
                                                    fontSize: 10,
                                                    fontWeight: "800",
                                                }}
                                            >
                                                {alert.priority || "LOW"}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.binId}>
                                        Smart Bin: {alert.bin_id}
                                    </Text>

                                    <Text style={styles.message}>
                                        {alert.message}
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.resolveButton}
                                        onPress={() =>
                                            resolveAlert(alert.alert_id)
                                        }
                                    >
                                        <Text style={styles.resolveText}>
                                            Resolve Alert
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
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
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E1EBE7",
        marginBottom: 15,
    },

    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#164E36",
    },

    subtitle: {
        marginTop: 5,
        color: "#64748B",
        fontSize: 11,
    },

    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E8F7EF",
        justifyContent: "center",
        alignItems: "center",
    },

    refreshText: {
        fontSize: 22,
        color: "#16804A",
        fontWeight: "700",
    },

    alertCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 15,
        marginBottom: 12,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#E1EBE7",
    },

    iconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: "center",
        alignItems: "center",
    },

    iconText: {
        fontSize: 21,
        fontWeight: "900",
    },

    alertContent: {
        flex: 1,
        marginLeft: 12,
    },

    alertTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    alertType: {
        color: "#233F52",
        fontSize: 14,
        fontWeight: "800",
    },

    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },

    binId: {
        color: "#64748B",
        fontSize: 10,
        marginTop: 5,
    },

    message: {
        color: "#475569",
        fontSize: 11,
        marginTop: 5,
        lineHeight: 17,
    },

    resolveButton: {
        alignSelf: "flex-start",
        backgroundColor: "#2E8B57",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 7,
        marginTop: 10,
    },

    resolveText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "800",
    },

    emptyBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 35,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E1EBE7",
    },

    emptyIcon: {
        fontSize: 35,
        color: "#16A34A",
        fontWeight: "800",
    },

    emptyTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "800",
        color: "#164E36",
    },

    emptyText: {
        textAlign: "center",
        color: "#64748B",
        fontSize: 12,
        padding: 20,
    },
});