from flask import Flask,jsonify,request
from flask_cors import CORS
import mysql.connector

app= Flask(__name__)
CORS(app)


config ={
    "host":"localhost",
    "user":"root",
    "password":"",
    "database":"employees_db"
}


@app.route('/employees', methods=['GET'])
def getAllEmployees():
    try:
        database= mysql.connector.connect(**config)
        cursor=database.cursor(dictionary = True)
        cursor.execute("SELECT * FROM employees")
        employees = cursor.fetchall()
        cursor.close()
        database.close()
        return jsonify({"data":employees,"success":True}),200
    except Exception as e:
        return jsonify({"message" : f"Error:{e} "}),404
    

@app.route('/employees', methods=['POST'])
def createEmploye():
    try:
        data = request.json
        data.setdefault("employe_activate", 1) 
        
        database = mysql.connector.connect(**config)
        cursor = database.cursor()
        sql="INSERT INTO employees (id, name, phone,email, address,time_in_company, position_employe, contract_type,employe_activate) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        cursor.execute(sql,tuple(data.values()))
        database.commit()
        cursor.close()
        database.close()
        return jsonify({"data":data,"message" : " Empleado creado ","success":True}),201
    except Exception as e:
        return jsonify({"message" : f"Error:{e} " ,"success":False}),404


@app.route('/employees/<int:employe_id>', methods=['PUT'])
def updateEmploye(employe_id):
    try:
        data = request.json
        data.setdefault("employe_activate", 1) 
        database = mysql.connector.connect(**config)
        cursor = database.cursor()

        cursor.execute("SELECT * FROM employees WHERE id=%s",(employe_id,))
        employe= cursor.fetchone()
        if not employe:
            return jsonify({"message" : f"Empleado no encontrado ","success":False}),404
              
        sql="UPDATE employees   SET name = %s, phone = %s, email = %s, address = %s, time_in_company = %s,position_employe = %s, contract_type = %s, employe_activate = %s WHERE id = %s"
        data.pop("id",None)
        values = tuple(data.values()) + (employe_id,)  
        cursor.execute(sql,values)
        database.commit()


        database.commit()
        cursor.close()
        database.close()

        return jsonify({"data":employe,"message" : " Empleado Editado ","success":True}),200
    except Exception as e:
        return jsonify({"message" : f"Error:{e} "}),404



@app.route('/employees/<int:employe_id>', methods=['DELETE'])
def deleteEmploye(employe_id):
    try:
        database = mysql.connector.connect(**config)
        cursor = database.cursor()

        cursor.execute("SELECT * FROM employees WHERE id=%s",(employe_id,))
        employe= cursor.fetchone()
        if not employe:
            return jsonify({"message" : f"Empleado no encontrado","success":False}),404

        cursor.execute("DELETE FROM employees WHERE id=%s",(employe_id,))
        database.commit()

        cursor.close()
        database.close()

        return jsonify({"message" : " Empleado eliminado ","success":True}),200    
    except Exception as e:
        return jsonify({"message" : f"Error:{e} ","success":False}),404



if __name__  == '__main__':
    app.run (debug=True)