import React from 'react';
import {TouchableOpacityProps} from 'react-native';

import {Container, ButtonText} from './styles';

interface ButtonProps extends TouchableOpacityProps {
  radius?: number;
  width?: number;
  height?: number;
}

const Button: React.FC<ButtonProps> = ({children, ...rest}) => {
  return (
    <Container {...rest}>
      <ButtonText>{children}</ButtonText>
    </Container>
  );
};

export default Button;
