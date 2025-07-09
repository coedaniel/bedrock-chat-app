import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { NextResponse } from 'next/server';

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Using Nova Pro 1.0 - good balance of capability and cost
    const modelId = 'amazon.nova-pro-v1:0';
    
    const payload = {
      messages: [
        {
          role: "user",
          content: [
            {
              text: message
            }
          ]
        }
      ],
      inferenceConfig: {
        max_new_tokens: 1000,
        temperature: 0.7
      }
    };

    const command = new InvokeModelWithResponseStreamCommand({
      modelId,
      body: JSON.stringify(payload),
      contentType: 'application/json',
    });

    const response = await client.send(command);
    
    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response.body) {
            if (chunk.chunk?.bytes) {
              const chunkData = JSON.parse(new TextDecoder().decode(chunk.chunk.bytes));
              
              if (chunkData.contentBlockDelta?.delta?.text) {
                const text = chunkData.contentBlockDelta.delta.text;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
              
              if (chunkData.messageStop) {
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                controller.close();
                return;
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
