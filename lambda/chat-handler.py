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
        # Handle CORS preflight requests
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': ''
            }

        # Parse the request body
        if 'body' in event and event['body']:
            body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({'error': 'No request body provided'})
            }

        messages = body.get('messages', [])
        model_id = body.get('modelId', 'anthropic.claude-3-haiku-20240307-v1:0')

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

        # Convert messages to Bedrock format and ensure alternating roles
        bedrock_messages = []
        last_role = None
        
        for msg in messages:
            current_role = msg['role']
            
            # Skip consecutive messages with the same role (except the first one)
            if last_role == current_role:
                # If we have consecutive user messages, combine them
                if current_role == 'user' and bedrock_messages:
                    bedrock_messages[-1]['content'] += f"\n\n{msg['content']}"
                    continue
                # If we have consecutive assistant messages, skip the previous one
                elif current_role == 'assistant' and bedrock_messages:
                    bedrock_messages[-1] = {
                        "role": current_role,
                        "content": msg['content']
                    }
                    continue
            
            bedrock_messages.append({
                "role": current_role,
                "content": msg['content']
            })
            last_role = current_role

        # Prepare the request for Bedrock
        if model_id.startswith('anthropic.claude'):
            # Claude format - send full conversation history
            request_body = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
                "messages": bedrock_messages
            }
        elif model_id.startswith('amazon.titan'):
            # Titan format - use last message only (Titan doesn't support conversation history)
            user_message = messages[-1]['content'] if messages else ""
            request_body = {
                "inputText": user_message,
                "textGenerationConfig": {
                    "maxTokenCount": 1000,
                    "temperature": 0.7,
                    "topP": 0.9
                }
            }
        else:
            # Default format - use last message only
            user_message = messages[-1]['content'] if messages else ""
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
