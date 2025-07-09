# 📡 API Documentation

This document describes the Bedrock Chat App API endpoints and usage.

## Base URL

```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/
```

Example:
```
https://abc123def.execute-api.us-east-1.amazonaws.com/prod/
```

## Authentication

No authentication required. The API is publicly accessible but rate-limited.

## Endpoints

### POST /chat

Send a message to the AI and receive a response.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "messages": [
    {
      "id": "string",
      "role": "user" | "assistant",
      "content": "string"
    }
  ],
  "modelId": "string"
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `messages` | Array | Yes | Array of conversation messages |
| `messages[].id` | String | Yes | Unique identifier for the message |
| `messages[].role` | String | Yes | Either "user" or "assistant" |
| `messages[].content` | String | Yes | The message content |
| `modelId` | String | Yes | Bedrock model identifier |

**Supported Models:**
- `anthropic.claude-3-haiku-20240307-v1:0` (recommended)
- `amazon.titan-text-lite-v1`
- `amazon.titan-text-express-v1`
- `amazon.nova-micro-v1:0`
- `amazon.nova-lite-v1:0`

#### Response

**Success (200):**
```json
{
  "response": "string",
  "modelId": "string"
}
```

**Error (400):**
```json
{
  "error": "string"
}
```

**Error (500):**
```json
{
  "error": "string"
}
```

#### Example Request

```bash
curl -X POST https://abc123def.execute-api.us-east-1.amazonaws.com/prod/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "id": "1",
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "modelId": "anthropic.claude-3-haiku-20240307-v1:0"
  }'
```

#### Example Response

```json
{
  "response": "Hello! I'm doing well, thank you for asking. I'm here and ready to help you with any questions or tasks you might have. How are you doing today?",
  "modelId": "anthropic.claude-3-haiku-20240307-v1:0"
}
```

### OPTIONS /chat

CORS preflight request handler.

#### Response

**Success (200):**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, OPTIONS
```

## Conversation Flow

The API maintains conversation context by sending the entire message history with each request:

```json
{
  "messages": [
    {
      "id": "1",
      "role": "user",
      "content": "My name is John"
    },
    {
      "id": "2",
      "role": "assistant",
      "content": "Nice to meet you, John! How can I help you today?"
    },
    {
      "id": "3",
      "role": "user",
      "content": "What's my name?"
    }
  ],
  "modelId": "anthropic.claude-3-haiku-20240307-v1:0"
}
```

## Error Handling

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request | Check request format and required fields |
| 403 | Forbidden | Verify Bedrock model permissions |
| 500 | Internal Server Error | Check CloudWatch logs for details |
| 502 | Bad Gateway | API Gateway configuration issue |
| 503 | Service Unavailable | Temporary service issue, retry |

### Error Response Format

All errors return a JSON object with an `error` field:

```json
{
  "error": "Descriptive error message"
}
```

## Rate Limits

- **Requests per second:** 10 (default API Gateway limit)
- **Concurrent executions:** 1000 (default Lambda limit)
- **Request timeout:** 30 seconds

## Best Practices

### Message Management

1. **Keep conversation history reasonable** - Don't send extremely long histories
2. **Use unique IDs** - Each message should have a unique identifier
3. **Alternate roles** - Messages must alternate between "user" and "assistant"

### Error Handling

```javascript
try {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.response;
} catch (error) {
  console.error('API Error:', error);
  // Handle error appropriately
}
```

### Retry Logic

```javascript
async function callApiWithRetry(payload, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await callApi(payload);
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

## Model-Specific Behavior

### Claude 3 Haiku

- **Strengths:** Fast responses, good conversation flow, context awareness
- **Context window:** Large (supports long conversations)
- **Response style:** Natural, conversational

### Amazon Titan

- **Strengths:** AWS native, cost-effective
- **Context window:** Moderate
- **Response style:** More formal, structured

### Amazon Nova

- **Strengths:** Latest AWS model, balanced performance
- **Context window:** Large
- **Response style:** Modern, versatile

## Monitoring

### CloudWatch Metrics

The API automatically publishes metrics to CloudWatch:

- **Invocations:** Number of API calls
- **Duration:** Response time
- **Errors:** Error count and rate
- **Throttles:** Rate limiting events

### Custom Logging

The Lambda function logs important events:

```
INFO: Request received with X messages
INFO: Using model: anthropic.claude-3-haiku-20240307-v1:0
ERROR: Bedrock API error: ValidationException
```

## Testing

### Unit Testing

```bash
# Test with minimal payload
curl -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"id":"1","role":"user","content":"test"}],"modelId":"anthropic.claude-3-haiku-20240307-v1:0"}'
```

### Load Testing

```bash
# Simple load test with Apache Bench
ab -n 100 -c 10 -p test-payload.json -T application/json $API_URL
```

### Integration Testing

```javascript
// Example Jest test
describe('Chat API', () => {
  test('should return response for valid message', async () => {
    const payload = {
      messages: [{ id: '1', role: 'user', content: 'Hello' }],
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0'
    };
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.response).toBeDefined();
    expect(typeof data.response).toBe('string');
  });
});
```

---

For more information, see the main [README.md](../README.md) or [Deployment Guide](DEPLOYMENT.md).
