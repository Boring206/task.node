import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTodoContext } from '../contexts/TodoContext';

// 樣式組件
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
  padding: ${props => props.theme.spacing.large};
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.radius.medium};
  box-shadow: 0 2px 8px ${props => props.theme.colors.shadow};
  margin-bottom: ${props => props.theme.spacing.large};
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

const Textarea = styled.textarea`
  padding: ${props => props.theme.spacing.medium};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.medium};
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.medium};
  min-height: 100px;
  width: 100%;
  resize: vertical;
  transition: border-color ${props => props.theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TagInput = styled(Input)`
  margin-top: ${props => props.theme.spacing.small};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.small};
  margin-top: ${props => props.theme.spacing.small};
`;

const Tag = styled.div`
  background: ${props => props.theme.colors.tag};
  color: ${props => props.theme.colors.tagText};
  border-radius: ${props => props.theme.radius.large};
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.medium};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.small};
`;

const TagRemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.tagText};
  cursor: pointer;
  font-size: ${props => props.theme.typography.fontSize.medium};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;

  &:hover {
    color: ${props => props.theme.colors.error};
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: ${props => props.theme.spacing.small};
  color: ${props => props.theme.colors.text};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.medium};
  margin-top: ${props => props.theme.spacing.medium};
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.small} ${props => props.theme.spacing.large};
  border: none;
  border-radius: ${props => props.theme.radius.medium};
  cursor: pointer;
  font-weight: 600;
  transition: background-color ${props => props.theme.transitions.default},
              color ${props => props.theme.transitions.default};

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.info};
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const ErrorText = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.fontSize.small};
  margin-top: ${props => props.theme.spacing.small};
`;

// TodoForm 組件
const TodoForm = ({ editTodo, onCancel }) => {
  // 使用 TodoContext 存取待辦事項功能
  const { addTodo, updateTodo, getAllTags } = useTodoContext();
  
  // 本地狀態
  const [title, setTitle] = useState(editTodo ? editTodo.title || '' : '');
  const [content, setContent] = useState(editTodo ? editTodo.content || '' : '');
  const [tags, setTags] = useState(editTodo && Array.isArray(editTodo.tags) ? [...editTodo.tags] : []);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // 所有已有標籤
  const existingTags = getAllTags();

  // 表單驗證
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = '標題為必填項';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 添加標籤
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  // 移除標籤
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 處理表單提交
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const todoData = {
      title,
      content,
      tags
    };

    if (editTodo) {
      updateTodo(editTodo.id, todoData);
    } else {
      addTodo(todoData);
    }

    // 重置表單
    if (!editTodo) {
      setTitle('');
      setContent('');
      setTags([]);
    }

    // 如果是編輯模式，調用取消回調以退出編輯模式
    if (editTodo && onCancel) {
      onCancel();
    }
  };

  // 處理標籤輸入框按鍵事件
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="title">標題</Label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="輸入待辦事項標題..."
        />
        {errors.title && <ErrorText>{errors.title}</ErrorText>}
      </div>

      <div>
        <Label htmlFor="content">內容 (選填)</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="輸入詳細內容..."
        />
      </div>

      <div>
        <Label htmlFor="tags">標籤 (選填，按 Enter 新增)</Label>
        <TagInput
          id="tags"
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagInputKeyDown}
          placeholder="輸入標籤..."
          list="existing-tags"
        />
        <datalist id="existing-tags">
          {existingTags.map(tag => (
            <option key={tag} value={tag} />
          ))}
        </datalist>

        <TagsContainer>
          {tags.map(tag => (
            <Tag key={tag}>
              {tag}
              <TagRemoveButton
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`移除標籤 ${tag}`}
              >
                &times;
              </TagRemoveButton>
            </Tag>
          ))}
        </TagsContainer>
      </div>

      <ButtonGroup>
        {editTodo && (
          <SecondaryButton type="button" onClick={onCancel}>
            取消
          </SecondaryButton>
        )}
        <PrimaryButton type="submit">
          {editTodo ? '保存修改' : '新增待辦'}
        </PrimaryButton>
      </ButtonGroup>
    </Form>
  );
};

export default TodoForm;
