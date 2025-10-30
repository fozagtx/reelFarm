"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Twitter, Github, Mic } from "lucide-react";

// Dynamically import WorkflowCanvas to avoid SSR issues with React Flow
const WorkflowCanvas = dynamic(
  () => import("@/components/workflow/WorkflowCanvas"),
  { ssr: false }
);

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Logo */}
      <div className="fixed top-5 left-5 z-10">
        <a
          href="https://nodeops.network/"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="NodeOps Logo"
            width={240}
            height={60}
            className="w-60 h-15 object-contain"
          />
        </a>
      </div>

      {/* Header */}
      <div className="pt-20 pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold text-purple-800 mb-2 flex items-center justify-center gap-2">
                  <Mic className="w-6 h-6" />
                  AI Voice-Over Studio
                </h1>
                <p className="text-purple-700 text-sm">
                  Transform text into professional voiceovers using AI-powered speech synthesis
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Documentation Link */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300 transition-colors">
                  <CardContent className="p-4">
                    <a
                      href="https://docs.nodeops.network/Guides/Marketplace/Configure-Compute/public-docker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-700 hover:text-blue-900 transition-colors"
                    >
                      <ExternalLink className="w-6 h-6 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          NodeOps Docs
                        </span>
                      </div>
                    </a>
                  </CardContent>
                </Card>

                {/* YouTube Video */}
                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:border-red-300 transition-colors">
                  <CardContent className="p-4">
                    <a
                      href="https://www.youtube.com/watch?v=q6S_P3PDAzg&t=1s"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-red-700 hover:text-red-900 transition-colors"
                    >
                      <svg
                        className="w-6 h-6 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          Watch Tutorial
                        </span>
                      </div>
                    </a>
                  </CardContent>
                </Card>

                {/* Twitter */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:border-purple-300 transition-colors">
                  <CardContent className="p-4">
                    <a
                      href="https://x.com/BuildOnNodeOps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-purple-700 hover:text-purple-900 transition-colors"
                    >
                      <Twitter className="w-6 h-6 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          @BuildOnNodeOps
                        </span>
                      </div>
                    </a>
                  </CardContent>
                </Card>

                {/* Repository */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300 transition-colors">
                  <CardContent className="p-4">
                    <a
                      href="https://github.com/NodeOps-app/Nodeops-Template-Example-App"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-green-700 hover:text-green-900 transition-colors"
                    >
                      <Github className="w-6 h-6 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">
                          Source Code
                        </span>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="flex-1">
        <WorkflowCanvas />
      </div>
    </div>
  );
}
