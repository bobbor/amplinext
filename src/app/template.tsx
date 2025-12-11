"use client";
import React, { PropsWithChildren } from "react";
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer } = Layout;

const items = Array.from({ length: 15 }).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));

const App: React.FC<PropsWithChildren> = ({children}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Content style={{ padding: '48px' }}>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        AWS ©{new Date().getFullYear()} Created by Philipp Paul (phandpau@amazon.de)
      </Footer>
    </Layout>
  );
};

export default App;