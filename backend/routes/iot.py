from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection

router = APIRouter(
    prefix="/iot",
    tags=["IoT"]
)


class SensorData(BaseModel):
    bin_id: str
    waste_level: float
    temperature: float
    humidity: float
    gas_level: float
    lid_open: bool

def analyze_sensor_data(data):

    priority = "LOW"
    environmental_risk = "SAFE"
    alerts = []

    # Gas Risk
    if data.gas_level > 500:
        priority = "CRITICAL"
        environmental_risk = "CRITICAL"
        alerts.append({
            "type": "GAS_ALERT",
            "message": "Dangerous gas or smoke level detected"
        })

    # Temperature Risk
    if data.temperature > 40:

        if priority != "CRITICAL":
            priority = "HIGH"

        environmental_risk = "HIGH"

        alerts.append({
            "type": "TEMPERATURE_ALERT",
            "message": "High temperature detected - possible fire risk"
        })

    # Waste Level Risk
    if data.waste_level >= 90:

        if priority not in ["CRITICAL"]:
            priority = "HIGH"

        alerts.append({
            "type": "BIN_FULL",
            "message": "Waste bin is almost full"
        })

    elif data.waste_level >= 70:

        if priority == "LOW":
            priority = "MEDIUM"

        alerts.append({
            "type": "BIN_WARNING",
            "message": "Waste bin is filling up"
        })

    return priority, environmental_risk, alerts


@router.post("/data")
def receive_sensor_data(data: SensorData):

    priority, environmental_risk, alerts = analyze_sensor_data(data)

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Check Smart Bin
        cursor.execute(
            "SELECT bin_id FROM smart_bins WHERE bin_id = %s",
            (data.bin_id,)
        )

        bin_exists = cursor.fetchone()

        # Automatically add new bin if not exists
        if not bin_exists:

            cursor.execute(
                """
                INSERT INTO smart_bins (bin_id, location)
                VALUES (%s, %s)
                """,
                (data.bin_id, "Unknown Location")
            )

        # Save Sensor Reading
        cursor.execute(
            """
            INSERT INTO sensor_readings
            (
                bin_id,
                waste_level,
                temperature,
                humidity,
                gas_level,
                lid_open,
                priority,
                environmental_risk
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                data.bin_id,
                data.waste_level,
                data.temperature,
                data.humidity,
                data.gas_level,
                data.lid_open,
                priority,
                environmental_risk
            )
        )

        reading_id = cursor.lastrowid

        # Save Alerts
        for alert in alerts:

            cursor.execute(
                """
                INSERT INTO iot_alerts
                (
                    bin_id,
                    alert_type,
                    message,
                    priority
                )
                VALUES (%s, %s, %s, %s)
                """,
                (
                    data.bin_id,
                    alert["type"],
                    alert["message"],
                    priority
                )
            )

        conn.commit()

        # Get Latest Reading
        cursor.execute(
            """
            SELECT *
            FROM sensor_readings
            WHERE reading_id = %s
            """,
            (reading_id,)
        )

        saved_data = cursor.fetchone()

        cursor.close()
        conn.close()

        return {
            "message": "Sensor data saved successfully",
            "data": saved_data,
            "alerts": alerts
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/latest")
def get_latest_data():

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT sr.*
            FROM sensor_readings sr
            INNER JOIN (
                SELECT bin_id, MAX(reading_id) AS latest_id
                FROM sensor_readings
                GROUP BY bin_id
            ) latest
            ON sr.reading_id = latest.latest_id
            ORDER BY sr.created_at DESC
            """
        )

        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return data

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/history/{bin_id}")
def get_bin_history(bin_id: str):

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM sensor_readings
            WHERE bin_id = %s
            ORDER BY reading_id DESC
            LIMIT 50
            """,
            (bin_id,)
        )

        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return data

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/alerts")
def get_alerts():

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM iot_alerts
            WHERE status = 'active'
            ORDER BY alert_id DESC
            LIMIT 50
            """
        )

        alerts = cursor.fetchall()

        cursor.close()
        conn.close()

        return alerts

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
@router.get("/bins")
def get_smart_bins():

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM smart_bins
            ORDER BY created_at DESC
        """)

        bins = cursor.fetchall()

        cursor.close()
        conn.close()

        return bins

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.put("/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: int):

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE iot_alerts
            SET status = 'resolved'
            WHERE alert_id = %s
        """, (alert_id,))

        conn.commit()

        if cursor.rowcount == 0:

            cursor.close()
            conn.close()

            raise HTTPException(
                status_code=404,
                detail="Alert not found"
            )

        cursor.close()
        conn.close()

        return {
            "message": "Alert resolved successfully",
            "alert_id": alert_id,
            "status": "resolved"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )   