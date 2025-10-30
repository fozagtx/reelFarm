# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ReelFarm - A node-based workflow tool for generating professional voiceovers from text using ElevenLabs AI. Built for the NodeOps Cloud Marketplace to help SaaS companies reduce UGC marketing costs by providing an affordable alternative to traditional voice-over services.

## Development Commands

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server at http://localhost:3000
npm run build        # Build production application
npm start            # Start production server
npm run lint         # Run Next.js linter
```

### Docker Development
```bash
docker build -t reelfarm .    # Build Docker image
docker run -p 8000:3000 reelfarm  # Run container (accessible at http://localhost:8000)
```

### Environment Setup
Create a `.env.local` file with:
```
ELEVENLABS_API_KEY=your_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
```
- Get ElevenLabs API key from https://elevenlabs.io/app/settings/api-keys
- Get Mistral API key from https://console.mistral.ai/

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **UI Library**: React Flow for node-based workflow canvas
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state
- **AI Services**:
  - ElevenLabs API for text-to-speech conversion
  - Mistral AI for ICP generation and offer crafting
- **AI SDK**: Vercel AI SDK for streaming chat responses
- **Storage**: Client-side localStorage for workflow persistence
- **Layout**: react-resizable-panels for resizable sidebar
- **Deployment**: Docker containerized with multi-stage builds

### Key Architecture Decisions

**1. Centralized Billing Model**
- ElevenLabs API key is stored server-side in environment variables
- Client calls backend API route at `/api/generate-voice` which proxies to ElevenLabs
- This allows you to control rate limiting, billing, and API usage
- Users don't need their own ElevenLabs accounts

**2. Node-Based Workflow**
- Uses React Flow library for visual workflow builder
- Three core node types:
  - **TextInputNode**: User enters script text (blue theme)
  - **VoiceGeneratorNode**: Triggers voice generation via API (purple theme)
  - **AudioOutputNode**: Plays and downloads generated audio (green theme)
- Nodes are connected with edges showing data flow

**3. Client-Side Persistence**
- Workflow state (nodes, edges, positions) saved to localStorage
- Audio data stored as base64 in node data
- No database required - fully client-side storage
- Persists across page reloads

**4. Server State Management**
- TanStack Query handles all API calls
- Mutations for voice generation (POST /api/generate-voice)
- Queries for fetching available voices (GET /api/generate-voice)
- Automatic caching and refetch logic

**5. AI Chatbot Sidebar**
- Resizable sidebar powered by react-resizable-panels
- Mistral AI chatbot for ICP (Ideal Customer Profile) generation
- Specialized tools for generating personas and crafting unique offers
- Floating button to open/close sidebar
- Can be collapsed or fully closed
- Integrates with main workflow without disrupting canvas interaction

### Application Structure

**Backend APIs**

*Voice Generation API* (app/api/generate-voice/route.ts)
- POST endpoint: Accepts text + voiceId, returns base64 audio
- GET endpoint: Returns available ElevenLabs voices
- Uses official @elevenlabs/elevenlabs-js SDK
- Streams audio and converts to base64 for client delivery

*Chatbot API* (app/api/primitives/chatbot/route.ts)
- POST endpoint: Handles AI chat conversations with streaming responses
- Uses Mistral AI via @ai-sdk/mistral provider
- Implements two specialized tools:
  - `generateICP`: Creates detailed Ideal Customer Profiles based on product info
  - `generateOffer`: Crafts compelling value propositions and offers
- Streams responses using Vercel AI SDK's streamText functionality
- Custom system prompt optimized for marketing strategy and customer research

**Frontend Components**
- **app/page.tsx**: Main page wrapped with ChatbotSidebar
- **components/workflow/ChatbotSidebar.tsx**: Resizable sidebar container
  - Manages sidebar open/close state
  - Integrates react-resizable-panels for resize functionality
  - Floating button with gradient styling
  - Info banner with usage tips
- **components/workflow/WorkflowCanvas.tsx**: React Flow canvas orchestrator
  - Manages node/edge state
  - Handles voice generation workflow
  - Implements audio playback/download
  - Auto-saves to localStorage
- **components/workflow/QueryProvider.tsx**: TanStack Query provider wrapper
- **components/nodes/**: Custom React Flow node implementations
  - Each node is a memoized component with Handle connectors
  - Data flows through node.data props
  - Callbacks injected for interactivity
- **components/primitives/chatbot.tsx**: AI chatbot UI component
  - Uses Vercel AI SDK's useChat hook
  - Markdown rendering for formatted responses
  - Message actions (copy, upvote, downvote)
  - Streaming response support
- **components/prompt-kit/**: Reusable chat UI primitives from prompt-kit
  - Chat container, messages, input, loader, markdown, code blocks

**State Management** (lib/hooks/useVoiceGeneration.ts)
- `useVoiceGeneration()`: Mutation hook for generating voices
- `useAvailableVoices()`: Query hook for fetching voice list
- Type-safe request/response interfaces

### Data Flow

**Voice Generation Workflow:**
1. User enters text in TextInputNode
2. Text stored in node.data via handleTextChange callback
3. User clicks "Generate Voice" in VoiceGeneratorNode
4. handleGenerate finds connected TextInputNode, extracts text
5. Calls backend API with text + voiceId via TanStack Query mutation
6. Backend calls ElevenLabs, returns base64 audio
7. VoiceGeneratorNode updates to "success" status
8. AudioOutputNode receives audio data via connected edge
9. User can play/pause or download MP3

**Chatbot ICP/Offer Generation Workflow:**
1. User clicks floating Sparkles button to open sidebar
2. Sidebar slides in from right with resizable panel
3. User describes their product/service in chat
4. Mistral AI analyzes input and asks clarifying questions
5. AI uses `generateICP` tool to create detailed persona
6. AI uses `generateOffer` tool to craft value propositions
7. Responses stream in real-time with markdown formatting
8. User can copy insights, resize sidebar, or close when done

### React Flow Integration

**Node Types Registration**
```typescript
const nodeTypes: NodeTypes = {
  textInput: TextInputNode,
  voiceGenerator: VoiceGeneratorNode,
  audioOutput: AudioOutputNode,
};
```

**Dynamic Import (SSR Avoidance)**
React Flow must be dynamically imported with `ssr: false` to avoid hydration issues.

**Callback Injection Pattern**
Callbacks are injected into node data before rendering:
```typescript
const nodesWithCallbacks = nodes.map((node) => ({
  ...node,
  data: { ...node.data, onChange: handleTextChange }
}));
```

### Docker Architecture
Multi-stage build (same as before):
1. **deps**: Install npm dependencies
2. **builder**: Build Next.js app
3. **runner**: Minimal production image with standalone output

### NodeOps Integration
- nodeops_template.yaml defines deployment configuration
- Port 3000 exposed for internet access
- Minimum resources: 200m CPU, 400MB memory
- Image pull policy: Always

## Important Notes

- **API Key Security**: Never commit `.env.local` file. Always use environment variables for both ElevenLabs and Mistral API keys.
- **Audio Storage**: Audio is stored as base64 in localStorage - not ideal for large volumes. Consider indexedDB for production.
- **Rate Limiting**: Both ElevenLabs and Mistral have rate limits. Implement backend rate limiting before production deployment.
- **Error Handling**: All API errors are caught and displayed appropriately (VoiceGeneratorNode status, chatbot error messages).
- **Browser Compatibility**: React Flow and resizable panels require modern browsers with ES6 support.
- **Mobile Support**: Current UI is desktop-optimized. Mobile gestures and sidebar may need adjustment for mobile devices.
- **Chatbot Context**: Chatbot conversations are not persisted. Refresh clears chat history.
- **AI Model**: Using Mistral Large for high-quality marketing insights. Can be changed to mistral-small for cost savings.

## Common Development Tasks

### Adding a New Node Type
1. Create node component in `components/nodes/[NodeName].tsx`
2. Define interface for node data
3. Add to nodeTypes in WorkflowCanvas
4. Implement node-specific logic and callbacks

### Modifying Voice Settings
Edit the voice_settings in `app/api/generate-voice/route.ts`:
```typescript
voice_settings: {
  stability: 0.5,          // 0-1, lower = more expressive
  similarity_boost: 0.75,  // 0-1, higher = closer to original voice
  style: 0.0,              // 0-1, style exaggeration
  use_speaker_boost: true, // Enhance clarity
}
```

### Adding Voice Selection UI
Use the `useAvailableVoices()` hook to fetch voices and create a dropdown in VoiceGeneratorNode.

### Customizing Chatbot System Prompt
Edit the `ICP_SYSTEM_PROMPT` constant in `app/api/primitives/chatbot/route.ts` to modify the AI's behavior, expertise, and tone.

### Adding New Chatbot Tools
Add new tools to the `tools` object in the chatbot route:
```typescript
tools: {
  generateICP: tool({ ... }),
  generateOffer: tool({ ... }),
  yourNewTool: tool({
    description: "What this tool does",
    inputSchema: z.object({ ... }),
    execute: async (params) => { ... }
  })
}
```

### Modifying Sidebar Behavior
Edit `components/workflow/ChatbotSidebar.tsx` to change:
- Default panel sizes (defaultSize, minSize, maxSize)
- Sidebar positioning (change Panel order for left sidebar)
- Styling and colors (gradient classes)
- Floating button position

## Testing Locally

**Voice Generation:**
1. Get ElevenLabs API key from https://elevenlabs.io
2. Add to `.env.local`
3. Run `npm run dev`
4. Enter text in blue node
5. Click "Generate Voice" in purple node
6. Play audio in green node

**ICP/Offer Generation:**
1. Get Mistral API key from https://console.mistral.ai/
2. Add to `.env.local`
3. Click sparkles button (bottom right)
4. Describe your product to the AI
5. Ask it to generate ICPs or offers
6. Copy insights or resize sidebar as needed
