import { TouchableOpacityProps, ViewProps } from 'react-native';
import styled from 'styled-components/native';

interface TouchableProps extends TouchableOpacityProps {
  lastItem: boolean;
}

interface ViewHistoryProps extends ViewProps {
  widthSize: number;
}

export const Container = styled.View`
  flex: 1;
  background: #040405;
  padding: 40px 15px 15px;
`;

export const ProfileView = styled.View`
  align-items: center;
  justify-content: center;
  padding: 10px;
`;

export const ProfileImage = styled.Image`
  height: 90px;
  width: 90px;
  border-radius: 20px;
`;

export const ProfileName = styled.Text`
  font-size: 16px;
  color: #eee;
  font-weight: bold;
  text-transform: uppercase;
  margin: 5px 0;
`;

export const ProfileOffice = styled.Text`
  font-size: 12px;
  color: #eee;
  font-weight: 600;
`;

export const RegisterProductionButton = styled.TouchableOpacity`
  height: 40px;
  width: 250px;
  margin: 5px 0;
  background: #65a7ea;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
`;

export const RegisterProductionButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const ViewHistory = styled.View<ViewHistoryProps>`
  width: ${({ widthSize }) => widthSize - 30}px;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  margin: 10px 0;
`;

export const ViewTextHistory = styled.Text`
  color: #eee;
  font-size: 16px;
`;

export const FilterButton = styled.TouchableOpacity``;

export const TitleProduction = styled.Text`
  color: #eee;
  font-size: 16px;
`;

export const ProductionHistory = styled.TouchableOpacity<TouchableProps>`
  position: relative;
  background: #1a1a1d;
  height: 80px;
  border-radius: 10px;
  border-bottom-color: #ddd;
  padding: 10px;
  margin-top: 10px;
`;

export const DateProduction = styled.Text`
  color: #eee;
  font-size: 16px;
`;

export const Quantity = styled.Text`
  color: #eee;
  font-size: 16px;
`;

export const BottomView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: auto;
`;

export const Title = styled.Text`
  color: #999;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 0;
  align-self: flex-start;
`;

export const ArrowDownContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 0;
`;

export const TotalText = styled.Text`
  color: #fff;
  letter-spacing: 2px;
`;

export const TotalValue = styled.Text`
  color: #fff;
  letter-spacing: 2px;
`;

export const ButtonIcon = styled.TouchableOpacity`
  position: absolute;
  top: 10px;
  right: 10px;
`;
