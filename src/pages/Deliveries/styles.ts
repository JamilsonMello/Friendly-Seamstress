import styled, { css } from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

interface TouchableProps extends TouchableOpacityProps {
  selected: boolean;
}

export const Container = styled.View`
  flex: 1;
  background: #040405;
  padding: 15px;
`;

export const VictoryChartContainer = styled.View`
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: 1px solid #eee;
  margin-bottom: 20px;
`;

export const NewOrderButton = styled.TouchableOpacity`
  background: #1a1a1d;
  margin: 16px 0 5px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border: 1px solid #dddde1;
  border-radius: 5px;
`;

export const NewOrderButtonText = styled.Text`
  color: #ddd;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
`;

export const ButtonIcon = styled.TouchableOpacity`
  position: absolute;
  right: 5px;
`;

export const ProductItem = styled.TouchableOpacity`
  height: 70px;
  background: #1a1a1d;
  padding: 10px;
  margin-top: 10px;
  border-radius: 10px;
`;

export const ProductTopView = styled.View`
  justify-content: space-between;
`;

export const ProductBottomView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: auto;
`;

export const ProductTitle = styled.Text`
  color: #f1f1f1;
  font-size: 16px;
`;

export const ProductAmount = styled.Text`
  color: #f1f1f1;
  font-size: 16px;
`;

export const ProductDate = styled.Text`
  color: #f1f1f1;
  font-size: 16px;
`;

export const MonthsView = styled.View``;

export const MonthButton = styled.TouchableOpacity<TouchableProps>`
  height: 46px;
  width: 58px;
  background: transparent;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  margin-right: 6px;
  border-radius: 10px;
  ${({ selected }) =>
    selected &&
    css`
      border: 2px solid #00ffff;
    `}
`;

export const MonthButtonText = styled.Text`
  color: #fff;
  text-align: center;
`;

export const ViewNone = styled.View`
  height: 200px;
  width: 380px;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 15px;
  align-items: center;
  justify-content: center;
`;

export const ViewTextNone = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

export const ArrowDownContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 0;
`;

export const TotalText = styled.Text`
  color: #fff;
`;

export const TotalValue = styled.Text`
  color: #fff;
`;
// FilterView,
//   ButtonFieldDate,
//   Title,
//   ConfirmButton,
//   ConfirmButtonText,
