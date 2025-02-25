import { Button, Input, Slider, Typography, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useChat } from "../../contexts/ChatContext";
import { useState } from "react";

const { Title, Text } = Typography;

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

const AiSettingsContent = () => {
  const {
    setSystemPrompt,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
  } = useChat();
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const filteredPrompts = systemPrompts.filter((prompt) =>
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col">
      <Title level={4} className="mb-4 text-primary">
        AI Settings
      </Title>

      <Text strong className="mb-2 text-primary">
        Search System Prompts
      </Text>
      <Input
        placeholder="Search prompts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        prefix={<SearchOutlined />}
      />

      <div className="mb-4 flex-1 overflow-auto">
        {filteredPrompts.map((prompt) => (
          <Button
            key={prompt.id}
            type="text"
            className="mb-2 w-full justify-start text-left text-primary hover:bg-gray-100"
            onClick={() => {
              setSystemPrompt(prompt.prompt);
              if (isMobile) setDrawerVisible(false);
            }}
          >
            {prompt.name}
          </Button>
        ))}
      </div>

      <Space direction="vertical" className="mt-auto w-full">
        <div>
          <Text strong className="mb-2 block text-primary">
            Temperature: {temperature}
          </Text>
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={temperature}
            onChange={(value) => setTemperature(value)}
            className="mb-4"
          />
        </div>

        <div>
          <Text strong className="mb-2 block text-primary">
            Max Tokens: {maxTokens}
          </Text>
          <Slider
            min={50}
            max={10000}
            step={10}
            value={maxTokens}
            onChange={(value) => setMaxTokens(value)}
          />
        </div>
      </Space>
    </div>
  );
};

export default AiSettingsContent;
