"use client";

import { memo, useRef, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Volume2 } from "lucide-react";

export interface AudioOutputNodeData {
  audioData?: string;
  isPlaying?: boolean;
  onPlayPause?: (id: string) => void;
  onDownload?: (id: string) => void;
}

function AudioOutputNode({ id, data }: NodeProps<AudioOutputNodeData>) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && data.audioData) {
      // Convert base64 to blob URL
      const audioBlob = base64ToBlob(data.audioData, "audio/mpeg");
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;

      return () => URL.revokeObjectURL(audioUrl);
    }
  }, [data.audioData]);

  useEffect(() => {
    if (audioRef.current) {
      if (data.isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [data.isPlaying]);

  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  return (
    <Card className="min-w-[280px] shadow-lg border-2 border-green-500">
      <CardHeader className="p-3 bg-gradient-to-r from-green-50 to-green-100">
        <CardTitle className="text-sm flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          Audio Output
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        {data.audioData ? (
          <>
            <audio
              ref={audioRef}
              onEnded={() => data.onPlayPause?.(id)}
              className="hidden"
            />

            <div className="flex gap-2">
              <Button
                onClick={() => data.onPlayPause?.(id)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                {data.isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Play
                  </>
                )}
              </Button>

              <Button
                onClick={() => data.onDownload?.(id)}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Audio ready for playback
            </div>
          </>
        ) : (
          <div className="text-xs text-gray-400 text-center py-4">
            No audio generated yet
          </div>
        )}
      </CardContent>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500"
      />
    </Card>
  );
}

export default memo(AudioOutputNode);
