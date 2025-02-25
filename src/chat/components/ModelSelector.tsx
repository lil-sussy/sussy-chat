"use client";

import { useState, useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import { Select, Tag, Space } from "antd";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

const models = [
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-2", label: "Claude 2" },
  { value: "palm-2", label: "PaLM 2" },
];

export function ModelSelector() {
  // Get the setSelectedModel from context but support multiple models
  const { setSelectedModel } = useChat();
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  // Update selected models and notify context
  const handleModelChange = (values: string[]) => {
    setSelectedModels(values);
    // If supporting multiple models in the future, pass the array
    // For now, use the first selected model or empty string
    setSelectedModel(values.length > 0 ? values[0]?? "" : "");
  };

  // Handle removing a tag
  const handleRemoveModel = (modelValue: string) => {
    const newSelectedModels = selectedModels.filter(value => value !== modelValue);
    setSelectedModels(newSelectedModels);
    setSelectedModel(newSelectedModels.length > 0 ? newSelectedModels[0]?? "" : "");
  };

  // Custom render for the tags
  const tagRender = (props: any) => {
    const { value, closable, onClose } = props;
    const model = models.find(m => m.value === value);
    
    return (
      <Tag
        color="blue"
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3, display: 'flex', alignItems: 'center' }}
      >
        {model?.label || value}
      </Tag>
    );
  };

  return (
    <div className="w-full">
      {/* Model dropdown with search */}
      <Select
        mode="multiple"
        className="min-w-full"
        placeholder="Select models..."
        value={selectedModels}
        onChange={handleModelChange}
        optionFilterProp="children"
        filterOption={(input, option) => 
          (option?.label?.toString().toLowerCase() || '').includes(input.toLowerCase())
        }
        options={models}
        maxTagCount={3}
        tagRender={tagRender}
        suffixIcon={<SearchOutlined />}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        showSearch
      />
      
      {/* Alternatively, show selected models as separate tags outside the Select */}
      {/* <Space wrap style={{ display: selectedModels.length ? 'flex' : 'none' }}>
        {selectedModels.map(modelValue => {
          const model = models.find(m => m.value === modelValue);
          return (
            <Tag 
              key={modelValue} 
              color="blue"
              closable
              onClose={() => handleRemoveModel(modelValue)}
            >
              {model?.label || modelValue}
            </Tag>
          );
        })}
      </Space> */}
    </div>
  );
}
