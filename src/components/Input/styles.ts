import styled, { css } from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface ContainerProps {
  erro: boolean;
  isFocused: boolean;
  isFilled?: boolean;
}

export const Container = styled.View<ContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: #1a1a1d;
  border-radius: 10px;
  margin-top: 10px;
  padding: 0 10px;
  border-width: 2px;
  border-color: #1a1a1d;

  ${({ erro }) =>
    erro &&
    css`
      border-color: #c53030;
    `}

  ${({ isFilled }) =>
    isFilled &&
    css`
      border-color: #00ffff;
    `}

  ${({ isFocused }) =>
    isFocused &&
    css`
      border-color: #00ffff;
    `}

  
`;

export const Error = styled.Text`
  color: #c53030;
  font-size: 12px;
  margin: 10px 0;
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 5px;
`;

export const TextInput = styled.TextInput`
  flex: 1;
  background: #1a1a1d;
  color: #eee;
  font-size: 16px;
`;
