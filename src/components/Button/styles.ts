import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

interface ContainerProps extends TouchableOpacityProps {
  radius?: number;
  width?: number;
  height?: number;
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  background: #1a1a1d;
  align-self: center;
  justify-content: center;
  align-items: center;

  width: ${({ width }) => width || 300}px;
  height: ${({ height }) => height || 35}px;
  border-radius: ${({ radius }) => radius || 5}px;
  border: 1px solid #f1f1f1;
  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  color: #f1f1f1;
  font-size: 16px;
  font-weight: 600;
`;
