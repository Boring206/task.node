import React, { useState } from 'react';
import styled from '@emotion/styled';
import Tag from './Tag';

const TagInputContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.medium};
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.medium};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.medium};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.medium};
  width: 100%;
  transition: border-color ${props => props.theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing.small};
`;

const ClearTagButton = styled.span`
  margin-left: ${props => props.theme.spacing.small};
  cursor: pointer;
  color: ${props => props.theme.colors.tagText};
  font-weight: bold;
`;

// TagInput 組件
const TagInput = ({ selectedTags = [], setSelectedTags, availableTags = [] }) => {
  const [inputValue, setInputValue] = useState('');

  // 處理輸入框變化
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 處理輸入框按鍵事件
  const handleKeyDown = (e) => {
    const trimmedValue = inputValue.trim();
    
    // Enter 鍵或逗號 添加標籤
    if ((e.key === 'Enter' || e.key === ',') && trimmedValue) {
      e.preventDefault();
      
      if (!selectedTags.includes(trimmedValue)) {
        setSelectedTags([...selectedTags, trimmedValue]);
      }
      
      setInputValue('');
    }
    
    // 退格鍵 刪除最後一個標籤
    if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      const newTags = [...selectedTags];
      newTags.pop();
      setSelectedTags(newTags);
    }
  };

  // 添加現有標籤
  const addExistingTag = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 移除標籤
  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  // 過濾已選擇的標籤
  const notSelectedTags = availableTags.filter(tag => !selectedTags.includes(tag));

  return (
    <TagInputContainer>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="輸入標籤，按 Enter 或逗號添加..."
      />
      
      <TagsContainer>
        {selectedTags.map(tag => (
          <Tag key={tag}>
            {tag}
            <ClearTagButton onClick={() => removeTag(tag)}>
              &times;
            </ClearTagButton>
          </Tag>
        ))}
      </TagsContainer>
      
      {notSelectedTags.length > 0 && (
        <TagsContainer>
          {notSelectedTags.map(tag => (
            <Tag 
              key={tag} 
              clickable={true} 
              onClick={() => addExistingTag(tag)}
            >
              + {tag}
            </Tag>
          ))}
        </TagsContainer>
      )}
    </TagInputContainer>
  );
};

export default TagInput;
