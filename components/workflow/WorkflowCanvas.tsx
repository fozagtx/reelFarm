"use client";

import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

import TextInputNode, {
  TextInputNodeData,
} from "@/components/nodes/TextInputNode";
import VoiceGeneratorNode, {
  VoiceGeneratorNodeData,
} from "@/components/nodes/VoiceGeneratorNode";
import AudioOutputNode, {
  AudioOutputNodeData,
} from "@/components/nodes/AudioOutputNode";
import { useVoiceGeneration } from "@/lib/hooks/useVoiceGeneration";

const nodeTypes: NodeTypes = {
  textInput: TextInputNode,
  voiceGenerator: VoiceGeneratorNode,
  audioOutput: AudioOutputNode,
};

const initialNodes: Node[] = [
  {
    id: "text-1",
    type: "textInput",
    position: { x: 100, y: 200 },
    data: { text: "", label: "Script Input" },
  },
  {
    id: "voice-1",
    type: "voiceGenerator",
    position: { x: 450, y: 200 },
    data: {
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      voiceName: "Rachel (Default)",
      status: "idle",
    },
  },
  {
    id: "output-1",
    type: "audioOutput",
    position: { x: 800, y: 200 },
    data: { isPlaying: false },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "text-1", target: "voice-1", animated: true },
  { id: "e2-3", source: "voice-1", target: "output-1", animated: true },
];

export default function WorkflowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { mutate: generateVoice, isPending } = useVoiceGeneration();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("workflow");
    if (saved) {
      try {
        const { nodes: savedNodes, edges: savedEdges } = JSON.parse(saved);
        setNodes(savedNodes);
        setEdges(savedEdges);
      } catch (error) {
        console.error("Failed to load workflow:", error);
      }
    }
  }, [setNodes, setEdges]);

  // Save to localStorage whenever nodes or edges change
  useEffect(() => {
    localStorage.setItem("workflow", JSON.stringify({ nodes, edges }));
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleTextChange = useCallback(
    (id: string, text: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: { ...node.data, text },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const handleGenerate = useCallback(
    (id: string) => {
      // Find the text input node connected to this voice generator
      const voiceNode = nodes.find((n) => n.id === id);
      const connectedEdge = edges.find((e) => e.target === id);
      const textNode = connectedEdge
        ? nodes.find((n) => n.id === connectedEdge.source)
        : null;

      if (!textNode || !(textNode.data as TextInputNodeData).text) {
        alert("Please enter text in the connected text input node");
        return;
      }

      const text = (textNode.data as TextInputNodeData).text;
      const voiceId = (voiceNode?.data as VoiceGeneratorNodeData).voiceId;

      // Update voice generator status to generating
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: { ...node.data, status: "generating" },
            };
          }
          return node;
        })
      );

      generateVoice(
        { text, voiceId },
        {
          onSuccess: (data) => {
            // Update voice generator status to success
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === id) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      status: "success",
                      audioData: data.audio,
                    },
                  };
                }
                // Update audio output node with the generated audio
                const connectedOutputEdge = edges.find((e) => e.source === id);
                if (
                  connectedOutputEdge &&
                  node.id === connectedOutputEdge.target
                ) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      audioData: data.audio,
                      isPlaying: false,
                    },
                  };
                }
                return node;
              })
            );
          },
          onError: (error) => {
            console.error("Voice generation error:", error);
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === id) {
                  return {
                    ...node,
                    data: { ...node.data, status: "error" },
                  };
                }
                return node;
              })
            );
          },
        }
      );
    },
    [nodes, edges, generateVoice, setNodes]
  );

  const handlePlayPause = useCallback(
    (id: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                isPlaying: !(node.data as AudioOutputNodeData).isPlaying,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const handleDownload = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id);
      if (!node) return;

      const audioData = (node.data as AudioOutputNodeData).audioData;
      if (!audioData) return;

      // Convert base64 to blob and download
      const byteCharacters = atob(audioData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "audio/mpeg" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `voiceover-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [nodes]
  );

  // Inject callbacks into node data
  const nodesWithCallbacks = nodes.map((node) => {
    if (node.type === "textInput") {
      return {
        ...node,
        data: { ...node.data, onChange: handleTextChange },
      };
    }
    if (node.type === "voiceGenerator") {
      return {
        ...node,
        data: { ...node.data, onGenerate: handleGenerate },
      };
    }
    if (node.type === "audioOutput") {
      return {
        ...node,
        data: {
          ...node.data,
          onPlayPause: handlePlayPause,
          onDownload: handleDownload,
        },
      };
    }
    return node;
  });

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodesWithCallbacks}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
