''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Necessary Imports
import mysql.connector as mysql                   # Used for interacting with the MySQL database
import os                                         # Used for interacting with the system environment
from dotenv import load_dotenv                    # Used to read the credentials
import bcrypt

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
def create_user(first_name:str, last_name:str, email:str, username:str, password:str) -> int:
  password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "insert into users (first_name, last_name, email, username, password) values (%s, %s, %s, %s, %s)"
  values = (first_name, last_name, email, username, password)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return cursor.lastrowid

# SELECT SQL query
def select_users(user_id:int=None) -> list:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  if user_id == None:
    query = f"select id, first_name, last_name, username from users;"
    cursor.execute(query)
    result = cursor.fetchall()
  else:
    query = f"select id, first_name, last_name, username from users where id={user_id};"
    cursor.execute(query)
    result = cursor.fetchone()
  db.close()
  return result

# UPDATE SQL query
def update_user(user_id:int, first_name:str, last_name:str, email:str, username:str, password:str) -> bool:
  password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "update users set first_name=%s, last_name=%s, email = %s, username=%s, password=%s where id=%s;"
  values = (first_name, last_name, email, username, password, user_id)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# UPDATE SQL query
def update_user_with_password(current_password:str, first_name:str, last_name:str, email:str, username:str, password:str) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = f"select id, first_name, last_name, email from users where password={current_password};"
  cursor.execute(query)
  result = cursor.fetchone()
  if result is None:
    return False
  if first_name == "":
    first_name = result[1]
  if last_name == "":
    last_name = result[2]
  if email == "":
    email = result[3]
  if username == "":
    username = result[4]
  query = ""
  values = ("","")
  current_password = bcrypt.hashpw(current_password.encode('utf-8'), bcrypt.gensalt())
  if password == "":
    query = "update users set first_name=%s, last_name=%s, email = %s, username=%s where password=%s;"
    values = (first_name, last_name, email, username, current_password)
  else:
    query = "update users set first_name=%s, last_name=%s, email = %s, username=%s, password=%s where password=%s;"
    password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    values = (first_name, last_name, email, username, password, current_password)
  
  cursor.execute(query, values)
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# UPDATE SQL query
# UNUSED
def update_user_password(email:str, password:str) -> bool:
  password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "update users set password=%s where email=%s;"
  values = (password, email)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# DELETE SQL query
def delete_user(user_id:int) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  cursor.execute(f"delete from users where id={user_id};")
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# SELECT query to verify hashed password of users
def check_user_password(username:str, password:str) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = 'select password from users where username=%s'
  cursor.execute(query, (username,))
  result = cursor.fetchone()
  cursor.close()
  db.close()

  if result is not None:
    return bcrypt.checkpw(password.encode('utf-8'), result[0].encode('utf-8'))
  return False
