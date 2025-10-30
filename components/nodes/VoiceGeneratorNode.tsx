"use client";

import { memo, useState } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export interface VoiceGeneratorNodeData {
  voiceId?: string;
  voiceName?: string;
  status?: "idle" | "generating" | "success" | "error";
  audioData?: string;
  onGenerate?: (id: string) => void;
}

function VoiceGeneratorNode({ id, data }: NodeProps<VoiceGeneratorNodeData>) {
  const getStatusIcon = () => {
    switch (data.status) {
      case "generating":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Mic className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case "generating":
        return "border-yellow-500 from-yellow-50 to-yellow-100";
      case "success":
        return "border-green-500 from-green-50 to-green-100";
      case "error":
        return "border-red-500 from-red-50 to-red-100";
      default:
        return "border-purple-500 from-purple-50 to-purple-100";
    }
  };

  return (
    <Card className={`min-w-[280px] shadow-lg border-2 ${getStatusColor()}`}>
      <CardHeader className={`p-3 bg-gradient-to-r ${getStatusColor()}`}>
        <CardTitle className="text-sm flex items-center gap-2">
          {getStatusIcon()}
          Voice Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">
            Selected Voice
          </label>
          <div className="text-sm font-semibold text-purple-700">
            {data.voiceName || "Default Voice"}
          </div>
          <div className="text-xs text-gray-500">ID: {data.voiceId || "21m00Tcm4TlvDq8ikWAM"}</div>
        </div>

        <Button
          onClick={() => data.onGenerate?.(id)}
          disabled={data.status === "generating"}
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="sm"
        >
          {data.status === "generating" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Generate Voice
            </>
          )}
        </Button>

        {data.status === "success" && (
          <div className="text-xs text-green-600 font-medium">
            ✓ Voice generated successfully
          </div>
        )}

        {data.status === "error" && (
          <div className="text-xs text-red-600 font-medium">
            ✗ Failed to generate voice
          </div>
        )}
      </CardContent>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500"
      />
    </Card>
  );
}

export default memo(VoiceGeneratorNode);
