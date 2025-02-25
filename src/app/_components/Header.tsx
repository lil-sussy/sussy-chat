'use client';

import React, { useState } from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const { Header: AntHeader } = Layout;
const { Text, Title } = Typography;

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignIn = () => {
    signIn('discord');
  };

  const handleSignOut = () => {
    signOut();
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: (
        <Link href="/profile" className="flex items-center gap-2">
          Profile Settings
        </Link>
      ),
    },
    {
      key: 'signout',
      icon: <LogoutOutlined />,
      label: <Text onClick={handleSignOut} className="cursor-pointer">Sign Out</Text>,
    },
  ];

  return (
    <AntHeader className="flex min-w-screen w-screen items-center justify-between bg-white/40 backdrop-blur-sm px-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <Title level={3} className="text-white" color="unset">
          Sussy Chats
        </Title>
      </div>

      <div className="user-actions">
        {isAuthenticated ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={["click"]}
            open={isMenuOpen}
            onOpenChange={setIsMenuOpen}
          >
            <Space className="cursor-pointer">
              <Avatar
                src={session?.user?.image}
                icon={!session?.user?.image ? <UserOutlined /> : undefined}
                className="border-2 border-blue-400"
              />
              <Text className="text-white">
                {session?.user?.name || "User"}
              </Text>
            </Space>
          </Dropdown>
        ) : (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={handleSignIn}
          >
            Sign In with Discord
          </Button>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
