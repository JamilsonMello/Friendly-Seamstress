import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: #040405;
  padding: 15px;
  justify-content: center;
`;

export const AvatarPicture = styled.Image`
  height: 160px;
  width: 160px;
  border-radius: 80px;
  margin-bottom: 60px;
`;

export const RegisterButton = styled.TouchableOpacity`
  background: #1a1a1d;
  align-self: center;
  margin-top: 20px;
  width: 300px;
  height: 35px;
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  align-items: center;
  justify-content: center;
`;

export const RegisterButtonText = styled.Text`
  color: #f1f1f1;
  font-size: 16px;
  font-weight: 600;
`;
