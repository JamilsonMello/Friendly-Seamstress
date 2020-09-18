import styled from 'styled-components/native';

export const FilterView = styled.View`
  position: relative;
  height: 350px;
  width: 380px;
  border-radius: 10px;
  background: #111110;
  align-self: center;
  align-items: center;
  justify-content: center;
  margin: auto 0;
  padding: 10px;
  border: 1px solid #999;
`;

export const Title = styled.Text`
  color: #999;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 0;
  align-self: flex-start;
`;

export const ButtonFieldDate = styled.TouchableOpacity``;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: 10px;
  top: 10px;
`;

export const ConfirmButton = styled.TouchableOpacity`
  background: #999;
  width: 140px;
  height: 30px;
  border-radius: 10px;
  margin: 10px 0;
  align-items: center;
  justify-content: center;
`;

export const ConfirmButtonText = styled.Text`
  color: #333;
  font-weight: bold;
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
