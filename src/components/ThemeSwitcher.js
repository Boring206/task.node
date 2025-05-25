import React from 'react';
import styled from '@emotion/styled';
import { useTheme } from '../contexts/ThemeContext';

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${props => props.theme.spacing.medium};
`;

const SwitchLabel = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const SwitchText = styled.span`
  margin-right: ${props => props.theme.spacing.small};
  font-size: ${props => props.theme.typography.fontSize.small};
  color: ${props => props.theme.colors.text};
`;

const SwitchInput = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  position: absolute;
`;

const SwitchSlider = styled.span`
  display: inline-flex;
  align-items: center;
  position: relative;
  width: 50px;
  height: 24px;
  background-color: ${props => props.theme.colors.border};
  border-radius: 24px;
  transition: ${props => props.theme.transitions.default};

  &:before {
    content: "🌞";
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: ${props => props.theme.colors.background};
    border-radius: 50%;
    transition: ${props => props.theme.transitions.default};
  }

  input:checked + & {
    background-color: ${props => props.theme.colors.primary};
  }

  input:checked + &:before {
    content: "🌙";
    transform: translateX(26px);
  }

  input:focus + & {
    box-shadow: 0 0 1px ${props => props.theme.colors.primary};
  }
`;

const ThemeSwitcher = () => {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <SwitchContainer>
      <SwitchLabel>
        <SwitchText>
          {currentTheme === 'light' ? '切換至深色模式' : '切換至淺色模式'}
        </SwitchText>
        <SwitchInput
          type="checkbox"
          checked={currentTheme === 'dark'}
          onChange={toggleTheme}
        />
        <SwitchSlider />
      </SwitchLabel>
    </SwitchContainer>
  );
};

export default ThemeSwitcher;
