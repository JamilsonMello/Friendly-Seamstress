import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';

import Input from '../Input';

import { Container } from './styled';

interface DataForm {
  title: string;
  quantity: string;
  value: string;
  date: string;
  description: string;
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

const ContainerFields: React.FC = () => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

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

  return (
    <Container
      keyboardShouldPersistTaps="always"
      canCancelContentTouches={false}
      showsVerticalScrollIndicator={false}
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
          <TouchableOpacity onPress={() => setShowCalendar((state) => !state)}>
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
      {showCalendar && <Calender handleDate={handleDateSubmit} />}
    </Container>
  );
};

export default ContainerFields;
