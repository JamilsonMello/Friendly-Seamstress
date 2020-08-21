import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: #040405;
  padding: 0 20px;
  position: relative;
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
  margin: 30px 0;
`;

export const RegisterButtonText = styled.Text`
  color: #f1f1f1;
  font-size: 16px;
  font-weight: 600;
`;

export const ChoiceCompany = styled.View`
  background: #1a1a1d;
  max-height: 54px;
  margin: 10px 0 0;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 5px;
  width: 100%;
`;
