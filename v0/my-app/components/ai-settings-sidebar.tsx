"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"

const systemPrompts = [
  { id: "1", name: "Default", prompt: "You are a helpful assistant." },
  {
    id: "2",
    name: "Programmer",
    prompt: "You are an expert programmer. Provide detailed code explanations and examples.",
  },
  { id: "3", name: "Creative Writer", prompt: "You are a creative writer. Generate imaginative and engaging stories." },
  { id: "4", name: "Data Analyst", prompt: "You are a data analyst. Provide insights and interpretations of data." },
  {
    id: "5",
    name: "Language Tutor",
    prompt: "You are a language tutor. Help with grammar, vocabulary, and language learning.",
  },
]

type AISettingsProps = {
  onSystemPromptChange: (prompt: string) => void
  onTemperatureChange: (temp: number) => void
  onMaxTokensChange: (tokens: number) => void
}

export function AISettingsSidebar({ onSystemPromptChange, onTemperatureChange, onMaxTokensChange }: AISettingsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(150)

  const filteredPrompts = systemPrompts.filter((prompt) => prompt.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="w-64 border-l border-gray-200 h-screen flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">AI Settings</h2>

      <Label htmlFor="prompt-search">Search System Prompts</Label>
      <Input
        id="prompt-search"
        placeholder="Search prompts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <ScrollArea className="flex-1 mb-4">
        {filteredPrompts.map((prompt) => (
          <Button
            key={prompt.id}
            variant="ghost"
            className="w-full justify-start text-left mb-2"
            onClick={() => onSystemPromptChange(prompt.prompt)}
          >
            {prompt.name}
          </Button>
        ))}
      </ScrollArea>

      <div className="space-y-4">
        <div>
          <Label htmlFor="temperature">Temperature: {temperature}</Label>
          <Slider
            id="temperature"
            min={0}
            max={1}
            step={0.1}
            value={[temperature]}
            onValueChange={(value) => {
              setTemperature(value[0])
              onTemperatureChange(value[0])
            }}
          />
        </div>

        <div>
          <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
          <Slider
            id="max-tokens"
            min={50}
            max={500}
            step={10}
            value={[maxTokens]}
            onValueChange={(value) => {
              setMaxTokens(value[0])
              onMaxTokensChange(value[0])
            }}
          />
        </div>
      </div>
    </div>
  )
}

