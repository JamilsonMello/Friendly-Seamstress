import React, { useState, useCallback, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import * as Animation from 'react-native-animatable';
import { firebase } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import Input from '../../components/Input';
import { useAuth } from '../../hooks/context/AuthProvider';
import { useCompany } from '../../hooks/context/CompaniesProvider';

import { Container, RegisterButton, RegisterButtonText } from './styles';

interface DataForm {
  address: string;
  city: string;
  state: string;
  name: string;
  date: Date;
  provider_id: string;
}

interface CompaniesProps {
  id: string;
  adress: string;
  city: string;
  name: string;
  provider_id: string;
  state: string;
}

const schema = yup.object().shape({
  address: yup.string().required('Campo obrigatório'),
  name: yup.string().required('O nome é obrigatório'),
  city: yup.string().required('Campo é obrigatório'),
  state: yup.string().required('Campo obrigatório'),
});

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

const RegisterCompany: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);

  const { provider } = useAuth();
  const { saveComapanies } = useCompany();
  const { goBack } = useNavigation();

  const { handleSubmit, errors, control, setValue, clearErrors } = useForm<
    DataForm
  >({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const handleSubmitButton = useCallback(
    async ({ address, city, name, state }: DataForm): Promise<void> => {
      setLoading(true);

      setValue('name', '');
      setValue('address', '');
      setValue('city', '');
      setValue('state', '');

      await firebase
        .firestore()
        .collection('company')
        .add({
          name,
          address,
          city,
          state,
          date: new Date(Date.now()).getTime(),
          provider_id: provider.uid,
        });
      setLoading(false);
      goBack();

      const companiesData = await firebase
        .firestore()
        .collection('company')
        .where('provider_id', '==', `${provider.uid}`)
        .orderBy('name', 'desc')
        .get();

      const dataCompanies = companiesData.docs.map((data) => ({
        id: data.id,
        ...data.data(),
      }));

      saveComapanies(dataCompanies as CompaniesProps[]);

      clearErrors();
    },
    [setValue, clearErrors, provider, saveComapanies, goBack],
  );

  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        canCancelContentTouches={false}
      >
        <AnimationIcon
          delay={350}
          useNativeDriver
          animation={zoomIn}
          name="home"
          size={140}
          color="#1a1a1d"
          style={{ margin: 20, alignSelf: 'center' }}
        />

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="name"
            defaultValue=""
            render={({ onChange, value }) => (
              <Input
                erro={errors?.name}
                icon="type"
                value={value}
                placeholder="Nome da empresa"
                returnKeyType="next"
                onChangeText={(text: string) => onChange(text)}
                onSubmitEditing={() => addressRef.current?.focus()}
              />
            )}
          />
        </Animation.View>

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="address"
            defaultValue=""
            render={({ onChange, value }) => (
              <Input
                ref={addressRef}
                erro={errors?.address}
                icon="square"
                value={value}
                placeholder="Endereço"
                returnKeyType="next"
                onChangeText={(text: string) => onChange(text)}
                onSubmitEditing={() => cityRef.current?.focus()}
              />
            )}
          />
        </Animation.View>

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="city"
            defaultValue=""
            render={({ onChange, value }) => (
              <Input
                ref={cityRef}
                erro={errors?.city}
                icon="map"
                value={value}
                placeholder="Cidade"
                returnKeyType="next"
                onChangeText={(text: string) => onChange(text)}
                onSubmitEditing={() => stateRef.current?.focus()}
              />
            )}
          />
        </Animation.View>

        <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
          <Controller
            control={control}
            name="state"
            defaultValue=""
            render={({ onChange, value }) => (
              <Input
                ref={stateRef}
                erro={errors?.state}
                icon="map-pin"
                value={value}
                placeholder="Estado"
                returnKeyType="send"
                onChangeText={(text: string) => onChange(text)}
                onSubmitEditing={handleSubmit(handleSubmitButton)}
              />
            )}
          />
        </Animation.View>

        <Animation.View delay={420} useNativeDriver animation="bounceIn">
          <RegisterButton onPress={handleSubmit(handleSubmitButton)}>
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
    </Container>
  );
};

export default RegisterCompany;
