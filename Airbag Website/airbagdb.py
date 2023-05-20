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
def create_comment(project_id:int, username:str, comment:str) -> int:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "insert into comments (project_id, username, comment) values (%s, %s, %s)"
  values = (project_id, username, comment)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return cursor.lastrowid

# SELECT SQL query
def select_comments(comment_id:int=None) -> list:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  if comment_id == None:
    query = f"select comment_id, project_id, username, comment from comments;"
    cursor.execute(query)
    result = cursor.fetchall()
  else:
    query = f"select comment_id, project_id, username, comment from comments where comment_id={comment_id};"
    cursor.execute(query)
    result = cursor.fetchone()
  db.close()
  return result

# SELECT SQL query
def select_user_comments(username:str) -> list:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = f"select comment_id, project_id, comment from comments where username= \"{username}\";"
  cursor.execute(query)
  result = cursor.fetchall()
  db.close()
  return result

# SELECT SQL query
def select_idea_comments(project_id:int) -> list:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = f"select comment_id, project_id, comment from comments where project_id={project_id};"
  cursor.execute(query)
  result = cursor.fetchall()
  db.close()
  return result

# SELECT SQL query
def select_user_idea_comments(project_id:int, username:str) -> list:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = f"select comment, comment_id from comments where username = \"{username}\" and project_id={project_id};"
  cursor.execute(query)
  result = cursor.fetchall()
  db.close()
  return result

# UPDATE SQL query
def update_comment(comment_id:int, project_id:int, username:str, comment:str) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "update comments set project_id=%s, username=%s, comment=%s, where comment_id=%s;"
  values = (project_id, username, comment, comment_id)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# UPDATE SQL query
def update_user_comment(comment_id:int, comment:str) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  query = "update comments set comment=%s where comment_id=%s;"
  values = (comment, comment_id)
  cursor.execute(query, values)
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

# DELETE SQL query
def delete_comment(comment_id:int) -> bool:
  db = mysql.connect(**db_config)
  cursor = db.cursor()
  cursor.execute(f"delete from comments where comment_id={comment_id};")
  db.commit()
  db.close()
  return True if cursor.rowcount == 1 else False

