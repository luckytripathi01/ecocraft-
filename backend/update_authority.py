from database import get_connection
import bcrypt

db = get_connection()
cursor = db.cursor()

email = "luckytripathi6264@gmail.com"
new_password = "Ecocraft@12345"

password_hash = bcrypt.hashpw(
    new_password.encode("utf-8"),
    bcrypt.gensalt()
).decode("utf-8")

cursor.execute("""
    UPDATE users
    SET email = %s,
        password_hash = %s,
        role = 'authority'
    WHERE user_id = 2
""", (
    email,
    password_hash
))

db.commit()

print("Authority account updated successfully!")

cursor.close()
db.close()