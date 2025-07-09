import json
import boto3
import logging
from typing import Dict, Any

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Initialize Bedrock client
bedrock_runtime = boto3.client('bedrock-runtime', region_name='us-east-1')

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda handler for Bedrock chat functionality
    """
    try:
        # Parse the request body
        if 'body' in event:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            body = event
        
        messages = body.get('messages', [])
        model_id = body.get('modelId', 'anthropic.claude-3-sonnet-20240229-v1:0')
        
        if not messages:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({'error': 'No messages provided'})
            }
        
        # Get the last user message
        user_message = messages[-1]['content'] if messages else ""
        
        # Prepare the request for Bedrock
        if model_id.startswith('anthropic.claude'):
            # Claude format
            request_body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "messages": [
                    {
                        "role": "user",
                        "content": user_message
                    }
                ]
            }
        elif model_id.startswith('amazon.titan'):
            # Titan format
            request_body = {
                "inputText": user_message,
                "textGenerationConfig": {
                    "maxTokenCount": 1000,
                    "temperature": 0.7,
                    "topP": 0.9
                }
            }
        else:
            # Default format
            request_body = {
                "inputText": user_message,
                "textGenerationConfig": {
                    "maxTokenCount": 1000,
                    "temperature": 0.7
                }
            }
        
        # Call Bedrock
        response = bedrock_runtime.invoke_model(
            modelId=model_id,
            body=json.dumps(request_body),
            contentType='application/json'
        )
        
        # Parse the response
        response_body = json.loads(response['body'].read())
        
        # Extract the generated text based on model type
        if model_id.startswith('anthropic.claude'):
            generated_text = response_body['content'][0]['text']
        elif model_id.startswith('amazon.titan'):
            generated_text = response_body['results'][0]['outputText']
        else:
            generated_text = response_body.get('outputText', 'No response generated')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'response': generated_text,
                'modelId': model_id
            })
        }
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'error': f'Internal server error: {str(e)}'
            })
        }

def options_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Handle CORS preflight requests
    """
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'POST, OPTIONS'
        },
        'body': ''
    }
