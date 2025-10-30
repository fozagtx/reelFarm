# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Voice-Over Studio - A node-based workflow tool for generating professional voiceovers from text using ElevenLabs AI. Built for the NodeOps Cloud Marketplace to help SaaS companies reduce UGC marketing costs by providing an affordable alternative to traditional voice-over services.

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
docker build -t ai-voiceover-studio .    # Build Docker image
docker run -p 8000:3000 ai-voiceover-studio  # Run container (accessible at http://localhost:8000)
```

### Environment Setup
Create a `.env.local` file with:
```
ELEVENLABS_API_KEY=your_api_key_here
```
Get your API key from https://elevenlabs.io/app/settings/api-keys

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **UI Library**: React Flow for node-based workflow canvas
- **Styling**: Tailwind CSS with Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state
- **AI Service**: ElevenLabs API for text-to-speech conversion
- **Storage**: Client-side localStorage for workflow persistence
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

### Application Structure

**Backend API** (app/api/generate-voice/route.ts)
- POST endpoint: Accepts text + voiceId, returns base64 audio
- GET endpoint: Returns available ElevenLabs voices
- Uses official @elevenlabs/elevenlabs-js SDK
- Streams audio and converts to base64 for client delivery

**Frontend Components**
- **app/page.tsx**: Main page with header and workflow canvas
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

**State Management** (lib/hooks/useVoiceGeneration.ts)
- `useVoiceGeneration()`: Mutation hook for generating voices
- `useAvailableVoices()`: Query hook for fetching voice list
- Type-safe request/response interfaces

### Data Flow

1. User enters text in TextInputNode
2. Text stored in node.data via handleTextChange callback
3. User clicks "Generate Voice" in VoiceGeneratorNode
4. handleGenerate finds connected TextInputNode, extracts text
5. Calls backend API with text + voiceId via TanStack Query mutation
6. Backend calls ElevenLabs, returns base64 audio
7. VoiceGeneratorNode updates to "success" status
8. AudioOutputNode receives audio data via connected edge
9. User can play/pause or download MP3

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

- **API Key Security**: Never commit `.env.local` file. Always use environment variables.
- **Audio Storage**: Audio is stored as base64 in localStorage - not ideal for large volumes. Consider indexedDB for production.
- **Rate Limiting**: ElevenLabs has rate limits. Implement backend rate limiting before production deployment.
- **Error Handling**: All API errors are caught and displayed in VoiceGeneratorNode status.
- **Browser Compatibility**: React Flow requires modern browsers with ES6 support.
- **Mobile Support**: Current UI is desktop-optimized. Mobile gestures may need adjustment.

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

## Testing Locally
1. Get ElevenLabs API key from https://elevenlabs.io
2. Create `.env.local` with your key
3. Run `npm run dev`
4. Enter text in blue node
5. Click "Generate Voice" in purple node
6. Play audio in green node
