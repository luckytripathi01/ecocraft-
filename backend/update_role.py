from database import get_connection

conn = get_connection()
cursor = conn.cursor()

cursor.execute("""
    SELECT user_id, name, email, role
    FROM users
""")

users = cursor.fetchall()

print("\nCurrent Users and Roles:\n")

for user in users:
    print(user)

cursor.close()
conn.close()
