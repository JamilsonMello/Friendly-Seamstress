import React, {useRef, useState, useCallback} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers';
import {TextInput, ActivityIndicator, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as yup from 'yup';
import * as Animation from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/firestore';

import Input from '../../components/Input';
import {useAuth} from '../../hooks/context/AuthProvider';

import {Container, RegisterButton, RegisterButtonText} from './styles';

interface DataForm {
  name: string;
  whatsapp: string;
  office: string;
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

const RegisterUser: React.FC = () => {
  const officeRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);

  const {navigate} = useNavigation();
  const {provider} = useAuth();

  const schema = yup.object().shape({
    name: yup.string().required('O nome é obrigatório'),
    office: yup.string().required('O cargo é obrigatório'),
    whatsapp: yup
      .number()
      .integer()
      .positive('Digite apenas números positivos')
      .required('Campo obrigatório! Apenas números são permitidos')
      .typeError('Digite apenas números'),
  });

  const {handleSubmit, errors, control, setValue} = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const handleSubmitButton = useCallback(
    async ({name, office, whatsapp}: DataForm): Promise<void> => {
      setValue('name', '');
      setValue('office', '');
      setValue('whatsapp', '');
      Keyboard.dismiss();
      setLoading(true);

      await firebase.firestore().collection('users').add({
        name,
        whatsapp,
        office,
        avatar_url: null,
        provider_id: provider.uid,
      });

      navigate('Home');
    },
    [setValue, setLoading, navigate, provider],
  );

  return (
    <Container>
      <AnimationIcon
        delay={350}
        useNativeDriver
        animation={zoomIn}
        name="user-plus"
        size={80}
        color="#1a1a1d"
        style={{marginBottom: 30, alignSelf: 'center'}}
      />

      <Animation.View delay={300} useNativeDriver animation="bounceInLeft">
        <Controller
          control={control}
          name="name"
          defaultValue=""
          render={({onChange, value}) => (
            <Input
              erro={errors?.name}
              icon="user"
              value={value}
              autoFocus
              placeholder="Nome"
              returnKeyType="next"
              onChangeText={(text: string) => onChange(text)}
              onSubmitEditing={() => officeRef.current?.focus()}
            />
          )}
        />
      </Animation.View>

      <Animation.View delay={340} useNativeDriver animation="bounceInLeft">
        <Controller
          control={control}
          name="office"
          defaultValue=""
          render={({onChange, value}) => (
            <Input
              ref={officeRef}
              erro={errors?.name}
              icon="briefcase"
              value={value}
              placeholder="Cargo"
              returnKeyType="next"
              onChangeText={(text: string) => onChange(text)}
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
          )}
        />
      </Animation.View>

      <Animation.View delay={380} useNativeDriver animation="bounceInRight">
        <Controller
          control={control}
          name="whatsapp"
          defaultValue=""
          render={({onChange, value}) => (
            <Input
              ref={phoneRef}
              erro={errors?.whatsapp}
              icon="phone"
              placeholder="Whatsapp (DDD) 9xxxx-xxxx"
              value={value}
              keyboardType="numeric"
              textContentType="telephoneNumber"
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
    </Container>
  );
};

export default RegisterUser;
