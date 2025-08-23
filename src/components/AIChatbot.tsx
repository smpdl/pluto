import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MessageCircle, X, Send, Mic, MicOff, Volume2, Type } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'voice';
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI financial assistant. I can help you analyze your spending, suggest savings strategies, and answer questions about your finances. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (content: string, type: 'text' | 'voice' = 'text') => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(content),
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userMessage: string): string => {
    const responses = [
      "Based on your spending patterns, I notice you're doing great with your dining budget this month! You've saved $127 compared to last month.",
      "I'd recommend increasing your emergency fund contribution by $50/month to reach your 6-month goal faster.",
      "Your investment portfolio is performing well with an 8.4% gain this quarter. Consider rebalancing your stock allocation.",
      "I see some opportunities to optimize your subscriptions. You could save $23/month by canceling unused services.",
      "Your savings rate is excellent at 23%! You're on track to reach your vacation fund goal by June.",
      "Let me analyze your recent transactions and identify potential areas for savings..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate voice transcription
      setTimeout(() => {
        sendMessage("How can I reduce my monthly expenses?", 'voice');
      }, 500);
    } else {
      setIsRecording(true);
      // Start recording simulation
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(message);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[600px] shadow-xl border-0 bg-card/95 backdrop-blur">
        {/* Header */}
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm">Pluto AI Assistant</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <CardDescription className="text-xs">Online</CardDescription>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
                className="h-8 w-8 p-0"
              >
                {inputMode === 'text' ? <Mic className="h-4 w-4" /> : <Type className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-4 overflow-y-auto max-h-[480px]">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {msg.type === 'voice' && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Volume2 className="h-3 w-3" />
                        <Badge variant="secondary" className="text-xs">Voice</Badge>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          {inputMode === 'text' ? (
            <div className="flex items-center space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-input-background"
              />
              <Button
                onClick={() => sendMessage(message)}
                disabled={!message.trim()}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Button
                onClick={handleVoiceRecording}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className={`rounded-full h-12 w-12 ${
                  isRecording 
                    ? 'bg-destructive hover:bg-destructive/90 animate-pulse' 
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>
            </div>
          )}

          {isRecording && (
            <div className="mt-3 flex items-center justify-center space-x-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-destructive rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 20 + 10}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-2">Recording...</span>
            </div>
          )}

          <div className="mt-2 flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
              Switch to {inputMode === 'text' ? 'voice' : 'text'} mode above
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}