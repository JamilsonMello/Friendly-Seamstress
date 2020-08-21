import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background: #040405;
  padding: 15px;
`;

export const User = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  max-height: 70px;
  border-radius: 10px;
  background: #1a1a1d;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
`;

export const ViewLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const UserImage = styled.Image`
  height: 44px;
  width: 44px;
  border-radius: 20px;
  background: #eee;
  margin-right: 10px;
`;

export const UserHeader = styled.View`
  flex-direction: column;
`;

export const Title = styled.Text`
  color: #ddd;
  font-weight: bold;
  font-size: 16px;
  line-height: 30px;
`;

export const Office = styled.Text`
  color: #eee;
  font-weight: 600;
  font-size: 12px;
  line-height: 30px;
`;
