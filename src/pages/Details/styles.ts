import styled, { css } from 'styled-components/native';
import { ViewProps } from 'react-native';

interface EditContainerProps extends ViewProps {
  transform: any;
}

export const Container = styled.View`
  flex: 1;
  background: #040405;
  padding: 60px 20px 0;
  /* align-items: center;
  justify-content: center; */
`;

export const Title = styled.Text`
  color: #fff;
  font-size: 20px;
`;

export const Company = styled.Text`
  color: #fff;
  font-size: 14px;
`;

export const InfoView = styled.View`
  justify-content: space-between;
  flex-direction: row;
  margin-top: 30px;
`;

export const FirstColumn = styled.View`
  margin-right: 15px;
`;

export const ReceivedView = styled.View`
  align-items: center;
  justify-content: center;
  height: 130px;
  background: #1a1a1d;
  width: 180px;
  border-radius: 4px;
`;

export const Received = styled.Text`
  font-size: 12px;
  color: #ddd;
  font-weight: bold;
`;

export const QuantityView = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
  height: 130px;
  background: #1a1a1d;
  width: 180px;
  margin: 15px 0;
  border-radius: 4px;
`;

export const Quantity = styled.Text`
  font-size: 12px;
  color: #ddd;
  font-weight: bold;
`;

export const PayOutView = styled.View`
  align-items: center;
  justify-content: center;
  height: 130px;
  background: #1a1a1d;
  width: 180px;
  border-radius: 4px;
`;

export const PayOut = styled.Text`
  font-size: 12px;
  color: #ddd;
  font-weight: bold;
`;

export const SecondColumn = styled.View``;

export const DeliveredView = styled.View`
  align-items: center;
  justify-content: center;
  height: 130px;
  background: #1a1a1d;
  width: 180px;
  border-radius: 4px;
`;

export const Delivered = styled.Text`
  font-size: 12px;
  color: #ddd;
  font-weight: bold;
`;

export const ValueView = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
  height: 130px;
  background: #1a1a1d;
  width: 180px;
  margin: 15px 0;
  border-radius: 4px;
`;

export const Value = styled.Text`
  font-size: 12px;
  color: #ddd;
  font-weight: bold;
`;

export const TotalView = styled.View`
  align-items: center;
  justify-content: center;
  height: 130px;
  background: #1a1a1d;
  width: 180px;
  border-radius: 4px;
`;

export const Total = styled.Text`
  font-size: 12px;
  color: #ddd;
  font-weight: bold;
`;

export const DescriptionTitle = styled.Text`
  font-size: 16px;
  color: #ddd;
  font-weight: bold;
  margin: 5px;
`;

export const DescriptionView = styled.View`
  background: #1a1a1d;
  padding: 5px;
  margin: 15px 0;
  border-radius: 4px;
  width: 375px;
`;

export const DescriptionText = styled.Text`
  color: #ddd;
  font-size: 14px;
  font-weight: bold;
`;

export const EditButton = styled.TouchableOpacity`
  position: absolute;
  top: 5px;
  right: 5px;
`;

export const EditContainer = styled.View<EditContainerProps>`
  height: 300px;
  width: 390px;
  border-radius: 10px;
  background: #1a1a1a;
  margin-top: 60%;
  align-self: center;
  align-items: center;
  justify-content: center;
`;

export const EditField = styled.TextInput`
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: #1a1a1d;
  border-radius: 10px;
  padding: 10px;
  width: 360px;
  margin: 20px 0;
  border: 1px solid #333;
  text-align: center;
`;
