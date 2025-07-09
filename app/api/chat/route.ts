import { NextResponse } from 'next/server'
import { bedrockClient } from '@/lib/bedrockClient'
import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'

export async function POST(req: Request) {
  try {
    const { messages, modelId } = await req.json()

    // Preparar el cuerpo de la solicitud según el modelo
    let body: any
    let contentType = 'application/json'

    if (modelId.includes('anthropic.claude')) {
      // Formato para Claude
      body = {
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2000,
        temperature: 0.7
      }
    } else if (modelId.includes('amazon.titan')) {
      // Formato para Titan
      const prompt = messages.map((msg: any) => 
        `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
      ).join('\n\n') + '\n\nAssistant:'

      body = {
        inputText: prompt,
        textGenerationConfig: {
          maxTokenCount: 2000,
          temperature: 0.7,
          topP: 0.9
        }
      }
    } else if (modelId.includes('ai21.j2')) {
      // Formato para Jurassic
      const prompt = messages.map((msg: any) => 
        `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
      ).join('\n\n') + '\n\nAssistant:'

      body = {
        prompt,
        maxTokens: 2000,
        temperature: 0.7,
        topP: 0.9
      }
    }

    const input = {
      modelId,
      contentType,
      accept: 'application/json',
      body: JSON.stringify(body)
    }

    const command = new InvokeModelCommand(input)
    const response = await bedrockClient.send(command)
    
    if (!response.body) {
      throw new Error('No response body received from Bedrock')
    }

    const rawResponse = await response.body.transformToString()
    const jsonResponse = JSON.parse(rawResponse)

    // Extraer la respuesta según el modelo
    let content: string

    if (modelId.includes('anthropic.claude')) {
      content = jsonResponse.content?.[0]?.text || jsonResponse.completion || 'Error: No content received'
    } else if (modelId.includes('amazon.titan')) {
      content = jsonResponse.results?.[0]?.outputText || 'Error: No content received'
    } else if (modelId.includes('ai21.j2')) {
      content = jsonResponse.completions?.[0]?.data?.text || 'Error: No content received'
    } else {
      content = 'Error: Unsupported model'
    }

    return NextResponse.json({ response: content })

  } catch (error) {
    console.error('Error in chat API:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get response from Bedrock',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
