import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { API_URL } from "../../constants/api";

export default function Bins() {
    const [bins, setBins] = useState<any[]>([]);
    const [sensorData, setSensorData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    const fetchBins = async () => {
        try {
            setLoading(true);

            const [binsResponse, sensorResponse] = await Promise.all([
                fetch(`${API_URL}/iot/bins`),
                fetch(`${API_URL}/iot/latest`),
            ]);

            const binsData = await binsResponse.json();
            const sensorResult = await sensorResponse.json();

            setBins(Array.isArray(binsData) ? binsData : []);

            setSensorData(
                Array.isArray(sensorResult)
                    ? sensorResult
                    : sensorResult?.data || []
            );
        } catch (error) {
            console.log("Smart Bins API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBins();
    }, []);

    const getSensorForBin = (binId: string, index: number) => {
        const exactMatch = sensorData.find(
            (item) => String(item.bin_id) === String(binId)
        );

        return exactMatch || sensorData[index] || null;
    };

    const getStatus = (sensor: any) => {
        if (!sensor) return "Active";

        if (sensor.priority === "CRITICAL") {
            return "Critical";
        }

        return "Active";
    };

    const filteredBins = useMemo(() => {
        return bins.filter((bin, index) => {
            const sensor = getSensorForBin(bin.bin_id, index);
            const status = getStatus(sensor);

            const searchText = search.toLowerCase();

            const matchesSearch =
                String(bin.bin_id || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(bin.location || "")
                    .toLowerCase()
                    .includes(searchText);

            const matchesFilter =
                filter === "ALL" ||
                (filter === "ACTIVE" && status === "Active") ||
                (filter === "CRITICAL" && status === "Critical");

            return matchesSearch && matchesFilter;
        });
    }, [bins, sensorData, search, filter]);

    const getFillLevel = (sensor: any) => {
        if (!sensor) return 0;

        const value = Number(sensor.waste_level);

        if (Number.isNaN(value)) return 0;

        return Math.max(0, Math.min(100, value));
    };

    const getStatusColor = (status: string) => {
        if (status === "Critical") {
            return "#DC2626";
        }

        return "#16A34A";
    };

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
                            <Text style={styles.logoText}>EcoCraft</Text>
                            <Text style={styles.headerSubtitle}>
                                Smart Waste Management
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={fetchBins}
                    >
                        <Text style={styles.refreshText}>↻</Text>
                    </TouchableOpacity>
                </View>

                {/* Page Title */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>Smart Bins</Text>

                    <Text style={styles.subtitle}>
                        Manage and monitor all smart bins
                    </Text>
                </View>

                {/* Search */}
                <View style={styles.searchBox}>
                    <Text style={styles.searchIcon}>⌕</Text>

                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search bin ID or location..."
                        placeholderTextColor="#94A3B8"
                        style={styles.searchInput}
                    />
                </View>

                {/* Filters */}
                <View style={styles.filters}>
                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filter === "ALL" && styles.activeFilter,
                        ]}
                        onPress={() => setFilter("ALL")}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                filter === "ALL" &&
                                styles.activeFilterText,
                            ]}
                        >
                            All ({bins.length})
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filter === "ACTIVE" && styles.activeFilter,
                        ]}
                        onPress={() => setFilter("ACTIVE")}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                filter === "ACTIVE" &&
                                styles.activeFilterText,
                            ]}
                        >
                            Active (
                            {
                                bins.filter((bin, index) => {
                                    const sensor = getSensorForBin(
                                        bin.bin_id,
                                        index
                                    );
                                    return getStatus(sensor) === "Active";
                                }).length
                            }
                            )
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.filterButton,
                            filter === "CRITICAL" &&
                            styles.criticalFilter,
                        ]}
                        onPress={() => setFilter("CRITICAL")}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                filter === "CRITICAL" &&
                                styles.criticalFilterText,
                            ]}
                        >
                            Critical (
                            {
                                bins.filter((bin, index) => {
                                    const sensor = getSensorForBin(
                                        bin.bin_id,
                                        index
                                    );
                                    return getStatus(sensor) === "Critical";
                                }).length
                            }
                            )
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Loading */}
                {loading ? (
                    <View style={styles.loadingBox}>
                        <ActivityIndicator
                            size="large"
                            color="#2E8B57"
                        />

                        <Text style={styles.loadingText}>
                            Loading smart bins...
                        </Text>
                    </View>
                ) : filteredBins.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyIcon}>🗑️</Text>

                        <Text style={styles.emptyTitle}>
                            No Smart Bins Found
                        </Text>

                        <Text style={styles.emptyText}>
                            No bins match your current search or filter.
                        </Text>
                    </View>
                ) : (
                    /* Bin List */
                    filteredBins.map((bin, index) => {
                        const sensor = getSensorForBin(
                            bin.bin_id,
                            index
                        );

                        const fillLevel = getFillLevel(sensor);
                        const status = getStatus(sensor);
                        const statusColor =
                            getStatusColor(status);

                        return (
                            <View
                                key={`${bin.bin_id}-${index}`}
                                style={[
                                    styles.binCard,
                                    status === "Critical" &&
                                    styles.criticalCard,
                                ]}
                            >
                                {/* Bin Icon */}
                                <View
                                    style={[
                                        styles.binIcon,
                                        status === "Critical" &&
                                        styles.criticalBinIcon,
                                    ]}
                                >
                                    <Text style={styles.binIconText}>
                                        🗑️
                                    </Text>
                                </View>

                                {/* Information */}
                                <View style={styles.binInfo}>
                                    <View style={styles.binTopRow}>
                                        <Text style={styles.binId}>
                                            {bin.bin_id ||
                                                `ECO_${String(
                                                    index + 1
                                                ).padStart(3, "0")}`}
                                        </Text>

                                        <View
                                            style={[
                                                styles.statusBadge,
                                                {
                                                    backgroundColor:
                                                        status ===
                                                            "Critical"
                                                            ? "#FEE2E2"
                                                            : "#DCFCE7",
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.statusText,
                                                    {
                                                        color: statusColor,
                                                    },
                                                ]}
                                            >
                                                {status}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.location}>
                                        {bin.location ||
                                            "Unknown Location"}
                                    </Text>

                                    {/* Fill bar */}
                                    <View style={styles.fillRow}>
                                        <View
                                            style={styles.fillBarBackground}
                                        >
                                            <View
                                                style={[
                                                    styles.fillBar,
                                                    {
                                                        width: `${fillLevel}%`,
                                                        backgroundColor:
                                                            fillLevel >= 90
                                                                ? "#DC2626"
                                                                : fillLevel >=
                                                                    70
                                                                    ? "#D97706"
                                                                    : "#2E8B57",
                                                    },
                                                ]}
                                            />
                                        </View>

                                        <Text
                                            style={styles.fillText}
                                        >
                                            {Math.round(fillLevel)}%
                                        </Text>
                                    </View>
                                </View>

                                {/* Time / Arrow */}
                                <View style={styles.rightSection}>
                                    <Text style={styles.arrow}>›</Text>

                                    <Text style={styles.time}>
                                        Live
                                    </Text>
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
        padding: 16,
        paddingBottom: 35,
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

    searchBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: "#E1EBE7",
    },

    searchIcon: {
        fontSize: 22,
        color: "#94A3B8",
        marginRight: 7,
    },

    searchInput: {
        flex: 1,
        fontSize: 12,
        color: "#334155",
    },

    filters: {
        flexDirection: "row",
        marginTop: 13,
        marginBottom: 14,
    },

    filterButton: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 18,
        marginRight: 7,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },

    activeFilter: {
        backgroundColor: "#2E8B57",
        borderColor: "#2E8B57",
    },

    criticalFilter: {
        backgroundColor: "#FEE2E2",
        borderColor: "#FECACA",
    },

    filterText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#64748B",
    },

    activeFilterText: {
        color: "#FFFFFF",
    },

    criticalFilterText: {
        color: "#DC2626",
    },

    binCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 13,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E1EBE7",
    },

    criticalCard: {
        borderColor: "#FECACA",
        backgroundColor: "#FFFCFC",
    },

    binIcon: {
        width: 43,
        height: 43,
        borderRadius: 22,
        backgroundColor: "#DDF5E7",
        justifyContent: "center",
        alignItems: "center",
    },

    criticalBinIcon: {
        backgroundColor: "#FEE2E2",
    },

    binIconText: {
        fontSize: 19,
    },

    binInfo: {
        flex: 1,
        marginLeft: 11,
    },

    binTopRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    binId: {
        fontSize: 13,
        fontWeight: "800",
        color: "#233F52",
    },

    statusBadge: {
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 8,
        marginLeft: 5,
    },

    statusText: {
        fontSize: 9,
        fontWeight: "800",
    },

    location: {
        fontSize: 9,
        color: "#64748B",
        marginTop: 3,
        marginBottom: 7,
    },

    fillRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    fillBarBackground: {
        flex: 1,
        height: 6,
        backgroundColor: "#E2E8F0",
        borderRadius: 5,
        overflow: "hidden",
    },

    fillBar: {
        height: "100%",
        borderRadius: 5,
    },

    fillText: {
        width: 35,
        textAlign: "right",
        fontSize: 10,
        fontWeight: "800",
        color: "#334155",
    },

    rightSection: {
        width: 35,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5,
    },

    arrow: {
        fontSize: 28,
        color: "#2E8B57",
        lineHeight: 28,
    },

    time: {
        fontSize: 8,
        color: "#64748B",
        marginTop: 3,
    },

    loadingBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        padding: 35,
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        color: "#64748B",
        fontSize: 12,
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
    },

    emptyTitle: {
        marginTop: 10,
        fontSize: 17,
        fontWeight: "800",
        color: "#164E36",
    },

    emptyText: {
        marginTop: 6,
        textAlign: "center",
        color: "#64748B",
        fontSize: 11,
    },
});