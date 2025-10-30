import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

// Initialize ElevenLabs client with API key from environment
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId = "21m00Tcm4TlvDq8ikWAM" } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    // Generate voice using ElevenLabs
    const audio = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      modelId: "eleven_multilingual_v2",
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.0,
        useSpeakerBoost: true,
      },
    });

    // Convert audio stream to buffer
    const chunks: Uint8Array[] = [];
    const reader = audio.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }

    const audioBuffer = Buffer.concat(chunks);

    // Return audio as base64 for easy client-side handling
    return NextResponse.json({
      success: true,
      audio: audioBuffer.toString("base64"),
      voiceId,
    });
  } catch (error: any) {
    console.error("ElevenLabs API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate voice" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch available voices
export async function GET() {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return NextResponse.json(
        { error: "ElevenLabs API key not configured" },
        { status: 500 }
      );
    }

    const voices = await elevenlabs.voices.getAll();

    return NextResponse.json({
      success: true,
      voices: voices.voices.map((voice) => ({
        id: voice.voiceId,
        name: voice.name,
        category: voice.category,
        description: voice.description,
      })),
    });
  } catch (error: any) {
    console.error("ElevenLabs API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch voices" },
      { status: 500 }
    );
  }
}
