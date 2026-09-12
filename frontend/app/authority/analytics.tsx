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

export default function Analytics() {
    const [bins, setBins] = useState<any[]>([]);
    const [sensorData, setSensorData] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBin, setSelectedBin] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [trendType, setTrendType] = useState("waste");


    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);

            const [binsRes, sensorRes, alertsRes] = await Promise.all([
                fetch(`${API_URL}/iot/bins`),
                fetch(`${API_URL}/iot/latest`),
                fetch(`${API_URL}/iot/alerts`),
            ]);

            const binsData = await binsRes.json();
            const sensorResult = await sensorRes.json();
            const alertsData = await alertsRes.json();

            const availableBins = Array.isArray(binsData) ? binsData : [];

            setBins(availableBins);

            if (availableBins.length > 0) {
                const firstBin = availableBins[0].bin_id || "BIN-1";

                setSelectedBin((currentBin) => {
                    return currentBin || firstBin;
                });
            }

            setSensorData(
                Array.isArray(sensorResult)
                    ? sensorResult
                    : sensorResult?.data || []
            );

            setAlerts(Array.isArray(alertsData) ? alertsData : []);
        } catch (error) {
            console.log("Analytics API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchHistory = async (binId: string) => {
        try {
            const response = await fetch(
                `${API_URL}/iot/history/${binId}`
            );

            const data = await response.json();

            setHistory(
                Array.isArray(data)
                    ? data.reverse()
                    : []
            );
        } catch (error) {
            console.log("Analytics History Error:", error);
            setHistory([]);
        }
    };
    useEffect(() => {
        if (selectedBin) {
            fetchHistory(selectedBin);
        }
    }, [selectedBin]);
    const totalBins = bins.length;

    const activeBins = sensorData.filter(
        (item) => item.bin_id
    ).length;

    const criticalAlerts = alerts.filter(
        (item) => item.priority === "CRITICAL"
    ).length;
    const highAlerts = alerts.filter(
        (item) => item.priority === "HIGH"
    ).length;

    const mediumAlerts = alerts.filter(
        (item) => item.priority === "MEDIUM"
    ).length;

    const lowAlerts = alerts.filter(
        (item) => item.priority === "LOW"
    ).length;
    const getTrendValue = (item: any) => {
        if (trendType === "temperature") {
            return Number(item.temperature || 0);
        }

        if (trendType === "humidity") {
            return Number(item.humidity || 0);
        }

        if (trendType === "gas") {
            return Number(item.gas_level || 0);
        }

        return Number(item.waste_level || 0);
    };

    const chartData = history.slice(-12).map(getTrendValue);

    const averageWaste =
        history.length > 0
            ? Math.round(
                history.reduce(
                    (sum, item) =>
                        sum + Number(item.waste_level || 0),
                    0
                ) / history.length
            )
            : 0;
    const selectedSensor =
        sensorData.find(
            (item) => item.bin_id === selectedBin
        ) || null;

    const currentTemperature = Number(
        selectedSensor?.temperature || 0
    );

    const currentHumidity = Number(
        selectedSensor?.humidity || 0
    );

    const currentGas = Number(
        selectedSensor?.gas_level || 0
    );
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <View style={styles.brandRow}>
                            <Text style={styles.leaf}>🌿</Text>
                            <Text style={styles.brand}>EcoCraft</Text>
                        </View>

                        <Text style={styles.subtitle}>
                            Smart Waste Analytics
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={fetchAnalyticsData}
                    >
                        <Text style={styles.refreshText}>↻</Text>
                    </TouchableOpacity>
                </View>

                {/* Page Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.pageTitle}>Analytics</Text>

                    <Text style={styles.pageDescription}>
                        Monitor waste management performance and system
                        insights.
                    </Text>
                </View>

                {/* Overview */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>System Overview</Text>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🗑️</Text>
                        <Text style={styles.statValue}>
                            {loading ? "--" : totalBins}
                        </Text>
                        <Text style={styles.statLabel}>Total Bins</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🟢</Text>
                        <Text style={styles.statValue}>
                            {loading ? "--" : activeBins}
                        </Text>
                        <Text style={styles.statLabel}>Active Bins</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>📊</Text>
                        <Text style={styles.statValue}>
                            {loading ? "--" : `${averageWaste}%`}
                        </Text>
                        <Text style={styles.statLabel}>Avg. Waste Level</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🚨</Text>
                        <Text style={styles.statValue}>
                            {loading ? "--" : criticalAlerts}
                        </Text>
                        <Text style={styles.statLabel}>Critical Alerts</Text>
                    </View>
                </View>
                {/* Bin Selector */}
                <View style={styles.binSelectorCard}>
                    <Text style={styles.selectorTitle}>Select Smart Bin</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.binSelectorList}
                    >
                        {bins.map((bin, index) => {
                            const binId = bin.bin_id || `BIN-${index + 1}`;

                            return (
                                <TouchableOpacity
                                    key={binId}
                                    style={[
                                        styles.binSelector,
                                        selectedBin === binId &&
                                        styles.binSelectorActive,
                                    ]}
                                    onPress={() => setSelectedBin(binId)}
                                >
                                    <Text
                                        style={[
                                            styles.binSelectorText,
                                            selectedBin === binId &&
                                            styles.binSelectorTextActive,
                                        ]}
                                    >
                                        {binId}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.binSelectorLocation,
                                            selectedBin === binId &&
                                            styles.binSelectorLocationActive,
                                        ]}
                                    >
                                        {bin.location || "Unknown Location"}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Current Sensor Status</Text>

                    <Text style={styles.cardSubtitle}>
                        Live readings for the selected smart bin
                    </Text>

                    <View style={styles.sensorGrid}>
                        <View style={styles.sensorBox}>
                            <Text style={styles.sensorIcon}>🗑️</Text>
                            <Text style={styles.sensorValue}>
                                {selectedSensor?.waste_level ?? 0}%
                            </Text>
                            <Text style={styles.sensorLabel}>Waste Level</Text>
                        </View>

                        <View style={styles.sensorBox}>
                            <Text style={styles.sensorIcon}>🌡️</Text>
                            <Text style={styles.sensorValue}>
                                {currentTemperature}°C
                            </Text>
                            <Text style={styles.sensorLabel}>Temperature</Text>
                        </View>

                        <View style={styles.sensorBox}>
                            <Text style={styles.sensorIcon}>💧</Text>
                            <Text style={styles.sensorValue}>
                                {currentHumidity}%
                            </Text>
                            <Text style={styles.sensorLabel}>Humidity</Text>
                        </View>

                        <View style={styles.sensorBox}>
                            <Text style={styles.sensorIcon}>💨</Text>
                            <Text style={styles.sensorValue}>
                                {currentGas}
                            </Text>
                            <Text style={styles.sensorLabel}>Gas Level</Text>
                        </View>
                    </View>
                </View>
                {/* Sensor Trends */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Sensor Trends</Text>

                    <Text style={styles.cardSubtitle}>
                        Historical sensor data for the selected smart bin
                    </Text>

                    {/* Trend Selector */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.trendSelector}
                    >
                        {[
                            { key: "waste", label: "Waste Level" },
                            { key: "temperature", label: "Temperature" },
                            { key: "humidity", label: "Humidity" },
                            { key: "gas", label: "Gas Level" },
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                style={[
                                    styles.trendButton,
                                    trendType === item.key &&
                                    styles.trendButtonActive,
                                ]}
                                onPress={() => setTrendType(item.key)}
                            >
                                <Text
                                    style={[
                                        styles.trendButtonText,
                                        trendType === item.key &&
                                        styles.trendButtonTextActive,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Chart */}
                    {chartData.length === 0 ? (
                        <Text style={styles.noTrendData}>
                            No historical data available for this bin.
                        </Text>
                    ) : (
                        <View style={styles.chartContainer}>
                            {chartData.map((value, index) => {
                                const maxValue =
                                    trendType === "gas"
                                        ? 1000
                                        : trendType === "temperature"
                                            ? 50
                                            : 100;

                                const barHeight = Math.max(
                                    10,
                                    Math.min(
                                        145,
                                        (value / maxValue) * 145
                                    )
                                );

                                return (
                                    <View
                                        key={index}
                                        style={styles.chartColumn}
                                    >
                                        <Text style={styles.chartValue}>
                                            {Math.round(value)}
                                        </Text>

                                        <View
                                            style={[
                                                styles.chartBar,
                                                {
                                                    height: barHeight,
                                                },
                                            ]}
                                        />

                                        <Text style={styles.chartIndex}>
                                            {index + 1}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
                {/* Waste Performance */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Waste Level Analysis</Text>

                    <Text style={styles.cardSubtitle}>
                        Current average waste level across smart bins
                    </Text>

                    <View style={styles.progressBackground}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${Math.min(averageWaste, 100)}%` },
                            ]}
                        />
                    </View>

                    <View style={styles.progressRow}>
                        <Text style={styles.progressLabel}>
                            Average Fill Level
                        </Text>

                        <Text style={styles.progressValue}>
                            {averageWaste}%
                        </Text>
                    </View>
                </View>

                {/* Bin Performance */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Smart Bin Performance</Text>

                    <Text style={styles.cardSubtitle}>
                        Current status of monitored smart bins
                    </Text>

                    {bins.length === 0 ? (
                        <Text style={styles.emptyText}>
                            No smart bin data available.
                        </Text>
                    ) : (
                        bins.slice(0, 6).map((bin, index) => {
                            const sensor =
                                sensorData.find(
                                    (item) =>
                                        item.bin_id === bin.bin_id
                                ) || sensorData[index];

                            const waste = Number(
                                sensor?.waste_level || 0
                            );
                            const binStatus =
                                waste >= 90
                                    ? "CRITICAL"
                                    : waste >= 70
                                        ? "HIGH"
                                        : "NORMAL";

                            return (
                                <View
                                    key={bin.bin_id || index}
                                    style={styles.binRow}
                                >
                                    <View style={styles.binInfo}>
                                        <Text style={styles.binId}>
                                            {bin.bin_id || `BIN-${index + 1}`}
                                        </Text>

                                        <Text style={styles.binLocation}>
                                            {bin.location ||
                                                "Unknown Location"}
                                        </Text>
                                    </View>

                                    <View style={styles.binProgressArea}>
                                        <View
                                            style={
                                                styles.smallProgressBackground
                                            }
                                        >
                                            <View
                                                style={[
                                                    styles.smallProgressFill,
                                                    {
                                                        width: `${Math.min(
                                                            waste,
                                                            100
                                                        )}%`,
                                                    },
                                                ]}
                                            />
                                        </View>

                                        <View style={styles.binStatusArea}>
                                            <Text
                                                style={[
                                                    styles.binStatus,
                                                    binStatus === "CRITICAL" && styles.binStatusCritical,
                                                    binStatus === "HIGH" && styles.binStatusHigh,
                                                    binStatus === "NORMAL" && styles.binStatusNormal,
                                                ]}
                                            >
                                                {binStatus}
                                            </Text>

                                            <Text style={styles.binPercent}>
                                                {waste}%
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}
                </View>

                {/* Alert Summary */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Alert Summary</Text>

                    <Text style={styles.cardSubtitle}>
                        Current system alert status
                    </Text>

                    <View style={styles.alertRow}>
                        <View style={styles.alertDotCritical} />

                        <Text style={styles.alertLabel}>
                            Critical Alerts
                        </Text>

                        <Text style={styles.alertValue}>
                            {criticalAlerts}
                        </Text>
                    </View>

                    <View style={styles.alertRow}>
                        <View style={styles.alertDotWarning} />

                        <Text style={styles.alertLabel}>
                            High Alerts
                        </Text>

                        <Text style={styles.alertValue}>
                            {highAlerts}
                        </Text>
                    </View>

                    <View style={styles.alertRow}>
                        <View style={styles.alertDotWarning} />

                        <Text style={styles.alertLabel}>
                            Medium Alerts
                        </Text>

                        <Text style={styles.alertValue}>
                            {mediumAlerts}
                        </Text>
                    </View>

                    <View style={styles.alertRow}>
                        <View style={styles.alertDotSafe} />

                        <Text style={styles.alertLabel}>
                            Low Alerts
                        </Text>

                        <Text style={styles.alertValue}>
                            {lowAlerts}
                        </Text>
                    </View>

                    <View style={styles.alertRow}>
                        <View style={styles.alertDotSafe} />

                        <Text style={styles.alertLabel}>
                            Total Alerts
                        </Text>

                        <Text style={styles.alertValue}>
                            {alerts.length}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footerCard}>
                    <Text style={styles.footerIcon}>🌱</Text>

                    <Text style={styles.footerTitle}>
                        Cleaner Cities, Greener Tomorrow
                    </Text>

                    <Text style={styles.footerText}>
                        Data-driven waste management for smarter and cleaner
                        communities.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F4FAF7",
    },

    container: {
        flex: 1,
    },

    content: {
        padding: 18,
        paddingBottom: 35,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 22,
    },

    brandRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    leaf: {
        fontSize: 22,
        marginRight: 7,
    },

    brand: {
        fontSize: 24,
        fontWeight: "900",
        color: "#164E36",
    },

    subtitle: {
        fontSize: 11,
        color: "#64748B",
        marginTop: 2,
        marginLeft: 30,
    },

    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E6F4EC",
        justifyContent: "center",
        alignItems: "center",
    },

    refreshText: {
        fontSize: 23,
        color: "#2E8B57",
        fontWeight: "700",
    },

    titleSection: {
        marginBottom: 22,
    },

    pageTitle: {
        fontSize: 27,
        fontWeight: "900",
        color: "#173B2C",
    },

    pageDescription: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 5,
        lineHeight: 18,
    },

    sectionHeader: {
        marginBottom: 12,
    },

    sectionTitle: {
        fontSize: 17,
        fontWeight: "900",
        color: "#233F52",
    },

    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    statCard: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E4EEE8",
    },

    statIcon: {
        fontSize: 20,
        marginBottom: 7,
    },

    statValue: {
        fontSize: 24,
        fontWeight: "900",
        color: "#164E36",
    },

    statLabel: {
        fontSize: 11,
        color: "#64748B",
        marginTop: 3,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 17,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#E4EEE8",
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: "900",
        color: "#233F52",
    },

    cardSubtitle: {
        fontSize: 11,
        color: "#64748B",
        marginTop: 4,
        marginBottom: 16,
    },

    progressBackground: {
        height: 12,
        backgroundColor: "#E8F1EC",
        borderRadius: 10,
        overflow: "hidden",
    },

    progressFill: {
        height: "100%",
        backgroundColor: "#2E8B57",
        borderRadius: 10,
    },

    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 9,
    },

    progressLabel: {
        fontSize: 11,
        color: "#64748B",
    },

    progressValue: {
        fontSize: 12,
        fontWeight: "900",
        color: "#164E36",
    },

    binRow: {
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F0",
    },

    binInfo: {
        marginBottom: 7,
    },

    binId: {
        fontSize: 12,
        fontWeight: "900",
        color: "#233F52",
    },

    binLocation: {
        fontSize: 9,
        color: "#64748B",
        marginTop: 2,
    },

    binProgressArea: {
        flexDirection: "row",
        alignItems: "center",
    },

    smallProgressBackground: {
        flex: 1,
        height: 7,
        backgroundColor: "#E8F1EC",
        borderRadius: 6,
        overflow: "hidden",
        marginRight: 9,
    },

    smallProgressFill: {
        height: "100%",
        backgroundColor: "#5AAE7A",
        borderRadius: 6,
    },

    binPercent: {
        width: 35,
        fontSize: 10,
        fontWeight: "800",
        color: "#164E36",
        textAlign: "right",
    },

    alertRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F0",
    },

    alertDotCritical: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: "#DC2626",
        marginRight: 10,
    },

    alertDotWarning: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: "#D97706",
        marginRight: 10,
    },

    alertDotSafe: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: "#16A34A",
        marginRight: 10,
    },

    alertLabel: {
        flex: 1,
        fontSize: 11,
        color: "#475569",
    },

    alertValue: {
        fontSize: 13,
        fontWeight: "900",
        color: "#233F52",
    },

    emptyText: {
        fontSize: 11,
        color: "#94A3B8",
        textAlign: "center",
        paddingVertical: 15,
    },

    footerCard: {
        backgroundColor: "#E8F5ED",
        borderRadius: 15,
        padding: 18,
        alignItems: "center",
        marginTop: 3,
    },

    footerIcon: {
        fontSize: 25,
        marginBottom: 6,
    },

    footerTitle: {
        fontSize: 15,
        fontWeight: "900",
        color: "#164E36",
        textAlign: "center",
    },

    footerText: {
        fontSize: 10,
        color: "#64748B",
        textAlign: "center",
        marginTop: 5,
        lineHeight: 15,
    },
    binSelectorCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#E4EEE8",
    },

    selectorTitle: {
        fontSize: 14,
        fontWeight: "900",
        color: "#233F52",
        marginBottom: 10,
    },

    binSelectorList: {
        paddingRight: 5,
    },

    binSelector: {
        backgroundColor: "#F4F8F5",
        borderWidth: 1,
        borderColor: "#DDE8E2",
        borderRadius: 10,
        paddingHorizontal: 13,
        paddingVertical: 9,
        marginRight: 8,
        minWidth: 100,
    },

    binSelectorActive: {
        backgroundColor: "#E4F3EA",
        borderColor: "#2E8B57",
    },

    binSelectorText: {
        fontSize: 11,
        fontWeight: "900",
        color: "#475569",
    },

    binSelectorTextActive: {
        color: "#164E36",
    },

    binSelectorLocation: {
        fontSize: 8,
        color: "#94A3B8",
        marginTop: 3,
    },

    binSelectorLocationActive: {
        color: "#2E8B57",
    },
    trendSelector: {
        marginBottom: 16,
    },

    trendButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 9,
        backgroundColor: "#F1F5F3",
        borderWidth: 1,
        borderColor: "#DDE8E2",
        marginRight: 8,
    },

    trendButtonActive: {
        backgroundColor: "#E3F3E9",
        borderColor: "#2E8B57",
    },

    trendButtonText: {
        fontSize: 10,
        fontWeight: "800",
        color: "#64748B",
    },

    trendButtonTextActive: {
        color: "#164E36",
    },

    chartContainer: {
        height: 190,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        paddingTop: 15,
        paddingHorizontal: 5,
    },

    chartColumn: {
        flex: 1,
        height: 175,
        alignItems: "center",
        justifyContent: "flex-end",
    },

    chartValue: {
        fontSize: 7,
        color: "#64748B",
        marginBottom: 3,
    },

    chartBar: {
        width: 14,
        minHeight: 10,
        backgroundColor: "#2E8B57",
        borderRadius: 5,
    },

    chartIndex: {
        fontSize: 7,
        color: "#94A3B8",
        marginTop: 5,
    },

    noTrendData: {
        fontSize: 11,
        color: "#94A3B8",
        textAlign: "center",
        paddingVertical: 30,
    },
    sensorGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    sensorBox: {
        width: "48%",
        backgroundColor: "#F4F8F5",
        borderRadius: 12,
        padding: 13,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E0EBE4",
    },

    sensorIcon: {
        fontSize: 18,
        marginBottom: 5,
    },

    sensorValue: {
        fontSize: 18,
        fontWeight: "900",
        color: "#164E36",
    },

    sensorLabel: {
        fontSize: 9,
        color: "#64748B",
        marginTop: 3,
    },
    binStatusArea: {
        alignItems: "flex-end",
        justifyContent: "center",
        minWidth: 70,
    },

    binStatus: {
        fontSize: 8,
        fontWeight: "900",
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 6,
        marginBottom: 3,
    },

    binStatusCritical: {
        color: "#DC2626",
        backgroundColor: "#FEE2E2",
    },

    binStatusHigh: {
        color: "#D97706",
        backgroundColor: "#FEF3C7",
    },

    binStatusNormal: {
        color: "#16A34A",
        backgroundColor: "#DCFCE7",
    },
});