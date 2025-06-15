# backend.py
import os
import qrcode
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pymysql
from werkzeug.utils import secure_filename
from datetime import datetime
import socket
from dotenv import load_dotenv

load_dotenv(dotenv_path="C:\\Users\\ADMIN\\OneDrive\\Desktop\\SAS\\frontend\\.env")

app = Flask(__name__)
CORS(app)

# Config
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Database connection
import os
from dotenv import load_dotenv
import pymysql

# Load environment variables from .env file
load_dotenv()

# Database connection using env vars
db = pymysql.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME'),
    cursorclass=pymysql.cursors.DictCursor,
    autocommit=True
)

# ------------------ /register Route ------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not all([first_name, last_name, email, password, role]):
        return jsonify({'error': 'Missing required fields'}), 400

    if role not in ['student', 'teacher']:
        return jsonify({'error': 'Invalid role'}), 400

    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
            if cursor.fetchone():
                return jsonify({'error': 'Email already exists'}), 400

            cursor.execute("""
                INSERT INTO users (first_name, last_name, email, password, role)
                VALUES (%s, %s, %s, %s, %s)
            """, (first_name, last_name, email, password, role))
            user_id = cursor.lastrowid

            if role == 'student':
                cursor.execute("INSERT INTO students (user_id, attendance) VALUES (%s, 0)", (user_id,))
            elif role == 'teacher':
                cursor.execute("INSERT INTO teachers (user_id) VALUES (%s)", (user_id,))

            return jsonify({'message': 'User registered', 'user_id': user_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ /login Route ------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
            user = cursor.fetchone()
            if user and user['password'] == password:
                user_info = {k: v for k, v in user.items() if k != 'password'}
                return jsonify({'message': 'Login successful', 'role': user['role'],'user_id': user['id'], 'user': user_info}), 200
            else:
                return jsonify({'error': 'Invalid email or password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ /details Route ------------------
@app.route('/details', methods=['POST'])
def details():
    try:
        user_id = request.form.get('user_id')
        role = request.form.get('role')
        department = request.form.get('department')
        phone = request.form.get('phone')
        dob = request.form.get('dob')
        gender = request.form.get('gender')
        address = request.form.get('address')
        image = request.files.get('image')

        roll_number = request.form.get('roll_number')
        batch = request.form.get('batch')
        course = request.form.get('course')
        salary = request.form.get('salary')
        designation = request.form.get('designation')
        qualification = request.form.get('qualification')

        if not user_id or not role:
            return jsonify({'error': 'User ID and role are required'}), 400

        if not image:
            return jsonify({'error': 'Image file missing'}), 400

        filename = secure_filename(f"{user_id}_{image.filename}")
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)
        
        debug_mode = os.getenv("DEBUG")
        if debug_mode:
            print("Running")
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            try:
                s.connect(("8.8.8.8", 80))
                ip = s.getsockname()[0]
            finally:
                s.close()
            server_ip = ip
            print(server_ip)
        else:
            server_ip = "192.168.23.144"
        
        qr_data = f"http://{server_ip}:5000/mark_attendance/{user_id}"
        qr = qrcode.make(qr_data)
        qr_filename = f"{user_id}_qr.png"
        qr_path = os.path.join(app.config['UPLOAD_FOLDER'], qr_filename)
        qr.save(qr_path)

        with db.cursor() as cursor:
            cursor.execute("""
                UPDATE users SET department=%s, phone=%s, dob=%s, gender=%s, address=%s, image=%s, qr_code=%s
                WHERE id=%s
            """, (department, phone, dob, gender, address, filename, qr_filename, user_id))

            cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()

            if not user:
                return jsonify({'error': 'User not found'}), 404

            role = user['role']

            if role == 'student':
                cursor.execute('''
                UPDATE students
                SET department=%s,
                    roll_number=%s,
                    batch=%s,
                    course=%s,
                    phone=%s,
                    dob=%s,
                    gender=%s,
                    address=%s,
                    image=%s
                WHERE user_id=%s
            ''', (
                department,
                roll_number,
                batch,
                course,
                phone,
                dob,
                gender,
                address,
                image_path,
                user_id
            ))
            elif role == 'teacher':
                cursor.execute('''
                UPDATE teachers
                SET department=%s,
                    designation=%s,
                    qualification=%s,
                    salary=%s,
                    phone=%s,
                    dob=%s,
                    gender=%s,
                    address=%s,
                    image=%s
                WHERE user_id=%s
            ''', (
                department,
                designation,
                qualification,
                salary,
                phone,
                dob,
                gender,
                address,
                image_path,
                user_id
            ))

        return jsonify({'message': 'Details saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ /get_user/<user_id> Route ------------------
@app.route('/get_user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT id, first_name, last_name, email, role, image, qr_code, department, roll_number, dob, phone, address FROM users WHERE id=%s", (user_id,))
            user = cursor.fetchone()
            if not user:
                return jsonify({'error': 'User not found'}), 404

            role = user['role']
            role_data = {}

            if role == 'student':
                cursor.execute("SELECT roll_number, batch, attendance FROM students WHERE user_id=%s", (user_id,))
                role_data = cursor.fetchone() or {}
            elif role == 'teacher':
                cursor.execute("SELECT salary, designation FROM teachers WHERE user_id=%s", (user_id,))
                role_data = cursor.fetchone() or {}

            role_data['image'] = user['image']
            role_data['qr_code'] = user['qr_code']

            return jsonify({
                'user': {
                    'id': user['id'],
                    'name': f"{user['first_name']} {user['last_name']}",
                    'email': user['email'],
                    'role': user['role'],
                    'department': user['department'],
                    'roll_number': user['roll_number'],
                    'dob': user['dob'],
                    'phone' : user['phone'],
                    'address' : user['address']

                },
                'role_data': role_data
            }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ------------------ Serve Uploaded Files ------------------
@app.route('/uploads/<path:filename>')
def serve_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ------------------ /mark_attendance Route ------------------
@app.route('/mark_attendance/<int:user_id>')
def mark_attendance(user_id):
    cursor = db.cursor()
    today = datetime.now().date()

    cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
    role_result = cursor.fetchone()

    if not role_result:
        return jsonify(status="error", message="User not found")

    role = role_result['role']
    table = 'students' if role == 'student' else 'teachers'
    cursor.execute(f"SELECT attendance FROM {table} WHERE user_id = %s", (user_id,))
    attendance_result = cursor.fetchone()

    if attendance_result is None:
        return jsonify(status="error", message="Attendance record not found")

    attendance_str = attendance_result['attendance'] or ''
    attendance_list = attendance_str.split(',') if attendance_str else []
    today_str = today.strftime('%Y-%m-%d')

    if today_str in attendance_list:
        return jsonify(status="already", message="Attendance already marked today")

    attendance_list.append(today_str)
    updated_attendance = ','.join(attendance_list)

    try:
        cursor.execute(f"UPDATE {table} SET attendance = %s WHERE user_id = %s", (updated_attendance, user_id))
        cursor.execute("INSERT INTO attendance (user_id, date) VALUES (%s, %s)", (user_id, today_str))
        db.commit()
        return jsonify(status="success", message="Attendance marked")
    except Exception as e:
        return jsonify(status="error", message=str(e))




@app.route('/api/admin/user-stats', methods=['GET'])
def get_user_stats():
    try:
        with db.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) AS total_students FROM students")
            student_count = cursor.fetchone()['total_students']

            cursor.execute("SELECT COUNT(*) AS total_teachers FROM teachers")
            teacher_count = cursor.fetchone()['total_teachers']

        return jsonify({
            'students': student_count,
            'teachers': teacher_count
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    try:
        print("Fetching all users...")
        with db.cursor() as cursor:
            cursor.execute("SELECT id, CONCAT(first_name, ' ', last_name) AS name, email, role FROM users")
            users = cursor.fetchall()
        return jsonify(users), 200
    except Exception as e:
        print("Error fetching users:", e)
        return jsonify({'error': 'Failed to fetch users'}), 500



@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user_by_id(user_id):
    try:
        with db.cursor() as cursor:
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        print("Error deleting user:", e)
        return jsonify({'error': 'Failed to delete user'}), 500


@app.route('/api/admin/attendance', methods=['GET'])
def get_attendance_records():
    try:
        with db.cursor() as cursor:
            query = """
                SELECT a.id, u.first_name, u.last_name, u.email, a.date
                FROM attendance a
                JOIN users u ON a.user_id = u.id
                ORDER BY a.date DESC
            """
            cursor.execute(query)
            records = cursor.fetchall()
        return jsonify(records), 200
    except Exception as e:
        print("Error fetching attendance records:", e)
        return jsonify({'error': 'Failed to fetch attendance records'}), 500


from io import StringIO, BytesIO
import csv
from flask import send_file

@app.route('/api/admin/attendance-report', methods=['GET'])
def generate_attendance_report():
    try:
        with db.cursor() as cursor:
            query = """
            SELECT users.id, users.first_name, users.last_name, users.email, users.role, attendance.date
            FROM attendance
            JOIN users ON attendance.user_id = users.id
            ORDER BY attendance.date DESC;
            """
            cursor.execute(query)
            rows = cursor.fetchall()

        # Convert rows to CSV
        si = StringIO()
        writer = csv.writer(si)
        writer.writerow(['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Date'])

        for row in rows:
            writer.writerow([
                row['id'],
                row['first_name'],
                row['last_name'],
                row['email'],
                row['role'],
                row['date'].strftime('%Y-%m-%d %H:%M:%S') if isinstance(row['date'], datetime) else row['date']
            ])

        # StringIO to BytesIO for send_file
        mem = BytesIO()
        mem.write(si.getvalue().encode('utf-8'))
        mem.seek(0)

        return send_file(
            mem,
            mimetype='text/csv',
            as_attachment=True,
            download_name='attendance_report.csv'
        )

    except Exception as e:
        print("Error generating report:", e)
        return jsonify({'error': 'Failed to generate report'}), 500



@app.route('/api/admin/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    try:
        with db.cursor() as cursor:
            cursor.execute("DELETE FROM users WHERE id = %s", (id,))
            db.commit()
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500



# ------------------ Run the App ------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
