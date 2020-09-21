import React, {
  ReactElement,
  forwardRef,
  useState,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { TextInputProps } from 'react-native';
import { FieldError } from 'react-hook-form';

import { Container, Icon, TextInput, Error } from './styles';

interface InputProps extends TextInputProps {
  icon: string;
  erro?: FieldError | undefined;
  name?: string;
  height?: number;
  dateValid?: string;
}

interface InputRef {
  focus(): void | undefined;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  { icon, erro, value, height, ...rest },
  ref,
): ReactElement => {
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<any>(null);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, [setIsFocused]);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));

  return (
    <>
      <Container erro={!!erro} isFilled={!!value} isFocused={isFocused}>
        <TextInput
          ref={inputRef}
          {...rest}
          value={value}
          style={{ flex: 1, backgroundColor: '#1a1a1d', height }}
          placeholderTextColor="#666360"
          keyboardAppearance="dark"
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <Icon
          name={icon}
          size={25}
          color={isFocused || !!value ? '#00FFFF' : '#666360'}
        />
      </Container>

      {erro && <Error>{erro.message || 'Campo obrigatório'}</Error>}
    </>
  );
};

export default forwardRef(Input);
