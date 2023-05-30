# Add the necessary imports
import mysql.connector as mysql
import os
import datetime
from dotenv import load_dotenv
import bcrypt

# Read Database connection variables
load_dotenv(os.path.dirname(__file__) + "/credentials.env")

db_host = os.environ['MYSQL_HOST']
db_user = os.environ['MYSQL_USER']
db_pass = os.environ['MYSQL_PASSWORD']


# Connect to the db and create a cursor object
db =mysql.connect(user=db_user, password=db_pass, host=db_host)
cursor = db.cursor()


cursor.execute("create database if not exists airbagJacket;")
cursor.execute("use airbagJacket;")
cursor.execute("drop table if exists users;")
cursor.execute("drop table if exists sessions;")
cursor.execute("drop table if exists airbags;")
##############################################################################
try: # TODO UPDATE ALL TO REMOVE STUDENT ID
   cursor.execute("""
   create table if not exists users (
      id         integer auto_increment primary key,
      first_name varchar(64) not null,
      last_name  varchar(64) not null,
      student_id integer not null unique,
      email      varchar(64) not null unique,
      username   varchar(64) not null unique,
      password   varchar(64) not null,
      created_at timestamp not null default current_timestamp
   );
 """)
except RuntimeError as err:
   print("runtime error: {0}".format(err))

try:
   cursor.execute("""
   create table if not exists sessions (
      session_id varchar(64) primary key,
      session_data json not null,
      created_at timestamp not null default current_timestamp
   );
 """)
except RuntimeError as err:
   print("runtime error: {0}".format(err))


# need to change to be airbag
try:
   cursor.execute("""
   create table if not exists airbags (
      airbag_id integer auto_increment primary key,
      username integer not null,
      battery integer not null,
      pressurized BIT not null,
      created_at timestamp not null default current_timestamp
   );
 """)
except RuntimeError as err:
   print("runtime error: {0}".format(err))

# Collection of users with plain-text passwords – BIG NONO! NEVER EVER DO THIS!!!
users = [
  {'first_name':'Zendaya', 'last_name':'',          'student_id': '00000000', 'email': 'a@wow.com',   'username': 'ZD123',   'password': 'abc123'},
  {'first_name':'Tom',     'last_name':'Holland',   'student_id': '00000001', 'email': 'a@epic.com',  'username': 'tommy',   'password': 'abc123'},
  {'first_name':'Tobey',   'last_name':'Maguire',   'student_id': '00000002', 'email': 'a@crazy.com',   'username': 'tobes',   'password': 'abc123'},
  {'first_name':'Andrew',  'last_name':'Garfield',  'student_id': '00000003', 'email': 'a@impossible.com',   'username': 'drewie',  'password': 'abc123'},
  {'first_name':'Rick',    'last_name':'Gessner',   'student_id': '00000004', 'email': 'a@now.com',   'username': 'rickg',   'password': 'drowssap'},
  {'first_name':'Ramsin',  'last_name':'Khoshabeh', 'student_id': '00000005', 'email': 'a@die.com',   'username': 'ramujin', 'password': 'password'}
]

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''


# Generate a salt for extra security
pwd_salt = bcrypt.gensalt()

# Insert every user with a salted and hashed password
for user in users:
  pwd = bcrypt.hashpw(user['password'].encode('utf-8'), pwd_salt)
  query = 'insert into users (first_name, last_name, student_id, email, username, password) values (%s, %s, %s, %s, %s, %s)'
  values = (user['first_name'], user['last_name'], user['student_id'], user['email'], user['username'], pwd)
  cursor.execute(query, values)

# Commit the changes and close the connection
db.commit()
cursor.close()
db.close()

print('Users seeded.')
