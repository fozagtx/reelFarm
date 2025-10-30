"use client";

import { memo, useCallback } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";

export interface TextInputNodeData {
  text: string;
  label?: string;
  onChange?: (id: string, text: string) => void;
}

function TextInputNode({ id, data }: NodeProps<TextInputNodeData>) {
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (data.onChange) {
        data.onChange(id, e.target.value);
      }
    },
    [id, data]
  );

  return (
    <Card className="min-w-[300px] shadow-lg border-2 border-blue-500">
      <CardHeader className="p-3 bg-gradient-to-r from-blue-50 to-blue-100">
        <CardTitle className="text-sm flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {data.label || "Text Input"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <textarea
          value={data.text}
          onChange={handleTextChange}
          placeholder="Enter your script here..."
          className="w-full min-h-[120px] p-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-2 text-xs text-gray-500">
          {data.text.length} characters
        </div>
      </CardContent>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
    </Card>
  );
}

export default memo(TextInputNode);
