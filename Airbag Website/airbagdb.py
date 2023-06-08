''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Necessary Imports
import mysql.connector as mysql                   # Used for interacting with the MySQL database
import os                                         # Used for interacting with the system environment
from dotenv import load_dotenv                    # Used to read the credentials
import dbutils as users
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Configuration
load_dotenv(os.path.dirname(__file__) + '/credentials.env')   # Read in the environment variables for MySQL
db_config = {
  "host": os.environ['MYSQL_HOST'],
  "user": os.environ['MYSQL_USER'],
  "password": os.environ['MYSQL_PASSWORD'],
  "database": os.environ['MYSQL_DATABASE']
}
session_config = {
  'session_key': os.environ['SESSION_KEY']
}

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Define helper functions for CRUD operations
# CREATE SQL query
def register_airbag(airbag_id:int, username:str, battery:str, pressurized:bool) -> int:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "insert into airbags (airbag_id, username, battery, pressurized) values (%s, %s, %s, %s)"
  values = (username, battery, pressurized)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return cursor.lastrowid

# SELECT SQL query
def select_airbags(airbag_id:int=None) -> list:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  if airbag_id == None:
    query = f"select airbag_id, username, battery, pressurized from airbags;"
    cursor.execute(query)
    result = cursor.fetchall()
  else:
    query = f"select airbag_id, username, battery, pressurized from airbags where airbag_id={airbag_id};"
    cursor.execute(query)
    result = cursor.fetchone()
  db.close()
  return result

# SELECT SQL query
def select_user_airbags(username:str) -> list:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = f"select airbag_id, battery, pressurized from airbags where username= \"{username}\";"
  cursor.execute(query)
  result = cursor.fetchall()
  db.close()
  return result

# UPDATE SQL query
def update_airbag(airbag_id:int, battery:str, pressurized:bool) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "update airbags set battery=%s, pressurized=%s, where airbag_id=%s;"
  values = (battery, pressurized, airbag_id)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# UPDATE SQL query
def update_airbag_battery(airbag_id:int, battery:int) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "update airbags set battery=%s where airbag_id=%s;"
  values = (battery, airbag_id)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# UPDATE SQL query
def update_airbag_pressure(airbag_id:int, pressure:bool) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "update airbags set pressurized=%s where airbag_id=%s;"
  values = (pressure, airbag_id)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# UPDATE SQL query
def update_airbag_user(airbag_id:int, username:bool) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "update airbags set username=%s where airbag_id=%s;"
  values = (username, airbag_id)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# DELETE SQL query
def delete_airbag(airbag_id:int) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  cursor.execute(f"delete from airbags where airbag_id={airbag_id};")
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False
