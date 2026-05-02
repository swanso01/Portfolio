from typing import Union
import mysql.connector
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
from typing import Optional
import base64
import imghdr
from datetime import date


app = FastAPI()

class ReserveCarRequest(BaseModel):
    user_id: int
    car_id: int
    date_start: str

class LoginRequest(BaseModel):
    email: str
    password: str

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    try:
        if cnx.is_connected():
            return {"Database Connected!"}
        return {"Something is up..."}
    finally:
        cnx.close()

@app.get("/cars/")
def api_get_cars():
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        cursor.execute("select * from cars")
        rows = cursor.fetchall()
        result = []
        for row in rows:
            item = {}
            for col, val in row.items():
                if isinstance(val, (bytes, bytearray)):
                    kind = imghdr.what(None, val) or 'jpeg'
                    b64 = base64.b64encode(val).decode('ascii')
                    item[col] = f"data:image/{kind};base64,{b64}"
                else:
                    item[col] = val
            result.append(item)
        return {"data": result}
    finally:
        cnx.close()
    

@app.post("/login/")
def auth_user(request: LoginRequest):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        cursor.execute("select * from users where email = %s and password = %s", [request.email, request.password])
        myresult = cursor.fetchall()
        if myresult == []:
            return {"data" : False}
        else:
            return {"data": myresult}
    finally:
        cnx.close()

@app.post("/createuser/")
def create_user(username: str, password: str, email: str):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        cursor.execute("select * from users where username = %s and email = %s", [username, email])
        result = cursor.fetchall()
        if result != []:
            return {"data" : False}
        cursor.execute("INSERT INTO users (username, password, email) VALUES (%s, %s, %s)", [username, password, email])
        cnx.commit()
        cursor.execute("select * from users where username = %s and email = %s", [username, email])
        myresult = cursor.fetchall()
        return {"data": myresult}
    finally:
        cnx.close()
    
@app.post("/createcar/")
def create_car(make : str, model : str, year : int, location_id : int, drivetrain : str, color : str, miles : float, type : str, cost : float):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor()
    try:
        cursor.execute("insert into cars (make, model, year, location_id, drivetrain, color, miles, type, cost) values (%s, %s, %s, %s, %s, %s, %s, %s, %s)", [make, model, year, location_id, drivetrain, color, miles, type, cost])
        cnx.commit()
        return {"data" : True}
    finally:
        cnx.close()

@app.get("/get_bookings/")
def get_bookings(user_id: int):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        cursor.execute("select * from reservation where user_id = %s", [user_id])
        rows = cursor.fetchall()
        return {"data": rows}
    finally:
        cnx.close()

@app.post("/edit_car/")
async def edit_car(id : int, location_id : int, miles : float, cost : float):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        sql = "update cars set location_id = %s, miles = %s, cost = %s where id = %s"
        cursor.execute(sql, (location_id, miles, cost, id))
        cnx.commit()
        cursor.execute("select * from cars")
        rows = cursor.fetchall()
        result = []
        for row in rows:
            item = {}
            for col, val in row.items():
                item[col] = val
            result.append(item)
        return {"data": result}
    finally:
        cnx.close()

@app.post("/edit_user/")
def edit_user(id : int, admin: int):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        sql = "update users set admin = %s where id = %s"
        cursor.execute(sql, (admin, id))
        cnx.commit()
        cursor.execute("select * from users")
        rows = cursor.fetchall()
        return {"data": rows}
    finally:
        cnx.close()

@app.post("/turn_in_car/")
def turn_in_car(id: int):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        sql = "update reservation set active = 0 where id = %s"
        cursor.execute(sql, [id])
        cnx.commit()
        today = date.today()
        formatted_date = today.strftime("%Y-%m-%d")
        sql = "select user_id, car_id, date_start from reservation where id = %s"
        cursor.execute(sql, [id])
        row = cursor.fetchone()
        user_id, car_id, date_start = row['user_id'], row['car_id'], row['date_start']
        days = (today - date_start).days
        cursor.execute("select cost from cars where id = %s", [car_id])
        cost_row = cursor.fetchone()
        cost = cost_row['cost']
        price = days * cost
        sql  = "insert into history (user_id, car_id, date_start, date_end, cost) values (%s, %s, %s, %s, %s)"
        cursor.execute(sql, (user_id, car_id, date_start, formatted_date, price))
        cnx.commit()
        cursor.execute("select * from reservation where user_id = %s", [user_id])
        rows = cursor.fetchall()
        return {"data": rows}
    finally:
        cnx.close()

@app.post("/reserve_car/")
def reserve_car(request: ReserveCarRequest):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor()
    try:
        formatted_date = date.fromisoformat(request.date_start).strftime("%Y-%m-%d")
        sql = "insert into reservation (user_id, car_id, date_start, active) values (%s, %s, %s, 1)"
        cursor.execute(sql, (request.user_id, request.car_id, formatted_date))
        cnx.commit()
        return {"data" : True}
    finally:
        cnx.close()

@app.get("/get_one_car/")
def get_one_car(id: int):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        cursor.execute("select * from cars where id = %s", [id])
        row = cursor.fetchone()
        item = {}
        for col, val in row.items():
            if isinstance(val, (bytes, bytearray)):
                kind = imghdr.what(None, val) or 'jpeg'
                b64 = base64.b64encode(val).decode('ascii')
                item[col] = f"data:image/{kind};base64,{b64}"
            else:
                item[col] = val
        return {"data": item}
    finally:
        cnx.close()

@app.get("/get_cars/")
def get_cars_filtered(location_id: Optional[int] = None, make: Optional[str] = None, model: Optional[str] = None, color: Optional[str] = None, drivetrain: Optional[str] = None):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        query = "select * from cars where id not in (select car_id from reservation where active = 1) AND in_use = 1"
        params = []
        if location_id is not None:
            query += " AND location_id = %s"
            params.append(location_id)
        if make:
            query += " AND make = %s"
            params.append(make)
        if model:
            query += " AND model = %s"
            params.append(model)
        if color:
            query += " AND color = %s"
            params.append(color)
        if drivetrain:
            query += " AND drivetrain = %s"
            params.append(drivetrain)
        cursor.execute(query, params)
        rows = cursor.fetchall()
        result = []
        for row in rows:
            item = {}
            for col, val in row.items():
                if isinstance(val, (bytes, bytearray)):
                    kind = imghdr.what(None, val) or 'jpeg'
                    b64 = base64.b64encode(val).decode('ascii')
                    item[col] = f"data:image/{kind};base64,{b64}"
                else:
                    item[col] = val
            result.append(item)
        return {"data": result}
    finally:
        cnx.close()

@app.get("/get_locations/")
def get_locations():
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        cursor.execute("select id, name from location")
        rows = cursor.fetchall()
        return {"data": rows}
    except Exception as e:
        cnx.close()
        return {"data": [], "error": str(e)}
    finally:
        cnx.close()

@app.get("/get_colors/")
def get_colors():
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor()
    try:
        cursor.execute("select distinct color from cars where color is not null and color != ''")
        rows = cursor.fetchall()
        result = [row[0] for row in rows if row[0]]
        return {"data": result}
    except Exception as e:
        cnx.close()
        return {"data": [], "error": str(e)}
    finally:
        cnx.close()

@app.get("/get_makes/")
def get_makes():
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor()
    try:
        cursor.execute("select distinct make from cars where make is not null and make != ''")
        rows = cursor.fetchall()
        result = [row[0] for row in rows if row[0]]
        return {"data": result}
    except Exception as e:
        cnx.close()
        return {"data": [], "error": str(e)}
    finally:
        cnx.close()

@app.get("/get_drivetrains/")
def get_drivetrains():
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor()
    try:
        cursor.execute("select distinct drivetrain from cars where drivetrain is not null and drivetrain != ''")
        rows = cursor.fetchall()
        result = [row[0] for row in rows if row[0]]
        return {"data": result}
    except Exception as e:
        cnx.close()
        return {"data": [], "error": str(e)}
    finally:
        cnx.close()

@app.get("/get_history/")
def get_history(user_id : int):
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        cursor.execute("select * from history where user_id = %s", [user_id])
        rows = cursor.fetchall()
        return {"data": rows}
    except Exception as e:
        cnx.close()
        return {"data": [], "error": str(e)}
    finally:
        cnx.close()

@app.get("/users/")
def get_users():
    cnx = mysql.connector.connect(
        host="localhost",
        user="root",
        password="mysqlissecure123!",
        database="rentalapp",
        ssl_disabled=True
    )
    cursor = cnx.cursor(dictionary=True)
    try:
        cursor.execute("select * from users")
        rows = cursor.fetchall()
        return {"data": rows}
    finally:
        cnx.close()