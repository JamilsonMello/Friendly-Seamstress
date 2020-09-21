/* eslint-disable import/no-duplicates */
import React, { useRef, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { CalendarList } from 'react-native-calendars';
import { useRoute } from '@react-navigation/native';
import {
  TextInput,
  ActivityIndicator,
  Keyboard,
  useWindowDimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as yup from 'yup';
import * as Animation from 'react-native-animatable';
import { firebase } from '@react-native-firebase/firestore';
import { Picker } from '@react-native-community/picker';

import { TouchableOpacity } from 'react-native-gesture-handler';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/context/AuthProvider';
import { useCompany } from '../../hooks/context/CompaniesProvider';

import {
  Container,
  RegisterButton,
  RegisterButtonText,
  ChoiceCompany,
} from './styles';

interface SelectedDateProps {
  day: number;
  month: number;
  year: number;
  dateString: string;
}

interface DataForm {
  title: string;
  operation: string;
  quantity: string;
  value: number;
  received: Date;
  description: string;
}

interface UserProps {
  user: {
    user_id: string;
    provider_id: string;
    name: string;
    whatsapp: number;
    office: string;
    avatar_url: string | null;
  };
}

const AnimationIcon = Animation.createAnimatableComponent(Icon);

const zoomIn = {
  0: {
    opacity: 0,
    scale: 0,
  },
  0.5: {
    opacity: 1,
    scale: 0.3,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};

const RegisterProduction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectDate] = useState<SelectedDateProps>(
    {} as SelectedDateProps,
  );
  const [dateFormatted, setDateFormatted] = useState('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<React.ReactText>();

  const operationRef = useRef<TextInput>(null);
  const quantityRef = useRef<TextInput>(null);
  const valueRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const { provider } = useAuth();
  const { height, width } = useWindowDimensions();
  const { user } = useRoute().params as UserProps;
  const { loadCompanies } = useCompany();

  const schema = yup.object().shape({
    title: yup.string().required('O nome é obrigatório'),
    operation: yup.string().required('Operação é obrigatório'),
    quantity: yup
      .number()
      .integer()
      .positive('Digite apenas números positivos')
      .required('Campo obrigatório! Apenas números são permitidos')
      .typeError('Campo obrigatório! Digite apenas números'),
    value: yup
      .number()
      .required('Campo obrigatório! Apenas números são permitidos')
      .typeError('Campo obrigatório! Digite apenas números'),
    received: yup
      .date()
      .required('Campo obrigatório!')
      .typeError('Campo obrigatório'),
    description: yup.string().default('Sem descrição'),
  });

  const { handleSubmit, errors, control, setValue, clearErrors } = useForm<
    DataForm
  >({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const handleSubmitButton = useCallback(
    async ({
      title,
      operation,
      quantity,
      value,
      description,
    }: DataForm): Promise<void> => {
      setLoading(true);
      const { day, month, year } = selectedDate;

      setValue('title', '');
      setValue('operation', '');
      setValue('quantity', '');
      setValue('value', undefined);
      setValue('received', undefined);
      setValue('description', '');
      setDateFormatted('');
      Keyboard.dismiss();

      await firebase
        .firestore()
        .collection('production')
        .add({
          title,
          operation,
          quantity,
          value,
          company: selectedValue || loadCompanies()[0].name,
          received: new Date(year, month - 1, day).getTime(),
          description,
          provider_id: provider.uid,
          user_id: user.user_id,
          pay_out: false,
          delivered: null,
          status: false,
        });

      setLoading(false);
      setSelectDate({} as SelectedDateProps);
    },
    [
      setValue,
      provider.uid,
      selectedDate,
      user.user_id,
      loadCompanies,
      selectedValue,
    ],
  );

  const handleDateSubmit = useCallback(
    (event: SelectedDateProps) => {
      const { day, month, year, dateString } = event;

      if (new Date(dateString).getTime() > new Date(Date.now()).getTime()) {
        Alert.alert(
          'Selecione Outra Data',
          'Você não pode registrar datas futura',
        );

        return;
      }

      setDateFormatted(
        `${day.toString().padStart(2, '0')}/${month
          .toString()
          .padStart(2, '0')}/${year}`,
      );
      setSelectDate({ day, month, year, dateString });
      setShowCalendar((state) => !state);
      setValue('received', new Date(dateString));
      clearErrors('received');
    },
    [setValue, clearErrors],
  );

  return (
    <Container>
      <ScrollView
        pinchGestureEnabled={!showCalendar}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        canCancelContentTouches={false}
      >
        <AnimationIcon
          delay={350}
          useNativeDriver
          animation={zoomIn}
          name="bar-chart-2"
          size={140}
          color="#1a1a1d"
          style={{ margin: 20, alignSelf: 'center' }}
        />

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="title"
            defaultValue=""
            render={({ onChange, value }) => (
              <Input
                erro={errors?.title}
                icon="type"
                value={value}
                editable={!showCalendar}
                placeholder="Titulo"
                returnKeyType="next"
                onChangeText={(text: string) => onChange(text)}
                onSubmitEditing={() => operationRef.current?.focus()}
              />
            )}
          />
        </Animation.View>

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="operation"
            defaultValue=""
            render={({ onChange, value }) => (
              <Input
                ref={operationRef}
                erro={errors?.operation}
                icon="scissors"
                value={value}
                editable={!showCalendar}
                placeholder="Tipo de operação"
                returnKeyType="next"
                onChangeText={(text: string) => onChange(text)}
                onSubmitEditing={() => quantityRef.current?.focus()}
              />
            )}
          />
        </Animation.View>

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="quantity"
            defaultValue=""
            render={({ onChange, value }) => (
              <Input
                ref={quantityRef}
                erro={errors?.quantity}
                icon="bar-chart"
                value={value}
                editable={!showCalendar}
                placeholder="Quantidade de peças"
                returnKeyType="next"
                keyboardType="numeric"
                onChangeText={(text: string) => onChange(text)}
                onSubmitEditing={() => valueRef.current?.focus()}
              />
            )}
          />
        </Animation.View>

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="value"
            defaultValue=""
            render={({ onChange, value }) => (
              <Input
                ref={valueRef}
                erro={errors?.value}
                icon="dollar-sign"
                value={value}
                editable={!showCalendar}
                placeholder="Valor da operação"
                returnKeyType="next"
                keyboardType="numeric"
                onChangeText={(text: string) => onChange(text)}
                onSubmitEditing={() => setShowCalendar((state) => !state)}
              />
            )}
          />
        </Animation.View>

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="received"
            defaultValue=""
            render={() => (
              <TouchableOpacity
                onPress={() => setShowCalendar((state) => !state)}
              >
                <Input
                  erro={errors.received}
                  icon="calendar"
                  value={dateFormatted}
                  editable={false}
                  placeholder="Data"
                  returnKeyType="next"
                />
              </TouchableOpacity>
            )}
          />
        </Animation.View>

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <ChoiceCompany>
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue) => setSelectedValue(itemValue)}
              style={{
                height: 50,
                width: '100%',
                color: '#fff',
              }}
            >
              {loadCompanies().map((value) => (
                <Picker.Item
                  key={value.id}
                  color="#666"
                  label={`${value.name}`}
                  value={`${value.name}`}
                />
              ))}
            </Picker>
          </ChoiceCompany>
        </Animation.View>

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="description"
            defaultValue=""
            render={({ onChange, value }) => (
              <Input
                ref={descriptionRef}
                erro={errors?.description}
                icon="edit-3"
                value={value}
                editable={!showCalendar}
                placeholder="Alguma Observação?"
                returnKeyType="next"
                multiline
                numberOfLines={3}
                scrollEnabled={false}
                onChangeText={(text: string) => onChange(text)}
              />
            )}
          />
        </Animation.View>

        <Animation.View delay={420} useNativeDriver animation="bounceIn">
          <RegisterButton
            onPress={handleSubmit(handleSubmitButton)}
            disabled={showCalendar}
          >
            <RegisterButtonText>
              {loading ? (
                <ActivityIndicator color="#00ffff" size="small" />
              ) : (
                'CADASTRAR'
              )}
            </RegisterButtonText>
          </RegisterButton>
        </Animation.View>
      </ScrollView>

      {showCalendar && (
        <CalendarList
          horizontal
          pagingEnabled
          calendarWidth={width - 40}
          theme={{
            calendarBackground: '#444242',
            monthTextColor: '#fff',
            dayTextColor: '#fff',
            todayTextColor: '#00FFee',
            textSectionTitleColor: '#fff',
          }}
          markedDates={{
            [selectedDate.dateString]: {
              selected: true,
              marked: true,
              selectedColor: '#00FFFF',
            },
          }}
          style={{
            position: 'absolute',
            bottom: height / 4,
            alignSelf: 'center',
            width: width - 40,
          }}
          onDayPress={handleDateSubmit}
        />
      )}
    </Container>
  );
};

export default React.memo(RegisterProduction);
