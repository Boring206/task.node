import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from './contexts/ThemeContext';
import { TodoProvider } from './contexts/TodoContext';
import GlobalStyles from './styles/GlobalStyles';
import ThemeSwitcher from './components/ThemeSwitcher';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { useTheme } from './contexts/ThemeContext';

// 樣式組件
const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.medium};
`;

const Header = styled.header`
  padding: ${props => props.theme.spacing.large} 0;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => props.theme.spacing.large};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.small};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.medium};
`;

const Main = styled.main`
  margin-bottom: ${props => props.theme.spacing.xlarge};
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  margin-bottom: ${props => props.theme.spacing.large};
`;

const Tab = styled.button`
  padding: ${props => props.theme.spacing.medium} ${props => props.theme.spacing.large};
  background: none;
  border: none;
  border-bottom: 3px solid ${props => 
    props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => 
    props.active ? props.theme.colors.primary : props.theme.colors.text};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.medium};
  font-weight: ${props => props.active ? 600 : 400};
  transition: all ${props => props.theme.transitions.default};

  &:hover {
    color: ${props => props.theme.colors.primary};
    border-bottom-color: ${props => 
      props.active ? props.theme.colors.primary : props.theme.colors.border};
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: ${props => props.theme.spacing.large} 0;
  border-top: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.small};
`;

// 應用組件
const AppContent = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('list'); // 'list' 或 'add'

  return (
    <AppContainer>
      <GlobalStyles theme={theme} />
      <Header>
        <Title>個人待辦事項系統</Title>
        <Description>使用本地儲存的簡單而強大的待辦事項管理工具</Description>
      </Header>
      
      <ThemeSwitcher />
      
      <Main>
        <TabContainer>
          <Tab 
            active={activeTab === 'list'} 
            onClick={() => setActiveTab('list')}
          >
            待辦清單
          </Tab>
          <Tab 
            active={activeTab === 'add'} 
            onClick={() => setActiveTab('add')}
          >
            新增待辦
          </Tab>
        </TabContainer>
        
        {activeTab === 'list' ? <TodoList /> : <TodoForm />}
      </Main>
      
      <Footer>
        &copy; {new Date().getFullYear()} 個人待辦事項系統 - 使用 localStorage 儲存所有資料
      </Footer>
    </AppContainer>
  );
};

function App() {
  return (
    <ThemeProvider>
      <TodoProvider>
        <AppContent />
      </TodoProvider>
    </ThemeProvider>
  );
}

export default App;
