# AI Voice-Over Studio | NodeOps Template

A professional node-based workflow tool for generating AI voiceovers from text using ElevenLabs. Built for the NodeOps Cloud Marketplace to help SaaS companies reduce UGC marketing costs by providing an affordable alternative to traditional voice-over services.

## 🚀 Features

- **Visual Workflow Builder**: Drag-and-drop node-based interface powered by React Flow
- **AI Voice Generation**: High-quality text-to-speech using ElevenLabs API
- **Real-time Preview**: Play generated voiceovers instantly in the browser
- **Export Capability**: Download voiceovers as MP3 files
- **Persistent Workflows**: Auto-save workflows to localStorage
- **Centralized Billing**: Server-side API key management (users don't need ElevenLabs accounts)
- **Modern UI**: Responsive design with Tailwind CSS and Radix UI
- **Docker Ready**: Containerized for easy deployment on NodeOps

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Framework**: React Flow, Tailwind CSS, Radix UI
- **State Management**: TanStack Query (React Query)
- **AI Service**: ElevenLabs Text-to-Speech API
- **Storage**: Client-side localStorage
- **Containerization**: Docker multi-stage builds

## 📦 Installation

### Prerequisites
- Node.js 24+
- npm
- Docker (optional)
- ElevenLabs API Key ([Get one here](https://elevenlabs.io/app/settings/api-keys))

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   ELEVENLABS_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build the Docker image**
   ```bash
   docker build -t ai-voiceover-studio .
   ```

2. **Run the container**
   ```bash
   docker run -p 8000:3000 -e ELEVENLABS_API_KEY=your_key_here ai-voiceover-studio
   ```

3. **Access the application**
   Navigate to [http://localhost:8000](http://localhost:8000)

## 🎯 How It Works

### Workflow Nodes

1. **Text Input Node (Blue)**
   - Enter your script or text content
   - Character counter included
   - Connects to Voice Generator

2. **Voice Generator Node (Purple)**
   - Select voice profile
   - Click "Generate Voice" to create audio
   - Shows generation status (idle/generating/success/error)
   - Uses your ElevenLabs API via backend proxy

3. **Audio Output Node (Green)**
   - Preview generated audio
   - Play/pause controls
   - Download as MP3

### Data Flow

```
User Input → Text Node → Voice Generator → ElevenLabs API → Audio Output → Download
```

## 🔧 Configuration

### Voice Settings

Customize voice parameters in `app/api/generate-voice/route.ts`:

```typescript
voiceSettings: {
  stability: 0.5,          // 0-1, lower = more expressive
  similarityBoost: 0.75,   // 0-1, higher = closer to voice
  style: 0.0,              // 0-1, style exaggeration
  useSpeakerBoost: true,   // Enhance clarity
}
```

### Available Voices

Default voice: Rachel (`21m00Tcm4TlvDq8ikWAM`)

To fetch all available voices, the app includes a GET endpoint at `/api/generate-voice` that returns the full voice library from your ElevenLabs account.

## 🚀 NodeOps Deployment

This template is ready for deployment on the NodeOps Cloud Marketplace:

1. **Prepare your Docker image**
   ```bash
   docker build -t your-dockerhub/ai-voiceover-studio .
   docker push your-dockerhub/ai-voiceover-studio
   ```

2. **Update `nodeops_template.yaml`**
   - Change the image name to your Docker Hub image
   - Adjust resource allocations as needed

3. **Submit to NodeOps Marketplace**
   - Follow the [Docker Guide](https://docs.nodeops.network/Guides/Marketplace/Configure-Compute/public-docker)
   - Configure environment variables in NodeOps dashboard
   - Set your ElevenLabs API key as a secret

4. **Start earning revenue share**
   - Users deploy your template
   - You earn from each deployment

## 📚 Project Structure

```
.
├── app/
│   ├── api/generate-voice/       # ElevenLabs API proxy
│   │   └── route.ts               # POST: generate, GET: list voices
│   ├── layout.tsx                 # Root layout with QueryProvider
│   ├── page.tsx                   # Main page with workflow canvas
│   └── globals.css                # Global styles
├── components/
│   ├── nodes/                     # React Flow custom nodes
│   │   ├── TextInputNode.tsx      # Text input node (blue)
│   │   ├── VoiceGeneratorNode.tsx # Voice generation node (purple)
│   │   └── AudioOutputNode.tsx    # Audio playback node (green)
│   ├── workflow/
│   │   ├── WorkflowCanvas.tsx     # Main React Flow canvas
│   │   └── QueryProvider.tsx      # TanStack Query provider
│   └── ui/                        # Radix UI components
├── lib/
│   └── hooks/
│       └── useVoiceGeneration.ts  # TanStack Query hooks
├── Dockerfile                     # Multi-stage Docker build
├── nodeops_template.yaml          # NodeOps deployment config
└── CLAUDE.md                      # AI assistant documentation
```

## 🎨 Customization

### Adding New Node Types

1. Create a new component in `components/nodes/`
2. Define the node data interface
3. Register in `WorkflowCanvas.tsx` nodeTypes
4. Implement node logic and callbacks

### Extending Workflow

- Add voice profile selection dropdown
- Implement batch processing
- Add audio effects/filters
- Support multiple languages
- Create template library

## 📊 API Endpoints

### POST `/api/generate-voice`
Generate voice from text

**Request:**
```json
{
  "text": "Your script here",
  "voiceId": "21m00Tcm4TlvDq8ikWAM"
}
```

**Response:**
```json
{
  "success": true,
  "audio": "base64_encoded_audio",
  "voiceId": "21m00Tcm4TlvDq8ikWAM"
}
```

### GET `/api/generate-voice`
List available voices

**Response:**
```json
{
  "success": true,
  "voices": [
    {
      "id": "voice_id",
      "name": "Voice Name",
      "category": "premade",
      "description": "Voice description"
    }
  ]
}
```

## 🔐 Security Notes

- Never commit `.env.local` to version control
- Use environment variables for API keys
- Implement rate limiting in production
- Consider adding authentication for users
- Monitor ElevenLabs API usage and costs

## 📈 Cost Optimization

This tool helps SaaS companies save on UGC marketing by:

- **No voice actor fees**: AI-generated voices at fraction of cost
- **Instant turnaround**: Generate voiceovers in seconds
- **Unlimited revisions**: Edit and regenerate without extra cost
- **Scalable**: Process multiple scripts simultaneously
- **Consistent quality**: Same voice quality every time

## 🤝 Contributing

This is a template project for the NodeOps marketplace. Feel free to fork and customize for your use case!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Support & Resources

- [NodeOps Documentation](https://docs.nodeops.network)
- [NodeOps Twitter](https://x.com/BuildOnNodeOps)
- [ElevenLabs API Docs](https://elevenlabs.io/docs)
- [React Flow Documentation](https://reactflow.dev)

## 🎬 Getting Started Video

Watch our tutorial on deploying templates to NodeOps:
[YouTube Tutorial](https://www.youtube.com/watch?v=q6S_P3PDAzg&t=1s)

---

Built with ❤️ for the NodeOps ecosystem
