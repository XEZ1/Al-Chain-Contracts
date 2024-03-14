import firebase_admin
from firebase_admin import messaging

def send_push_notification(token, title, body):
    # See documentation: https://firebase.google.com/docs/cloud-messaging/send-message
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=token,
    )

    response = messaging.send(message)
    print('Successfully sent message:', response)
