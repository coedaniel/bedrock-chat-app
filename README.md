# Bedrock Chat App

Una aplicación de chat moderna construida con Next.js que utiliza Amazon Bedrock para conversaciones con IA.

## 🚀 Características

- **Múltiples modelos de IA**: Claude 3, Titan, Jurassic-2
- **Interfaz moderna**: Next.js 14 con App Router y Tailwind CSS
- **Estado persistente**: Zustand para manejo del estado global
- **Renderizado Markdown**: Soporte completo para markdown con react-markdown
- **Responsive**: Diseño adaptable para móviles y desktop
- **Despliegue en AWS**: Optimizado para AWS Amplify

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Estado**: Zustand
- **IA**: Amazon Bedrock (Claude, Titan, Jurassic)
- **Renderizado**: React Markdown + remark-gfm
- **Despliegue**: AWS Amplify

## 📦 Instalación

1. **Clonar e instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
```bash
cp .env.local.example .env.local
# Editar .env.local con tus credenciales AWS
```

3. **Ejecutar en desarrollo**:
```bash
npm run dev
```

## 🏗️ Despliegue en AWS

### 1. Crear el rol IAM

```bash
aws cloudformation create-stack \
  --stack-name bedrock-chat-iam \
  --template-body file://template.yaml \
  --capabilities CAPABILITY_NAMED_IAM
```

### 2. Desplegar en Amplify

1. Ir a AWS Amplify Console
2. Crear nueva aplicación
3. Subir el código (sin GitHub)
4. Configurar el rol IAM creado
5. Desplegar

## 🔧 Configuración

### Modelos disponibles:
- **Claude 3 Sonnet**: `anthropic.claude-3-sonnet-20240229-v1:0`
- **Claude 3 Haiku**: `anthropic.claude-3-haiku-20240307-v1:0`
- **Titan Text Lite**: `amazon.titan-text-lite-v1`
- **Titan Text Express**: `amazon.titan-text-express-v1`
- **Jurassic-2 Mid**: `ai21.j2-mid-v1`

### Variables de entorno:
- `AWS_REGION`: Región de AWS (default: us-east-1)
- `AWS_ACCESS_KEY_ID`: Access Key (solo desarrollo local)
- `AWS_SECRET_ACCESS_KEY`: Secret Key (solo desarrollo local)

## 📁 Estructura del proyecto

```
bedrock-chat-app/
├── app/
│   ├── api/chat/route.ts      # API Route para Bedrock
│   ├── chat/page.tsx          # Página principal del chat
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Redirect a /chat
│   └── globals.css            # Estilos globales
├── components/
│   ├── ChatBox.tsx            # Contenedor de mensajes
│   ├── InputBar.tsx           # Barra de entrada
│   ├── MessageBubble.tsx      # Burbuja de mensaje
│   └── ModelSelector.tsx      # Selector de modelos
├── lib/
│   └── bedrockClient.ts       # Cliente de Bedrock
├── store/
│   └── chatStore.ts           # Estado global con Zustand
├── template.yaml              # CloudFormation template
└── package.json
```

## 🎯 Funcionalidades

- ✅ Chat en tiempo real con múltiples modelos
- ✅ Historial de conversación persistente
- ✅ Renderizado de markdown y código
- ✅ Cambio dinámico de modelos
- ✅ Interfaz responsive
- ✅ Indicadores de carga
- ✅ Manejo de errores

## 🔒 Seguridad

- Rol IAM con permisos mínimos necesarios
- Credenciales manejadas por AWS en producción
- Validación de entrada en el backend
- Manejo seguro de errores

## 📝 Notas

- El historial se limpia al cambiar de modelo
- Soporte para múltiples líneas en el input (Shift+Enter)
- Auto-scroll a nuevos mensajes
- Optimizado para AWS Amplify hosting
