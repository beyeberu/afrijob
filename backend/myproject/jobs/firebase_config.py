# yourapp/firebase_config.py
import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("./backend/myprojact/jobs/afrijob-a8080-firebase-adminsdk-fbsvc-79e545e9c7.json")
firebase_admin.initialize_app(cred)
