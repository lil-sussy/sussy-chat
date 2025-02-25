import React from 'react';
import { Button, Typography, Space, Divider } from 'antd';
import { RocketOutlined, RobotOutlined, FileTextOutlined, SettingOutlined, ThunderboltOutlined, KeyOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';

const { Title, Paragraph, Text } = Typography;

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex items-start mb-4">
    <div className="text-primary text-xl mr-3 mt-1">{icon}</div>
    <div>
      <Text strong className="text-base">{title}</Text>
      <Paragraph className="text-sm text-gray-600 mt-1">{description}</Paragraph>
    </div>
  </div>
);

const LoginCard: React.FC = () => {
  return (
    <div className="w-full max-w-xl bg-white/75 backdrop-blur-md rounded-xl shadow-lg p-8 mx-auto">
      <div className="text-center mb-6">
        <Title level={2} className="text-primary mb-2">Welcome to Sussy Chat</Title>
        <Paragraph className="text-gray-600">
          The next generation chat platform for AI enthusiasts
        </Paragraph>
      </div>

      <Divider />

      <div className="mb-6">
        <Space direction="vertical" size="middle" className="w-full">
          <FeatureItem 
            icon={<ThunderboltOutlined />} 
            title="Rapid and Fast Chat App" 
            description="Experience lightning-fast responses with our optimized chat interface."
          />
          
          <FeatureItem 
            icon={<RobotOutlined />} 
            title="Every LLM Supported" 
            description="Connect with all major language models in one unified platform."
          />
          
          <FeatureItem 
            icon={<FileTextOutlined />} 
            title="Obsidian Note Integration" 
            description="Seamlessly sync your conversations with Obsidian for better knowledge management."
          />
          
          <FeatureItem 
            icon={<SettingOutlined />} 
            title="System Prompt Customization" 
            description="Fine-tune AI behavior with custom system prompts for your specific needs."
          />
          
          <FeatureItem 
            icon={<RocketOutlined />} 
            title="All You Need" 
            description="A complete solution with all the features power users demand."
          />
          
          <FeatureItem 
            icon={<KeyOutlined />} 
            title="Shortcuts to Go Fast" 
            description="Boost your productivity with intuitive keyboard shortcuts."
          />
        </Space>
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <Button type="default" size="large" className="px-8">
          Learn More
        </Button>
        <Button type="primary" size="large" className="px-8" onClick={() => signIn("discord")}>
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default LoginCard;
