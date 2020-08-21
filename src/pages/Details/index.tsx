import React, { useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Feather';

import { numberFormat } from '../../utils/format';

import {
  Container,
  Company,
  Delivered,
  FirstColumn,
  InfoView,
  PayOut,
  Quantity,
  Received,
  SecondColumn,
  Title,
  Total,
  Value,
  DeliveredView,
  PayOutView,
  QuantityView,
  ReceivedView,
  TotalView,
  ValueView,
  DescriptionTitle,
  DescriptionView,
  DescriptionText,
} from './styles';

interface HistoryProps {
  item: {
    id: string;
    provider_id: string;
    company: string;
    received: Date;
    description: string;
    delivered: Date;
    pay_out: boolean;
    quantity: number;
    title: string;
    value: number;
    status: boolean;
  };
}

type RootStackParamList = {
  Details: HistoryProps;
};

type Props = StackScreenProps<RootStackParamList, 'Details'>;

const Details: React.FC<Props> = ({ route }) => {
  const { item } = route.params;
  const formated = item.status
    ? format(item.delivered, "dd'/'MM'/'yyyy")
    : 'Em produção';

  const total = useMemo(() => numberFormat(item.quantity * item.value), [item]);

  return (
    <Container>
      <Title>{item.title}</Title>
      <Company>{`Empresa: ${item.company}`}</Company>

      <InfoView>
        <FirstColumn>
          <ReceivedView>
            <Icon name="calendar" size={60} color="#FFE4E1" />
            <DescriptionTitle>Recebida</DescriptionTitle>
            <Received>{format(item.received, "dd'/'MM'/'yyyy")}</Received>
          </ReceivedView>
          <QuantityView>
            <Icon name="pie-chart" size={60} color="#FF69B4" />
            <DescriptionTitle>Quantidade</DescriptionTitle>
            <Quantity>{item.quantity}</Quantity>
          </QuantityView>
          <PayOutView>
            <Icon name="check" size={60} color="#00FF00" />
            <DescriptionTitle>Pagamento</DescriptionTitle>
            <PayOut>{`${item.status ? 'Pago' : 'Aguardando...'}`}</PayOut>
          </PayOutView>
        </FirstColumn>
        <SecondColumn>
          <DeliveredView>
            <Icon name="calendar" size={60} color="#008B8B" />
            <DescriptionTitle>Entregue</DescriptionTitle>
            <Delivered>{formated}</Delivered>
          </DeliveredView>
          <ValueView>
            <Icon name="dollar-sign" size={60} color="#006400" />
            <DescriptionTitle>Valor</DescriptionTitle>
            <Value>{numberFormat(item.value)}</Value>
          </ValueView>
          <TotalView>
            <Icon name="clipboard" size={60} color="#8B0000" />
            <DescriptionTitle>Total</DescriptionTitle>
            <Total>{total}</Total>
          </TotalView>
        </SecondColumn>
      </InfoView>

      {!!item.description && (
        <DescriptionView>
          <DescriptionText>{`Observação: ${item.description}`}</DescriptionText>
        </DescriptionView>
      )}
    </Container>
  );
};

export default Details;
