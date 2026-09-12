import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { API_URL } from "../../constants/api";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function AuthorityDashboard() {
    const router = useRouter();
    const [bins, setBins] = useState<any[]>([]);
    const [sensorData, setSensorData] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [historyData, setHistoryData] = useState<any[]>([]);
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));

        const dateKey = date.toISOString().split("T")[0];

        const dayData = historyData.filter((item) => {
            const itemDate = new Date(item.created_at)
                .toISOString()
                .split("T")[0];

            return itemDate === dateKey;
        });

        const value =
            dayData.length > 0
                ? Number(dayData[dayData.length - 1].waste_level || 0)
                : 0;

        return {
            date,
            value,
        };
    });

    const fetchDashboardData = async () => {
        try {
            setLastUpdated(new Date());
            const binsResponse = await fetch(`${API_URL}/iot/bins`);
            const binsData = await binsResponse.json();

            const sensorResponse = await fetch(`${API_URL}/iot/latest`);
            const sensorResult = await sensorResponse.json();

            const alertsResponse = await fetch(`${API_URL}/iot/alerts`);
            const alertsData = await alertsResponse.json();
            let historyResult: any[] = [];

            if (binsData.length > 0) {
                const firstBinId = binsData[0]?.bin_id;

                if (firstBinId) {
                    const historyResponse = await fetch(
                        `${API_URL}/iot/history/${firstBinId}`
                    );

                    historyResult = await historyResponse.json();
                }
            }

            setBins(Array.isArray(binsData) ? binsData : []);
            setSensorData(
                Array.isArray(sensorResult)
                    ? sensorResult
                    : sensorResult?.data || []
            );
            setAlerts(Array.isArray(alertsData) ? alertsData : []);
            setHistoryData(
                Array.isArray(historyResult)
                    ? historyResult
                    : []
            );
        } catch (error) {
            console.log("Dashboard API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const interval = setInterval(() => {
            fetchDashboardData();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const activeBins = sensorData.filter(
        (item) => item.priority !== "CRITICAL"
    ).length;

    const criticalAlerts = alerts.filter(
        (item) => item.priority === "CRITICAL"
    ).length;

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

        return {
            backgroundColor: "#DCFCE7",
            color: "#16A34A",
        };
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                {/* ================= HEADER ================= */}

                <View style={styles.header}>
                    <View style={styles.logoSection}>
                        <View style={styles.leafCircle}>
                            <Text style={styles.leafIcon}>🌿</Text>
                        </View>

                        <View>
                            <Text style={styles.logoText}>EcoCraft</Text>
                            <Text style={styles.logoSubText}>
                                Smart Waste Management
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.profileSection}
                        onPress={() => router.push("/authority/profile" as any)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.profileCircle}>
                            <Text style={styles.profileIcon}>👤</Text>
                        </View>

                        <View>
                            <Text style={styles.authorityText}>
                                Authority
                            </Text>
                            <Text style={styles.adminText}>Admin</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                {/* ================= WELCOME ================= */}

                <View style={styles.welcomeSection}>

                    <View>
                        <Text style={styles.welcomeTitle}>
                            Welcome, Authority
                        </Text>

                        <Text style={styles.welcomeSubtitle}>
                            Smart Waste Management Command Center
                        </Text>

                        <View style={styles.systemRow}>
                            <View style={styles.onlineDot} />

                            <Text style={styles.systemOnline}>
                                System Online
                            </Text>

                            <Text style={styles.updatedText}>
                                Last updated: {lastUpdated.toLocaleTimeString("en-IN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}
                            </Text>

                            <TouchableOpacity
                                onPress={fetchDashboardData}
                                style={styles.refreshButton}
                            >
                                <Text style={styles.refreshIcon}>↻</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.cityBanner}>
                        <Text style={styles.bannerLeaf}>🌿</Text>


                    </View>

                </View>


                {/* ================= STATISTICS ================= */}

                <View style={styles.statsContainer}>

                    {/* Total Bins */}

                    <View style={[styles.statCard, styles.blueCard]}>
                        <View style={[styles.statIconBox, styles.blueIcon]}>
                            <Text style={styles.statIcon}>🗑️</Text>
                        </View>

                        <View>
                            <Text style={styles.statLabel}>
                                Total Smart Bins
                            </Text>

                            <Text style={styles.statNumber}>
                                {bins.length}
                            </Text>

                            <Text style={styles.statDescription}>
                                All connected bins
                            </Text>
                        </View>
                    </View>


                    {/* Active Bins */}

                    <View style={[styles.statCard, styles.greenCard]}>
                        <View style={[styles.statIconBox, styles.greenIcon]}>
                            <Text style={styles.statIcon}>✓</Text>
                        </View>

                        <View>
                            <Text style={[styles.statLabel, styles.greenText]}>
                                Active Bins
                            </Text>

                            <Text style={[styles.statNumber, styles.greenText]}>
                                {activeBins}
                            </Text>

                            <Text style={styles.statDescription}>
                                Working properly
                            </Text>
                        </View>
                    </View>


                    {/* Active Alerts */}

                    <View style={[styles.statCard, styles.orangeCard]}>
                        <View style={[styles.statIconBox, styles.orangeIcon]}>
                            <Text style={styles.statIcon}>!</Text>
                        </View>

                        <View>
                            <Text style={[styles.statLabel, styles.orangeText]}>
                                Active Alerts
                            </Text>

                            <Text style={[styles.statNumber, styles.orangeText]}>
                                {alerts.length}
                            </Text>

                            <Text style={styles.statDescription}>
                                Needs attention
                            </Text>
                        </View>
                    </View>


                    {/* Critical Alerts */}

                    <View style={[styles.statCard, styles.redCard]}>
                        <View style={[styles.statIconBox, styles.redIcon]}>
                            <Text style={styles.statIcon}>!</Text>
                        </View>

                        <View>
                            <Text style={[styles.statLabel, styles.redText]}>
                                Critical Alerts
                            </Text>

                            <Text style={[styles.statNumber, styles.redText]}>
                                {criticalAlerts}
                            </Text>

                            <Text style={styles.statDescription}>
                                Immediate action
                            </Text>
                        </View>
                    </View>

                </View>


                {/* ================= CRITICAL ALERT ================= */}

                {alerts.length > 0 && (
                    <View style={styles.criticalAlertBox}>

                        <View style={styles.alertWarningCircle}>
                            <Text style={styles.warningIcon}>!</Text>
                        </View>

                        <View style={styles.criticalAlertContent}>
                            <View style={styles.alertHeaderRow}>
                                <Text style={styles.criticalTitle}>
                                    {alerts[0]?.priority === "CRITICAL"
                                        ? "Critical Alert"
                                        : "Waste Alert"}
                                </Text>

                                <Text style={styles.highPriorityBadge}>
                                    {alerts[0]?.priority === "CRITICAL"
                                        ? "Critical Priority"
                                        : alerts[0]?.priority === "HIGH"
                                            ? "High Priority"
                                            : alerts[0]?.priority === "MEDIUM"
                                                ? "Medium Priority"
                                                : "Low Priority"}
                                </Text>
                            </View>

                            <Text style={styles.criticalMessage}>
                                {alerts[0]?.bin_id || "Smart Bin"} -{" "}
                                {alerts[0]?.message || "Attention required"}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.viewAlertButton}
                            onPress={() => router.push("/authority/alerts")}
                        >
                            <Text style={styles.viewAlertText}>
                                View Alert →
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}


                {/* ================= MIDDLE SECTION ================= */}

                <View style={styles.middleContainer}>

                    {/* Waste Level Trend */}

                    <View style={styles.trendCard}>

                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.cardTitle}>
                                    📊 Waste Level Trend
                                </Text>

                                <Text style={styles.cardSubtitle}>
                                    Last 7 Days
                                </Text>
                            </View>

                            <View style={styles.daysButton}>
                                <Text style={styles.daysText}>
                                    7 Days⌄
                                </Text>
                            </View>
                        </View>

                        <View style={styles.chartArea}>

                            <View style={styles.chartLabels}>
                                <Text>100%</Text>
                                <Text>75%</Text>
                                <Text>50%</Text>
                                <Text>25%</Text>
                                <Text>0%</Text>
                            </View>

                            <View style={styles.chartBars}>

                                {last7Days.map((item, index) => {
                                    const value = item.value;

                                    return (
                                        <View
                                            key={index}
                                            style={styles.chartColumn}
                                        >
                                            <View
                                                style={[
                                                    styles.trendBar,
                                                    {
                                                        height:
                                                            value * 1.5,
                                                    },
                                                ]}
                                            />

                                            <Text style={styles.chartDay}>
                                                {item.date.toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                    }
                                                )}
                                            </Text>
                                        </View>
                                    );
                                })}

                            </View>
                        </View>

                    </View>


                    {/* Bin Utilization */}

                    <View style={styles.utilizationCard}>

                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>
                                🗑️ Bin Utilization
                            </Text>

                            <TouchableOpacity
                                onPress={() => router.push("/authority/bins")}
                            >
                                <Text style={styles.viewAllText}>
                                    View All →
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.utilizationBars}>

                            {sensorData.slice(0, 4).map(
                                (bin, index) => {

                                    const level = Number(
                                        bin.waste_level || 0
                                    );

                                    return (
                                        <View
                                            style={styles.utilizationColumn}
                                            key={index}
                                        >

                                            <Text style={styles.barValue}>
                                                {level}%
                                            </Text>

                                            <View
                                                style={[
                                                    styles.utilizationBar,
                                                    {
                                                        height:
                                                            Math.max(
                                                                level * 1.3,
                                                                10
                                                            ),
                                                        backgroundColor:
                                                            level >= 90
                                                                ? "#F87171"
                                                                : level >= 70
                                                                    ? "#FBBF24"
                                                                    : "#45B97C",
                                                    },
                                                ]}
                                            />

                                            <Text
                                                style={styles.binName}
                                            >
                                                {bin.bin_id}
                                            </Text>

                                        </View>
                                    );
                                }
                            )}

                        </View>

                    </View>


                    {/* Live Environment */}

                    <View style={styles.environmentCard}>

                        <Text style={styles.cardTitle}>
                            🌿 Live Environment
                        </Text>

                        <View style={styles.environmentRow}>

                            <View style={styles.environmentItem}>
                                <Text style={styles.environmentIcon}>
                                    🌡️
                                </Text>

                                <Text style={styles.environmentValue}>
                                    {sensorData[0]?.temperature ?? "--"}°C
                                </Text>

                                <Text style={styles.environmentLabel}>
                                    Temperature
                                </Text>
                            </View>


                            <View style={styles.environmentItem}>
                                <Text style={styles.environmentIcon}>
                                    💧
                                </Text>

                                <Text style={styles.environmentValue}>
                                    {sensorData[0]?.humidity ?? "--"}%
                                </Text>

                                <Text style={styles.environmentLabel}>
                                    Humidity
                                </Text>
                            </View>


                            <View style={styles.environmentItem}>
                                <Text style={styles.environmentIcon}>
                                    ☁️
                                </Text>

                                <Text style={styles.environmentValue}>
                                    {sensorData[0]?.gas_level ?? "--"} ppm
                                </Text>

                                <Text style={styles.environmentLabel}>
                                    Gas Level
                                </Text>
                            </View>

                        </View>

                        <View style={styles.riskBox}>
                            <Text style={styles.riskLeaf}>🌿</Text>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.riskTitle}>
                                    Environmental Risk
                                </Text>

                                <Text style={styles.safeBadge}>
                                    SAFE
                                </Text>
                            </View>

                            <Text style={styles.arrow}>›</Text>
                        </View>

                    </View>

                </View>


                {/* ================= BOTTOM SECTION ================= */}

                <View style={styles.bottomContainer}>

                    {/* Smart Bin Status */}

                    <View style={styles.smartBinCard}>

                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>
                                🗑️ Smart Bin Status
                            </Text>

                            <TouchableOpacity
                                onPress={() => router.push("/authority/bins")}
                            >
                                <Text style={styles.viewAllText}>
                                    View All →
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Table Header */}

                        <View style={styles.tableHeader}>
                            <Text style={styles.tableHeaderText}>
                                Bin ID
                            </Text>

                            <Text style={styles.tableHeaderText}>
                                Location
                            </Text>

                            <Text style={styles.tableHeaderText}>
                                Fill Level
                            </Text>

                            <Text style={styles.tableHeaderText}>
                                Status / Lid
                            </Text>
                        </View>


                        {sensorData.length === 0 ? (

                            <Text style={styles.emptyText}>
                                No sensor data available
                            </Text>

                        ) : (

                            sensorData.slice(0, 5).map(
                                (bin, index) => {

                                    const level = Number(
                                        bin.waste_level || 0
                                    );

                                    const isCritical =
                                        bin.priority === "CRITICAL";

                                    return (
                                        <View
                                            style={styles.tableRow}
                                            key={index}
                                        >

                                            <Text style={styles.binId}>
                                                🗑️ {bin.bin_id}
                                            </Text>

                                            <Text
                                                style={styles.locationText}
                                            >
                                                {bins[index]?.location ||
                                                    "Unknown Location"}
                                            </Text>

                                            <View
                                                style={styles.fillLevelContainer}
                                            >
                                                <View
                                                    style={styles.fillTrack}
                                                >
                                                    <View
                                                        style={[
                                                            styles.fillProgress,
                                                            {
                                                                width: `${Math.min(
                                                                    level,
                                                                    100
                                                                )}%`,
                                                                backgroundColor:
                                                                    isCritical
                                                                        ? "#EF4444"
                                                                        : "#35A66F",
                                                            },
                                                        ]}
                                                    />
                                                </View>

                                                <Text
                                                    style={styles.levelText}
                                                >
                                                    {level}%
                                                </Text>
                                            </View>

                                            <View
                                                style={styles.statusContainer}
                                            >
                                                <View
                                                    style={[
                                                        styles.statusDot,
                                                        {
                                                            backgroundColor:
                                                                isCritical
                                                                    ? "#EF4444"
                                                                    : "#16A34A",
                                                        },
                                                    ]}
                                                />

                                                <View>
                                                    <Text
                                                        style={[
                                                            styles.statusText,
                                                            {
                                                                color: isCritical
                                                                    ? "#DC2626"
                                                                    : "#16A34A",
                                                            },
                                                        ]}
                                                    >
                                                        {isCritical ? "Critical" : "Active"}
                                                    </Text>

                                                    <Text
                                                        style={{
                                                            fontSize: 7,
                                                            marginTop: 2,
                                                            color: bin.lid_open ? "#15803D" : "#64748B",
                                                            fontWeight: "600",
                                                        }}
                                                    >
                                                        {bin.lid_open ? "Dustbin Open" : "Dustbin Closed"}
                                                    </Text>
                                                </View>
                                            </View>

                                        </View>
                                    );
                                }
                            )
                        )}

                    </View>


                    {/* Recent Alerts */}

                    <View style={styles.recentAlertsCard}>

                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>
                                🔔 Recent Alerts
                            </Text>

                            <TouchableOpacity
                                onPress={() => router.push("/authority/alerts")}
                            >
                                <Text style={styles.viewAllText}>
                                    View All →
                                </Text>
                            </TouchableOpacity>
                        </View>


                        {alerts.length === 0 ? (

                            <Text style={styles.emptyText}>
                                🎉 No active alerts
                            </Text>

                        ) : (

                            alerts.slice(0, 4).map(
                                (alert, index) => {

                                    const priorityStyle =
                                        getPriorityStyle(
                                            alert.priority
                                        );

                                    return (
                                        <View
                                            style={styles.alertRow}
                                            key={index}
                                        >

                                            <View
                                                style={[
                                                    styles.alertIconCircle,
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
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    !
                                                </Text>
                                            </View>

                                            <View
                                                style={styles.alertInfo}
                                            >

                                                <Text
                                                    style={
                                                        styles.alertRowTitle
                                                    }
                                                >
                                                    {alert.alert_type ||
                                                        "Alert"}
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.alertRowBin
                                                    }
                                                >
                                                    {alert.bin_id}
                                                </Text>

                                                <Text
                                                    style={
                                                        styles.alertRowMessage
                                                    }
                                                >
                                                    {alert.message}
                                                </Text>

                                            </View>

                                            <View
                                                style={[
                                                    styles.priorityBadge,
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
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {alert.priority ||
                                                        "Normal"}
                                                </Text>
                                            </View>

                                        </View>
                                    );
                                }
                            )
                        )}

                    </View>

                </View>




            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F4FAF7",
    },

    scrollContent: {
        paddingBottom: 30,
    },


    /* HEADER */

    header: {
        backgroundColor: "#FFFFFF",
        minHeight: 72,
        paddingHorizontal: 22,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#E5EFE9",
    },

    logoSection: {
        flexDirection: "row",
        alignItems: "center",
    },

    leafCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#E8F7EF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    leafIcon: {
        fontSize: 25,
    },

    logoText: {
        fontSize: 22,
        fontWeight: "800",
        color: "#164E36",
    },

    logoSubText: {
        fontSize: 10,
        color: "#64748B",
        marginTop: 2,
    },

    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    notification: {
        fontSize: 20,
        marginRight: 8,
    },

    profileCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E8EFF2",
        justifyContent: "center",
        alignItems: "center",
    },

    profileIcon: {
        fontSize: 19,
    },

    authorityText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#1E293B",
    },

    adminText: {
        fontSize: 10,
        color: "#64748B",
        marginTop: 2,
    },


    /* WELCOME */

    welcomeSection: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 18,
        backgroundColor: "#F1FAF5",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    welcomeTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#123F32",
    },

    welcomeSubtitle: {
        fontSize: 13,
        color: "#64748B",
        marginTop: 4,
    },

    systemRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 14,
    },

    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#35B86B",
        marginRight: 7,
    },

    systemOnline: {
        color: "#15803D",
        fontWeight: "700",
        fontSize: 12,
    },

    updatedText: {
        marginLeft: 15,
        color: "#64748B",
        fontSize: 10,
    },

    refreshIcon: {
        color: "#64748B",
        fontSize: 17,
        marginLeft: 8,
    },

    cityBanner: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 12,
    },

    bannerLeaf: {
        fontSize: 30,
        marginRight: 8,
    },

    bannerText: {
        color: "#16804A",
        fontSize: 16,
        fontWeight: "800",
    },


    /* STATISTICS */

    statsContainer: {
        paddingHorizontal: 20,
        paddingTop: 14,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    statCard: {
        width: "49%",
        minHeight: 105,
        borderRadius: 14,
        marginBottom: 10,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
    },

    blueCard: {
        backgroundColor: "#F0F9FF",
        borderColor: "#D6ECFA",
    },

    greenCard: {
        backgroundColor: "#F0FBF5",
        borderColor: "#D4F0DF",
    },

    orangeCard: {
        backgroundColor: "#FFF9EF",
        borderColor: "#F8E8C9",
    },

    redCard: {
        backgroundColor: "#FFF4F4",
        borderColor: "#F6D2D2",
    },

    statIconBox: {
        width: 43,
        height: 43,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },

    blueIcon: {
        backgroundColor: "#DDF2FF",
    },

    greenIcon: {
        backgroundColor: "#CFF5DE",
    },

    orangeIcon: {
        backgroundColor: "#FFE5AE",
    },

    redIcon: {
        backgroundColor: "#FFD7D7",
    },

    statIcon: {
        fontSize: 21,
        fontWeight: "bold",
    },

    statLabel: {
        color: "#24536B",
        fontSize: 12,
        fontWeight: "700",
    },

    statNumber: {
        color: "#123F32",
        fontSize: 28,
        fontWeight: "800",
        marginTop: 2,
    },

    statDescription: {
        color: "#64748B",
        fontSize: 9,
        marginTop: 1,
    },

    greenText: {
        color: "#16794A",
    },

    orangeText: {
        color: "#C26A08",
    },

    redText: {
        color: "#D62828",
    },


    /* CRITICAL ALERT */

    criticalAlertBox: {
        marginHorizontal: 20,
        marginTop: 5,
        padding: 13,
        backgroundColor: "#FFF1F2",
        borderWidth: 1,
        borderColor: "#F6BFC5",
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
    },

    alertWarningCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#EF4444",
        alignItems: "center",
        justifyContent: "center",
    },

    warningIcon: {
        color: "#FFFFFF",
        fontSize: 21,
        fontWeight: "900",
    },

    criticalAlertContent: {
        flex: 1,
        marginLeft: 12,
    },

    alertHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    criticalTitle: {
        color: "#DC2626",
        fontSize: 12,
        fontWeight: "800",
    },

    highPriorityBadge: {
        marginLeft: 10,
        backgroundColor: "#FCE4E4",
        color: "#DC2626",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        fontSize: 9,
        fontWeight: "700",
    },

    criticalMessage: {
        marginTop: 5,
        color: "#263B4D",
        fontSize: 11,
        fontWeight: "600",
    },

    viewAlertButton: {
        backgroundColor: "#EF4444",
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 8,
    },

    viewAlertText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "800",
    },


    /* MIDDLE */

    middleContainer: {
        paddingHorizontal: 20,
        marginTop: 12,
    },

    trendCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E1EBE7",
        padding: 15,
        minHeight: 230,
        marginBottom: 12,
    },

    utilizationCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E1EBE7",
        padding: 15,
        minHeight: 220,
        marginBottom: 12,
    },

    environmentCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E1EBE7",
        padding: 15,
        minHeight: 190,
        marginBottom: 12,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
    },

    cardTitle: {
        color: "#174E3A",
        fontSize: 14,
        fontWeight: "800",
    },

    cardSubtitle: {
        color: "#64748B",
        fontSize: 10,
        marginTop: 2,
    },

    viewAllText: {
        color: "#238657",
        fontSize: 10,
        fontWeight: "700",
    },

    daysButton: {
        borderWidth: 1,
        borderColor: "#D9E5E0",
        borderRadius: 7,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },

    daysText: {
        color: "#475569",
        fontSize: 10,
    },


    /* CHART */

    chartArea: {
        flexDirection: "row",
        height: 160,
        marginTop: 5,
    },

    chartLabels: {
        height: 135,
        justifyContent: "space-between",
        paddingBottom: 8,
        width: 35,
    },

    chartBars: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: "#DCE7E2",
    },

    chartColumn: {
        height: 145,
        justifyContent: "flex-end",
        alignItems: "center",
        width: 32,
    },

    trendBar: {
        width: 8,
        backgroundColor: "#36A269",
        borderRadius: 5,
    },

    chartDay: {
        color: "#64748B",
        fontSize: 7,
        marginTop: 5,
        transform: [{ rotate: "-35deg" }],
    },


    /* UTILIZATION */

    utilizationBars: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        paddingTop: 15,
    },

    utilizationColumn: {
        alignItems: "center",
        justifyContent: "flex-end",
        height: 155,
        width: 45,
    },

    barValue: {
        color: "#24445A",
        fontSize: 10,
        fontWeight: "800",
        marginBottom: 5,
    },

    utilizationBar: {
        width: 28,
        borderRadius: 6,
    },

    binName: {
        color: "#24445A",
        fontSize: 8,
        fontWeight: "700",
        marginTop: 6,
    },


    /* ENVIRONMENT */

    environmentRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 12,
    },

    environmentItem: {
        alignItems: "center",
        flex: 1,
    },

    environmentIcon: {
        fontSize: 22,
        marginBottom: 5,
    },

    environmentValue: {
        color: "#24445A",
        fontSize: 15,
        fontWeight: "800",
    },

    environmentLabel: {
        color: "#64748B",
        fontSize: 8,
        marginTop: 3,
        textAlign: "center",
    },

    riskBox: {
        marginTop: 15,
        backgroundColor: "#ECF9F1",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#D2EFDE",
    },

    riskLeaf: {
        fontSize: 21,
        marginRight: 9,
    },

    riskTitle: {
        color: "#23744C",
        fontSize: 10,
        fontWeight: "700",
    },

    safeBadge: {
        marginTop: 3,
        color: "#16824B",
        backgroundColor: "#C9F1D8",
        alignSelf: "flex-start",
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 8,
        fontSize: 8,
        fontWeight: "800",
    },

    arrow: {
        color: "#17824D",
        fontSize: 25,
    },


    /* BOTTOM */

    bottomContainer: {
        paddingHorizontal: 20,
    },

    smartBinCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E1EBE7",
        padding: 15,
        marginBottom: 12,
    },

    recentAlertsCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E1EBE7",
        padding: 15,
        marginBottom: 12,
    },


    /* TABLE */

    tableHeader: {
        flexDirection: "row",
        paddingVertical: 8,
        backgroundColor: "#F5FAF8",
        borderRadius: 6,
    },

    tableHeaderText: {
        flex: 1,
        color: "#567181",
        fontSize: 9,
        fontWeight: "700",
        textAlign: "center",
    },

    tableRow: {
        minHeight: 52,
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F0",
        flexDirection: "row",
        alignItems: "center",
    },

    binId: {
        flex: 1,
        color: "#23445A",
        fontSize: 9,
        fontWeight: "800",
    },

    locationText: {
        flex: 1,
        color: "#64748B",
        fontSize: 8,
        textAlign: "center",
    },

    fillLevelContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 3,
    },

    fillTrack: {
        flex: 1,
        height: 8,
        backgroundColor: "#E1EBEF",
        borderRadius: 5,
        overflow: "hidden",
    },

    fillProgress: {
        height: "100%",
        borderRadius: 5,
    },

    levelText: {
        color: "#475569",
        fontSize: 8,
        marginLeft: 4,
    },

    statusContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 4,
    },

    statusText: {
        fontSize: 8,
        fontWeight: "700",
    },


    /* ALERTS */

    alertRow: {
        minHeight: 70,
        borderBottomWidth: 1,
        borderBottomColor: "#EDF2F0",
        flexDirection: "row",
        alignItems: "center",
    },

    alertIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
    },

    alertInfo: {
        flex: 1,
        marginLeft: 9,
    },

    alertRowTitle: {
        color: "#233F52",
        fontSize: 11,
        fontWeight: "800",
    },

    alertRowBin: {
        color: "#64748B",
        fontSize: 9,
        marginTop: 2,
    },

    alertRowMessage: {
        color: "#64748B",
        fontSize: 8,
        marginTop: 2,
    },

    priorityBadge: {
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderRadius: 8,
    },


    /* EMPTY */

    emptyText: {
        textAlign: "center",
        color: "#64748B",
        padding: 20,
        fontSize: 12,
    },
    refreshButton: {
        padding: 6,
        marginLeft: 4,
    },



});