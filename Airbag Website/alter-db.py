# Add the necessary imports
import mysql.connector as mysql
import os
import datetime
from dotenv import load_dotenv
import bcrypt

# Read Database connection variables
load_dotenv(os.path.dirname(__file__) + '/credentials.env')

db_host = os.environ['MYSQL_HOST']
db_user = os.environ['MYSQL_USER']
db_pass = os.environ['MYSQL_PASSWORD']


# Connect to the db and create a cursor object
db =mysql.connect(user=db_user, password=db_pass, host=db_host)
cursor = db.cursor()
cursor.execute("use airbagJacket;")
query = "update airbags set battery=%s, pressurized=%s where airbag_id=%s;"
values = ('30', True, 4545)
cursor.execute(query, values)
# Commit the changes and close the connection
db.commit()
cursor.close()
db.close()

print('CHANGE.')