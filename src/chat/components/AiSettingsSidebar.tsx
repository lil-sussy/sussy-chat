"use client";

import { useState } from "react";
import { Input } from "@/chat/components/ui/input";
import { Button } from "@/chat/components/ui/button";
import { Label } from "@/chat/components/ui/label";
import { Slider } from "@/chat/components/ui/slider";
import { ScrollArea } from "@/chat/components/ui/scroll-area";
import { useChat } from "../contexts/ChatContext";

const systemPrompts = [
  { id: "1", name: "Default", prompt: "You are a helpful assistant." },
  {
    id: "2",
    name: "Programmer",
    prompt:
      "You are an expert programmer. Provide detailed code explanations and examples.",
  },
  {
    id: "3",
    name: "Creative Writer",
    prompt:
      "You are a creative writer. Generate imaginative and engaging stories.",
  },
  {
    id: "4",
    name: "Data Analyst",
    prompt:
      "You are a data analyst. Provide insights and interpretations of data.",
  },
  {
    id: "5",
    name: "Language Tutor",
    prompt:
      "You are a language tutor. Help with grammar, vocabulary, and language learning.",
  },
];


export function AISettingsSidebar() {
  const { setSystemPrompt, temperature, setTemperature, maxTokens, setMaxTokens } = useChat();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrompts = systemPrompts.filter((prompt) =>
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-screen w-64 flex-col border-l border-gray-200 p-4">
      <h2 className="mb-4 text-lg font-semibold text-primary">AI Settings</h2>

      <Label htmlFor="prompt-search" className="my-2 text-primary">
        Search System Prompts
      </Label>
      <Input
        id="prompt-search"
        placeholder="Search prompts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <ScrollArea className="mb-4 flex-1">
        {filteredPrompts.map((prompt) => (
          <Button
            key={prompt.id}
            variant="ghost"
            className="mb-2 w-full justify-start text-left text-primary"
            onClick={() => setSystemPrompt(prompt.prompt)}
          >
            {prompt.name}
          </Button>
        ))}
      </ScrollArea>

      <div className="space-y-4">
        <div>
          <Label htmlFor="temperature" className="text-primary">Temperature: {temperature}</Label>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.1}
            value={[temperature]}
            onValueChange={(value: number[]) => {
              setTemperature(value[0] ?? 0);
            }}
          />
        </div>

        <div>
          <Label htmlFor="max-tokens" className="text-primary">Max Tokens: {maxTokens}</Label>
          <Slider
            id="max-tokens"
            min={50}
            max={10000}
            step={10}
            value={[maxTokens]}
            onValueChange={(value: number[]) => {
              setMaxTokens(value[0] ?? 0);
            }}
          />
        </div>
      </div>
    </div>
  );
}
