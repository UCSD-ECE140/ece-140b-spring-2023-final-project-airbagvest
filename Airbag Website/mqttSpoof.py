# Add the necessary imports
import mqttComms
import paho.mqtt.client as paho
from paho import mqtt

client = paho.Client(client_id="", userdata=None, protocol=paho.MQTTv5)
# using MQTT version 5 here, for 3.1.1: MQTTv311, 3.1: MQTTv31
# userdata is user defined data of any type, updated by user_data_set()
# client_id is the given name of the client
client.on_connect = mqttComms.on_sub_connect


# enable TLS for secure connection
client.tls_set(tls_version=mqtt.client.ssl.PROTOCOL_TLS)
# set username and password
username = "airbagjacket"
password = "a11n3wp4nt5"
url = "461c2f8dac1642c9b29ae68be3d90e2d.s2.eu.hivemq.cloud"
client.username_pw_set(username, password)
# connect to HiveMQ Cloud on port 8883 (default for MQTT)
client.connect(url, 8883)

# setting callbacks, use separate functions like above for better visibility
client.on_subscribe = mqttComms.on_subscribe
client.on_publish = mqttComms.on_publish
client.loop_start()
client.publish("airbag/data", "4545,20,True", qos=1)
client.loop_stop()