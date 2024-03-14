from exponent_server_sdk import PushClient, PushMessage

# Basic arguments. You should extend this function with the push features you need
def send_push_notification(token, title, body):
    message = PushMessage(to=token, title=title, body=body)

    # Send the message
    try:
        response = PushClient().publish(message)
        print("Successfully sent message:", response)
    except Exception as e:
        print("Error sending message:", e)
