"""
Custom exception handlers for the API.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error responses.
    
    Returns responses in the format:
    {
        "success": false,
        "message": "Error message",
        "errors": {...}
    }
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize the response data
        custom_response = {
            'success': False,
            'message': 'An error occurred',
            'errors': response.data
        }
        
        # Extract a more specific error message if available
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_response['message'] = response.data['detail']
            elif 'non_field_errors' in response.data:
                custom_response['message'] = response.data['non_field_errors'][0]
            else:
                # Get the first error message from the first field
                for field, messages in response.data.items():
                    if isinstance(messages, list) and len(messages) > 0:
                        custom_response['message'] = f"{field}: {messages[0]}"
                        break
        
        response.data = custom_response
    
    return response


class APIException(Exception):
    """
    Base exception class for custom API exceptions.
    """
    status_code = status.HTTP_400_BAD_REQUEST
    default_message = 'An error occurred'
    
    def __init__(self, message=None, status_code=None):
        self.message = message or self.default_message
        if status_code:
            self.status_code = status_code


class InsufficientStockError(APIException):
    """Exception raised when there's insufficient stock."""
    status_code = status.HTTP_409_CONFLICT
    default_message = 'Insufficient stock available'


class OutOfStockError(APIException):
    """Exception raised when product is out of stock."""
    status_code = status.HTTP_409_CONFLICT
    default_message = 'Product is out of stock'


class PaymentFailedError(APIException):
    """Exception raised when payment fails."""
    status_code = status.HTTP_402_PAYMENT_REQUIRED
    default_message = 'Payment failed'


class InvalidOperationError(APIException):
    """Exception raised for invalid business operations."""
    status_code = status.HTTP_400_BAD_REQUEST
    default_message = 'Invalid operation'
