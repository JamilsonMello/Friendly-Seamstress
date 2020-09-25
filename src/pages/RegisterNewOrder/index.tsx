import React, { useRef, useCallback, useState, useMemo } from 'react';
import {
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { isFuture } from 'date-fns';
import { firebase } from '@react-native-firebase/firestore';

import Input from '../../components/Input';
import Calender from '../../components/Calender';
import { useCompany } from '../../hooks/context/CompaniesProvider';
import { useAuth } from '../../hooks/context/AuthProvider';

import {
  Container,
  RegisterButton,
  RegisterButtonText,
  ChoiceCompany,
} from './styles';

interface DataForm {
  title: string;
  quantity: string;
  value: string;
  date: string;
  description: string;
}

interface SelectedDateProps {
  day: number;
  month: number;
  year: number;
  dateString: string;
}

const schema = yup.object().shape({
  title: yup.string().required('O nome é obrigatório'),
  quantity: yup
    .number()
    .integer()
    .positive('Digite apenas números positivos')
    .required('Campo obrigatório! Apenas números são permitidos')
    .typeError('Campo obrigatório! Digite apenas números'),
  value: yup
    .string()
    .transform((_, value) => value.replace(/,/g, '.'))
    .required('Campo obrigatório! Apenas números são permitidos')
    .typeError('Campo obrigatório! Digite apenas números'),
  date: yup
    .date()
    .required('Campo obrigatório!')
    .typeError('Campo obrigatório'),
  description: yup.string().default('Sem descrição'),
});

const RegisterNewOrder: React.FC = () => {
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [selectedValue, setSelectedValue] = useState<React.ReactText>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [dateFormatted, setDateFormatted] = useState('');
  const [selectedDate, setSelectDate] = useState<SelectedDateProps>(
    {} as SelectedDateProps,
  );

  const quantityRef = useRef<TextInput>(null);
  const valueRef = useRef<TextInput>(null);

  const { loadCompanies } = useCompany();
  const { provider } = useAuth();

  const {
    handleSubmit,
    errors,
    control,
    reset,
    setValue,
    clearErrors,
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const companies = useMemo(
    () => loadCompanies().filter((value) => value.name !== 'Todos'),
    [loadCompanies],
  );

  const handleSubmitButton = useCallback(
    async ({
      title,
      quantity,
      value,
      description,
    }: DataForm): Promise<void> => {
      setLoadingRequest(true);
      const { day, month, year } = selectedDate;

      await firebase
        .firestore()
        .collection('orders')
        .add({
          title,
          quantity,
          value: Number(value),
          company: selectedValue || companies[0].name,
          received: new Date(year, month - 1, day).getTime(),
          description,
          provider_id: provider.uid,
          pay_out: false,
          delivered: null,
          status: false,
        });

      setLoadingRequest(false);

      clearErrors();

      reset({
        date: '',
        description: '',
        quantity: '',
        title: '',
        value: '',
      });

      setSelectDate({} as SelectedDateProps);
      setDateFormatted('');
    },
    [provider.uid, selectedDate, clearErrors, selectedValue, reset, companies],
  );

  const handleDateSubmit = useCallback(
    (formatted, event: SelectedDateProps) => {
      const { day, month, year, dateString } = event;

      if (isFuture(new Date(year, month - 1, day))) {
        Alert.alert(
          'Selecione Outra Data',
          'Você não pode registrar datas futura',
        );

        return;
      }

      setDateFormatted(formatted);
      setSelectDate({ day, month, year, dateString });
      setShowCalendar((state) => !state);
      setValue('date', new Date(dateString).toString());
      clearErrors('date');
    },
    [setValue, clearErrors],
  );

  return (
    <Container>
      <ScrollView
        style={{ flex: 1, paddingTop: 80 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        canCancelContentTouches={false}
      >
        <Controller
          control={control}
          name="title"
          render={({ onChange, value }) => (
            <Input
              erro={errors?.title}
              icon="type"
              value={value}
              editable={!showCalendar}
              placeholder="Titulo"
              returnKeyType="next"
              onChangeText={(text: string) => onChange(text)}
              onSubmitEditing={() => quantityRef.current?.focus()}
            />
          )}
          defaultValue=""
        />

        <Controller
          control={control}
          name="quantity"
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
          defaultValue=""
        />

        <Controller
          control={control}
          name="value"
          render={({ onChange, value }) => (
            <Input
              ref={valueRef}
              erro={errors?.value}
              icon="dollar-sign"
              value={value}
              editable={!showCalendar}
              placeholder="Valor da peça"
              returnKeyType="next"
              keyboardType="numeric"
              onChangeText={(text: string) => onChange(text)}
              onSubmitEditing={() => setShowCalendar(true)}
            />
          )}
          defaultValue=""
        />

        <Controller
          control={control}
          name="date"
          render={() => (
            <TouchableOpacity
              onPress={() => setShowCalendar((state) => !state)}
            >
              <Input
                erro={errors.date}
                icon="calendar"
                value={dateFormatted}
                editable={false}
                placeholder="Data"
                returnKeyType="next"
              />
            </TouchableOpacity>
          )}
          defaultValue=""
        />

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
            {companies.map((value) => (
              <Picker.Item
                key={value.id}
                color="#666"
                label={`${value.name}`}
                value={`${value.name}`}
              />
            ))}
          </Picker>
        </ChoiceCompany>

        <Controller
          control={control}
          name="description"
          render={({ onChange, value }) => (
            <Input
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
          defaultValue=""
        />
        <RegisterButton
          onPress={handleSubmit(handleSubmitButton)}
          disabled={showCalendar}
        >
          <RegisterButtonText>
            {loadingRequest ? (
              <ActivityIndicator color="#00ffff" size="small" />
            ) : (
              'CADASTRAR'
            )}
          </RegisterButtonText>
        </RegisterButton>
      </ScrollView>
      {showCalendar && <Calender handleDate={handleDateSubmit} />}
    </Container>
  );
};

export default RegisterNewOrder;
