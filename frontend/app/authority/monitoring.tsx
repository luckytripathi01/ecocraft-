import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { API_URL } from "../../constants/api";

export default function Monitoring() {
    const [bins, setBins] = useState<any[]>([]);
    const [sensorData, setSensorData] = useState<any[]>([]);
    const [selectedBin, setSelectedBin] = useState("");
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [trendType, setTrendType] = useState("waste");
    const [showBinList, setShowBinList] = useState(false);

    const fetchMonitoringData = async () => {
        try {
            setLoading(true);

            const [binsResponse, sensorResponse] = await Promise.all([
                fetch(`${API_URL}/iot/bins`),
                fetch(`${API_URL}/iot/latest`),
            ]);

            const binsData = await binsResponse.json();
            const sensorResult = await sensorResponse.json();

            const binList = Array.isArray(binsData) ? binsData : [];
            const sensors = Array.isArray(sensorResult)
                ? sensorResult
                : sensorResult?.data || [];

            setBins(binList);
            setSensorData(sensors);

            if (!selectedBin) {
                const firstBin =
                    sensors[0]?.bin_id || binList[0]?.bin_id;

                if (firstBin) {
                    setSelectedBin(String(firstBin));
                }
            }
        } catch (error) {
            console.log("Monitoring API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistory = async (binId: string) => {
        if (!binId) return;

        try {
            setHistoryLoading(true);

            const response = await fetch(
                `${API_URL}/iot/history/${binId}`
            );

            const data = await response.json();

            setHistory(
                Array.isArray(data)
                    ? data
                    : data?.data || data?.history || []
            );
        } catch (error) {
            console.log("History API Error:", error);
            setHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchMonitoringData();
    }, []);

    useEffect(() => {
        if (selectedBin) {
            fetchHistory(selectedBin);
        }
    }, [selectedBin]);

    const getSensor = () => {
        return (
            sensorData.find(
                (item) =>
                    String(item.bin_id) === String(selectedBin)
            ) || null
        );
    };

    const sensor = getSensor();

    const wasteLevel = Number(sensor?.waste_level) || 0;
    const temperature = Number(sensor?.temperature) || 0;
    const humidity = Number(sensor?.humidity) || 0;
    const gasLevel = Number(sensor?.gas_level) || 0;

    const priority = sensor?.priority || "LOW";

    const environmentalRisk =
        priority === "CRITICAL"
            ? "CRITICAL"
            : priority === "HIGH"
                ? "HIGH"
                : "SAFE";

    const priorityStyle =
        priority === "CRITICAL"
            ? styles.criticalBadge
            : priority === "HIGH"
                ? styles.highBadge
                : styles.mediumBadge;

    const riskStyle =
        environmentalRisk === "CRITICAL"
            ? styles.criticalRisk
            : environmentalRisk === "HIGH"
                ? styles.highRisk
                : styles.safeRisk;

    const selectedBinInfo = bins.find(
        (bin) => String(bin.bin_id) === String(selectedBin)
    );

    const getHistoryValue = (item: any) => {
        let value = 0;

        if (trendType === "waste") {
            value = Number(
                item?.waste_level ??
                item?.wasteLevel ??
                item?.value ??
                0
            );
        } else if (trendType === "temperature") {
            value = Number(
                item?.temperature ??
                item?.temp ??
                item?.temperature_level ??
                0
            );
        } else if (trendType === "gas") {
            value = Number(
                item?.gas_level ??
                item?.gasLevel ??
                item?.gas ??
                0
            );
        }

        return Number.isNaN(value) ? 0 : value;
    };

    const chartData = history
        .slice(-12)
        .map(getHistoryValue)
        .filter((value) => value >= 0);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoIcon}>🌿</Text>
                        </View>

                        <View>
                            <Text style={styles.logoText}>
                                EcoCraft
                            </Text>

                            <Text style={styles.headerSubtitle}>
                                Smart Waste Management
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={fetchMonitoringData}
                    >
                        <Text style={styles.refreshText}>↻</Text>
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>
                        Live Monitoring
                    </Text>

                    <Text style={styles.subtitle}>
                        Real-time sensor data from smart bins
                    </Text>
                </View>

                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator
                            size="large"
                            color="#2E8B57"
                        />

                        <Text style={styles.loadingText}>
                            Loading sensor data...
                        </Text>
                    </View>
                ) : sensorData.length === 0 && bins.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyIcon}>📡</Text>

                        <Text style={styles.emptyTitle}>
                            No Sensor Data
                        </Text>

                        <Text style={styles.emptyText}>
                            No smart bin sensor data is currently
                            available.
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Bin Selector */}
                        {/* Bin Selector */}
                        <View style={styles.selectorCard}>
                            <Text style={styles.selectorLabel}>
                                SELECT SMART BIN
                            </Text>

                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setShowBinList(!showBinList)}
                            >
                                <Text style={styles.dropdownText}>
                                    {selectedBin || "Select Smart Bin"}
                                </Text>

                                <Text style={styles.dropdownArrow}>
                                    {showBinList ? "▲" : "▼"}
                                </Text>
                            </TouchableOpacity>

                            {showBinList && (
                                <View style={styles.dropdownList}>
                                    {(bins.length > 0 ? bins : sensorData).map(
                                        (item, index) => {
                                            const binId =
                                                item.bin_id ||
                                                `ECO_${String(index + 1).padStart(
                                                    3,
                                                    "0"
                                                )}`;

                                            return (
                                                <TouchableOpacity
                                                    key={`${binId}-${index}`}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setSelectedBin(String(binId));
                                                        setShowBinList(false);
                                                    }}
                                                >
                                                    <Text style={styles.dropdownItemText}>
                                                        {binId}
                                                    </Text>

                                                    <Text style={styles.dropdownLocation}>
                                                        {item.location ||
                                                            "Unknown Location"}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }
                                    )}
                                </View>
                            )}

                            <View style={styles.locationRow}>
                                <Text style={styles.locationIcon}>📍</Text>

                                <Text style={styles.locationText}>
                                    {selectedBinInfo?.location ||
                                        "Unknown Location"}
                                </Text>
                            </View>
                        </View>

                        {/* Waste Gauge */}
                        <View style={styles.gaugeCard}>
                            <Text style={styles.sectionLabel}>
                                WASTE LEVEL
                            </Text>

                            <View style={styles.gaugeOuter}>
                                <View
                                    style={[
                                        styles.gaugeInner,
                                        {
                                            borderColor:
                                                wasteLevel >= 90
                                                    ? "#DC2626"
                                                    : wasteLevel >= 70
                                                        ? "#D97706"
                                                        : "#2E8B57",
                                        },
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.gaugePercentage
                                        }
                                    >
                                        {Math.round(wasteLevel)}%
                                    </Text>

                                    <Text
                                        style={styles.gaugeLabel}
                                    >
                                        Waste Level
                                    </Text>

                                    <Text style={styles.gaugeIcon}>
                                        🗑️
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Environment Cards */}
                        <View style={styles.sensorGrid}>
                            <View style={styles.sensorCard}>
                                <Text style={styles.sensorIcon}>
                                    🌡️
                                </Text>

                                <Text style={styles.sensorValue}>
                                    {temperature.toFixed(0)}°C
                                </Text>

                                <Text style={styles.sensorLabel}>
                                    Temperature
                                </Text>
                            </View>

                            <View style={styles.sensorCard}>
                                <Text style={styles.sensorIcon}>
                                    💧
                                </Text>

                                <Text style={styles.sensorValue}>
                                    {humidity.toFixed(0)}%
                                </Text>

                                <Text style={styles.sensorLabel}>
                                    Humidity
                                </Text>
                            </View>

                            <View style={styles.sensorCard}>
                                <Text style={styles.sensorIcon}>
                                    ☁️
                                </Text>

                                <Text style={styles.sensorValue}>
                                    {gasLevel.toFixed(0)}
                                </Text>

                                <Text style={styles.sensorLabel}>
                                    Gas Level
                                </Text>
                            </View>
                        </View>

                        {/* Priority */}
                        <View style={styles.statusCard}>
                            <View style={styles.statusRow}>
                                <Text style={styles.statusLabel}>
                                    Priority
                                </Text>

                                <View
                                    style={[
                                        styles.statusBadge,
                                        priorityStyle,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.statusBadgeText
                                        }
                                    >
                                        {priority}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.statusRow}>
                                <Text style={styles.statusLabel}>
                                    Environmental Risk
                                </Text>

                                <View
                                    style={[
                                        styles.statusBadge,
                                        riskStyle,
                                    ]}
                                >
                                    <Text
                                        style={
                                            styles.statusBadgeText
                                        }
                                    >
                                        {environmentalRisk}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Sensor Trend */}
                        <View style={styles.trendCard}>
                            <View style={styles.trendHeader}>
                                <View>
                                    <Text style={styles.trendTitle}>
                                        📈 Sensor Trends
                                    </Text>

                                    <Text
                                        style={styles.trendSubtitle}
                                    >
                                        Last available readings
                                    </Text>
                                </View>

                                <View style={styles.liveBadge}>
                                    <View
                                        style={styles.liveDot}
                                    />

                                    <Text
                                        style={styles.liveText}
                                    >
                                        LIVE
                                    </Text>
                                </View>
                            </View>

                            {/* Chart selector */}
                            <View style={styles.chartTabs}>
                                <TouchableOpacity
                                    style={[
                                        styles.chartTab,
                                        trendType === "waste" && styles.chartTabActive,
                                    ]}
                                    onPress={() => setTrendType("waste")}
                                >
                                    <Text
                                        style={
                                            trendType === "waste"
                                                ? styles.chartTabActiveText
                                                : styles.chartTabText
                                        }
                                    >
                                        Waste Level
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.chartTab,
                                        trendType === "temperature" &&
                                        styles.chartTabActive,
                                    ]}
                                    onPress={() => setTrendType("temperature")}
                                >
                                    <Text
                                        style={
                                            trendType === "temperature"
                                                ? styles.chartTabActiveText
                                                : styles.chartTabText
                                        }
                                    >
                                        Temperature
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.chartTab,
                                        trendType === "gas" && styles.chartTabActive,
                                    ]}
                                    onPress={() => setTrendType("gas")}
                                >
                                    <Text
                                        style={
                                            trendType === "gas"
                                                ? styles.chartTabActiveText
                                                : styles.chartTabText
                                        }
                                    >
                                        Gas Level
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {historyLoading ? (
                                <View
                                    style={styles.chartLoading}
                                >
                                    <ActivityIndicator
                                        color="#2E8B57"
                                    />

                                    <Text
                                        style={
                                            styles.chartLoadingText
                                        }
                                    >
                                        Loading trend...
                                    </Text>
                                </View>
                            ) : chartData.length === 0 ? (
                                <View
                                    style={styles.noHistory}
                                >
                                    <Text
                                        style={
                                            styles.noHistoryText
                                        }
                                    >
                                        No historical sensor data
                                        available.
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.chart}>
                                    {chartData.map(
                                        (value, index) => {
                                            const height =
                                                Math.max(
                                                    8,
                                                    Math.min(
                                                        145,
                                                        (value /
                                                            100) *
                                                        145
                                                    )
                                                );

                                            return (
                                                <View
                                                    key={index}
                                                    style={
                                                        styles.barContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.barValue
                                                        }
                                                    >
                                                        {Math.round(
                                                            value
                                                        )}
                                                    </Text>

                                                    <View
                                                        style={[
                                                            styles.bar,
                                                            {
                                                                height,
                                                            },
                                                        ]}
                                                    />
                                                </View>
                                            );
                                        }
                                    )}
                                </View>
                            )}
                        </View>
                    </>
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
        padding: 16,
        paddingBottom: 40,
    },

    header: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E1EBE7",
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    logoCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#E8F7EF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },

    logoIcon: {
        fontSize: 17,
    },

    logoText: {
        fontSize: 15,
        fontWeight: "800",
        color: "#164E36",
    },

    headerSubtitle: {
        fontSize: 8,
        color: "#64748B",
        marginTop: 2,
    },

    refreshButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#E8F7EF",
        justifyContent: "center",
        alignItems: "center",
    },

    refreshText: {
        fontSize: 22,
        color: "#16804A",
        fontWeight: "700",
    },

    titleSection: {
        marginTop: 20,
        marginBottom: 14,
    },

    title: {
        fontSize: 25,
        fontWeight: "800",
        color: "#163F35",
    },

    subtitle: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 4,
    },

    selectorCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E1EBE7",
        marginBottom: 12,
    },

    selectorLabel: {
        fontSize: 9,
        fontWeight: "800",
        color: "#64748B",
        marginBottom: 10,
    },

    binSelector: {
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 9,
        backgroundColor: "#F1F5F9",
        marginRight: 8,
    },

    activeBinSelector: {
        backgroundColor: "#2E8B57",
    },

    binSelectorText: {
        fontSize: 10,
        fontWeight: "800",
        color: "#64748B",
    },

    activeBinSelectorText: {
        color: "#FFFFFF",
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },

    locationIcon: {
        fontSize: 13,
        marginRight: 5,
    },

    locationText: {
        fontSize: 10,
        color: "#64748B",
    },

    gaugeCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 18,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E1EBE7",
        marginBottom: 12,
    },

    sectionLabel: {
        alignSelf: "flex-start",
        fontSize: 9,
        fontWeight: "800",
        color: "#64748B",
        marginBottom: 12,
    },

    gaugeOuter: {
        width: 185,
        height: 185,
        borderRadius: 93,
        borderWidth: 8,
        borderColor: "#DDEFE5",
        justifyContent: "center",
        alignItems: "center",
    },

    gaugeInner: {
        width: 155,
        height: 155,
        borderRadius: 78,
        borderWidth: 8,
        justifyContent: "center",
        alignItems: "center",
    },

    gaugePercentage: {
        fontSize: 30,
        fontWeight: "900",
        color: "#164E36",
    },

    gaugeLabel: {
        fontSize: 10,
        color: "#64748B",
        marginTop: 2,
    },

    gaugeIcon: {
        fontSize: 20,
        marginTop: 7,
    },

    sensorGrid: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },

    sensorCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E1EBE7",
    },

    sensorIcon: {
        fontSize: 20,
        marginBottom: 5,
    },

    sensorValue: {
        fontSize: 17,
        fontWeight: "900",
        color: "#233F52",
    },

    sensorLabel: {
        fontSize: 8,
        color: "#64748B",
        marginTop: 4,
        textAlign: "center",
    },

    statusCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 15,
        borderWidth: 1,
        borderColor: "#E1EBE7",
        marginBottom: 12,
    },

    statusRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 5,
    },

    statusLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: "#475569",
    },

    statusBadge: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
    },

    mediumBadge: {
        backgroundColor: "#FEF3C7",
    },

    highBadge: {
        backgroundColor: "#FEF3C7",
    },

    criticalBadge: {
        backgroundColor: "#FEE2E2",
    },

    safeRisk: {
        backgroundColor: "#DCFCE7",
    },

    highRisk: {
        backgroundColor: "#FEF3C7",
    },

    criticalRisk: {
        backgroundColor: "#FEE2E2",
    },

    statusBadgeText: {
        fontSize: 9,
        fontWeight: "900",
        color: "#334155",
    },

    trendCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 15,
        borderWidth: 1,
        borderColor: "#E1EBE7",
    },

    trendHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    trendTitle: {
        fontSize: 12,
        fontWeight: "800",
        color: "#233F52",
    },

    trendSubtitle: {
        fontSize: 9,
        color: "#64748B",
        marginTop: 3,
    },

    liveBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#DCFCE7",
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 10,
    },

    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#16A34A",
        marginRight: 5,
    },

    liveText: {
        fontSize: 8,
        fontWeight: "900",
        color: "#16A34A",
    },

    chartTabs: {
        flexDirection: "row",
        marginTop: 15,
        marginBottom: 15,
    },

    chartTab: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: "#F1F5F9",
        marginRight: 6,
    },

    chartTabActive: {
        backgroundColor: "#E0F2E8",
    },

    chartTabText: {
        fontSize: 8,
        color: "#64748B",
        fontWeight: "700",
    },

    chartTabActiveText: {
        fontSize: 8,
        color: "#16804A",
        fontWeight: "800",
    },

    chart: {
        height: 190,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: "#E2E8F0",
        paddingHorizontal: 5,
        paddingTop: 10,
    },

    barContainer: {
        height: 170,
        alignItems: "center",
        justifyContent: "flex-end",
        width: 22,
    },

    barValue: {
        fontSize: 7,
        color: "#64748B",
        marginBottom: 3,
    },

    bar: {
        width: 13,
        backgroundColor: "#2E8B57",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },

    chartLoading: {
        height: 170,
        justifyContent: "center",
        alignItems: "center",
    },

    chartLoadingText: {
        fontSize: 10,
        color: "#64748B",
        marginTop: 8,
    },

    noHistory: {
        height: 150,
        justifyContent: "center",
        alignItems: "center",
    },

    noHistoryText: {
        fontSize: 11,
        color: "#64748B",
        textAlign: "center",
    },

    loadingBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 40,
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        fontSize: 12,
        color: "#64748B",
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
        fontSize: 38,
    },

    emptyTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "800",
        color: "#164E36",
    },

    emptyText: {
        marginTop: 6,
        fontSize: 11,
        color: "#64748B",
        textAlign: "center",
    },
    dropdownButton: {
        height: 44,
        borderWidth: 1,
        borderColor: "#DDE8E2",
        borderRadius: 10,
        backgroundColor: "#F8FCFA",
        paddingHorizontal: 13,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    dropdownText: {
        fontSize: 12,
        fontWeight: "800",
        color: "#233F52",
    },

    dropdownArrow: {
        fontSize: 11,
        color: "#2E8B57",
    },

    dropdownList: {
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#DDE8E2",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
    },

    dropdownItem: {
        paddingHorizontal: 13,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2F0",
    },

    dropdownItemText: {
        fontSize: 11,
        fontWeight: "800",
        color: "#233F52",
    },

    dropdownLocation: {
        fontSize: 8,
        color: "#64748B",
        marginTop: 2,
    },
});