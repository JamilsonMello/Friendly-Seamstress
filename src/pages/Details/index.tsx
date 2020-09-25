import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { Modal, Keyboard, TextInput, Animated } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Feather';
import { firebase } from '@react-native-firebase/firestore';

import { numberFormat, replaceDot } from '../../utils/format';
import Button from '../../components/Button';

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
  EditButton,
  EditContainer,
  EditField,
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
    operation?: string;
    title: string;
    value: number;
    status: boolean;
  };
  collection: string;
}

type RootStackParamList = {
  Details: HistoryProps;
};

type Props = StackScreenProps<RootStackParamList, 'Details'>;

const AnimatedContainer = Animated.createAnimatedComponent(EditContainer);

const Details: React.FC<Props> = ({ route }) => {
  const { item, collection } = route.params;

  const [visible, setVisible] = useState<boolean>(false);
  const [title, setTitle] = useState('');
  const [fieldSelected, setFieldSelected] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [value, setValue] = useState<number>(item.value);
  const [text, setText] = useState('');

  const upKeyboard = useRef(new Animated.Value(0)).current;

  const formated = item.status
    ? format(item.delivered, "dd'/'MM'/'yyyy")
    : 'Em produção';

  const total = useMemo(() => numberFormat(quantity * value), [
    value,
    quantity,
  ]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (text.length < 1) return;

    setVisible(false);

    await firebase
      .firestore()
      .collection(`${collection}`)
      .doc(`${item.id}`)
      .update({
        quantity: fieldSelected === 0 ? Number(text) : item.quantity,
        value: fieldSelected === 1 ? Number(text) : item.value,
      });

    setQuantity((state) => (fieldSelected === 0 ? Number(text) : state));
    setValue((state) => (fieldSelected === 1 ? Number(text) : state));
    setText('');
  }, [item, collection, text, fieldSelected]);

  const handleKeyboardDidShow = useCallback((): void => {
    Animated.timing(upKeyboard, {
      toValue: -100,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [upKeyboard]);

  const handleKeyboardHideShow = useCallback((): void => {
    Animated.timing(upKeyboard, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [upKeyboard]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardHideShow);
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, [handleKeyboardDidShow, handleKeyboardHideShow]);

  return (
    <Container>
      <Title>{item.title}</Title>
      <Company>{`Empresa: ${item.company}`}</Company>

      <Modal visible={visible} transparent>
        <AnimatedContainer
          style={{
            transform: [{ translateY: upKeyboard }],
          }}
        >
          <Title>{title}</Title>
          <EditField
            returnKeyType="send"
            keyboardType="numeric"
            onChangeText={(textValue) => setText(textValue)}
            onSubmitEditing={() => handleSubmit()}
          />

          <Button onPress={() => handleSubmit()}>Confirmar</Button>

          <EditButton
            hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
            onPress={() => setVisible((state) => !state)}
          >
            <Icon name="x" size={30} color="#FFF" />
          </EditButton>
        </AnimatedContainer>
      </Modal>

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
            <Quantity>{quantity}</Quantity>

            <EditButton
              hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
              onPress={() => {
                setVisible((state) => !state);
                setTitle('Quantidade');
                setFieldSelected(0);
              }}
            >
              <Icon name="edit" size={20} color="#FFF" />
            </EditButton>
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
            <Value>{numberFormat(Number(replaceDot(value.toString())))}</Value>

            <EditButton
              hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
              onPress={() => {
                setVisible((state) => !state);
                setTitle('Valor');
                setFieldSelected(1);
              }}
            >
              <Icon name="edit" size={20} color="#FFF" />
            </EditButton>
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
