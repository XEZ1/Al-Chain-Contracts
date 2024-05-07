import pytest
from unittest.mock import patch
from Notifications.utils import send_push_notification


@pytest.mark.django_db
class TestPushNotification:

    def test_send_push_notification_success(self):
        # Use create_autospec to ensure that mocks adhere to the specifications of real objects
        with patch('Notifications.utils.PushClient', autospec=True) as mock_push_client:
            # Configure the mock to simulate a successful publish
            mock_instance = mock_push_client.return_value
            mock_instance.publish.return_value = {'data': 'Some response data', 'status': 'ok'}

            # Call the function with test data
            send_push_notification('test-token', 'Test Title', 'Test body')

            # Check that publish was called with an instance of PushMessage having correct attributes
            mock_instance.publish.assert_called_once()
            called_args, _ = mock_instance.publish.call_args
            message_sent = called_args[0]
            assert message_sent.to == 'test-token'
            assert message_sent.title == 'Test Title'
            assert message_sent.body == 'Test body'

    def test_send_push_notification_failure(self):
        # Mock the PushClient to raise an exception
        with patch('Notifications.utils.PushClient', autospec=True) as mock_push_client, patch(
                'builtins.print') as mock_print:
            # Configure the mock to raise an exception when publish is called
            exception_message = "Failed to send message"
            mock_instance = mock_push_client.return_value
            mock_instance.publish.side_effect = Exception(exception_message)

            send_push_notification('test-token', 'Test Title', 'Test body')

            mock_print.assert_called()
            # Retrieve the actual call to print
            # This retrieves a tuple of the args passed to print
            print_call_args = mock_print.call_args[0]
            assert print_call_args[0] == "Error sending message:"
            assert isinstance(print_call_args[1], Exception)
            assert str(print_call_args[1]) == "Failed to send message"
