import React from 'react';
import styled from '@emotion/styled';

const TagContainer = styled.span`
  display: inline-block;
  background-color: ${props => props.theme.colors.tag};
  color: ${props => props.theme.colors.tagText};
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.radius.large};
  font-size: ${props => props.theme.typography.fontSize.small};
  margin-right: ${props => props.theme.spacing.small};
  margin-bottom: ${props => props.theme.spacing.small};
  transition: ${props => props.theme.transitions.default};

  ${props => props.clickable && `
    cursor: pointer;
    &:hover {
      opacity: 0.8;
      transform: scale(1.05);
    }
  `}
`;

const Tag = ({ children, onClick, clickable = false }) => {
  return (
    <TagContainer 
      clickable={clickable} 
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </TagContainer>
  );
};

export default Tag;
