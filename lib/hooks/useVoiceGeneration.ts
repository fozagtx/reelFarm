import { useMutation, useQuery } from "@tanstack/react-query";

export interface Voice {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface GenerateVoiceRequest {
  text: string;
  voiceId?: string;
}

export interface GenerateVoiceResponse {
  success: boolean;
  audio: string;
  voiceId: string;
}

export function useVoiceGeneration() {
  return useMutation<GenerateVoiceResponse, Error, GenerateVoiceRequest>({
    mutationFn: async ({ text, voiceId }) => {
      const response = await fetch("/api/generate-voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voiceId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate voice");
      }

      return response.json();
    },
  });
}

export function useAvailableVoices() {
  return useQuery<{ voices: Voice[] }>({
    queryKey: ["voices"],
    queryFn: async () => {
      const response = await fetch("/api/generate-voice");
      if (!response.ok) {
        throw new Error("Failed to fetch voices");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}
