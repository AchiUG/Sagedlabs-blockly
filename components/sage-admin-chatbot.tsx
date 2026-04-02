

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Settings, BarChart3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SAGEAdminChatbotProps {
  applicationId?: string;
  className?: string;
}

export default function SAGEAdminChatbot({ 
  applicationId = '54ec2e28e',
  className = '' 
}: SAGEAdminChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const chatbotUrl = `https://apps.abacus.ai/chatllm/?appId=${applicationId}`;

  return (
    <>
      <Card className={`saged-card ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span>SAGE Admin Assistant</span>
          </CardTitle>
          <CardDescription>
            Your AI-powered administrative assistant. Get insights, manage operations, and automate workflows with intelligent support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <Settings className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Operations Management</p>
                  <p className="text-xs text-gray-600">Streamline admin tasks</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Analytics & Reports</p>
                  <p className="text-xs text-gray-600">Data-driven insights</p>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <Button 
              onClick={() => setIsOpen(true)}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-6"
              size="lg"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Launch Admin Assistant
            </Button>

            <p className="text-xs text-center text-gray-500">
              Opens in a full-screen view on your site
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Full-Screen Chatbot Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 gap-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-red-600 to-orange-600">
              <DialogTitle className="flex items-center space-x-2 text-white">
                <ShieldCheck className="w-6 h-6" />
                <span>SAGE Admin Assistant</span>
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chatbot Iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={chatbotUrl}
                className="w-full h-full border-0"
                title="SAGE Admin Assistant"
                allow="microphone; camera"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
