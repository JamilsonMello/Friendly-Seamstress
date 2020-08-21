import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: #040405;
  padding: 20px;
`;

export const RegisterButton = styled.TouchableOpacity`
  background: #1a1a1d;
  align-self: center;
  width: 300px;
  height: 35px;
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
`;

export const RegisterButtonText = styled.Text`
  color: #f1f1f1;
  font-size: 16px;
  font-weight: 600;
`;
