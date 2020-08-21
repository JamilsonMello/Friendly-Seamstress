import React, { useRef, useCallback, useState } from 'react';
import {
  TextInput,
  Alert,
  ActivityIndicator,
  Keyboard,
  Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';

import Input from '../../components/Input';
import { Container, LoginButton, LoginButtonText } from './styles';
import { useAuth } from '../../hooks/context/AuthProvider';
import logo from '../../assets/logo.png';

interface DataForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const passwordRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();

  const schema = yup.object().shape({
    email: yup.string().email().required('Email inválido'),
    password: yup
      .string()
      .trim('Sem espaços')
      .min(8)
      .required('Campo obrigatório com mínimo de 8 caracteres')
      .typeError('Mínimo 8 números'),
  });

  const { handleSubmit, control, errors } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const handleSubmitButton = useCallback(
    async ({ email, password }: DataForm): Promise<void> => {
      setLoading(true);
      Keyboard.dismiss();

      try {
        await signIn({ email, password });
      } catch {
        setLoading(false);
        Alert.alert(
          'Error ao fazer login',
          'Por favor, tente novamente fazer login na sua conta',
        );
      }
    },
    [signIn],
  );

  return (
    <Container>
      <Image
        source={logo}
        resizeMode="contain"
        style={{
          width: 200,
          height: 190,
          alignSelf: 'center',
        }}
      />

      <Controller
        control={control}
        defaultValue=""
        name="email"
        render={({ value, onChange }) => (
          <Input
            erro={errors.email}
            icon="mail"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Email"
            value={value}
            returnKeyType="next"
            onChangeText={(text) => onChange(text)}
            onSubmitEditing={() => passwordRef.current?.focus()}
            defaultValue=""
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        defaultValue=""
        render={({ onChange, value }) => (
          <Input
            ref={passwordRef}
            erro={errors.password}
            icon="lock"
            value={value}
            placeholder="Password"
            returnKeyType="send"
            onChangeText={(text) => onChange(text)}
            onSubmitEditing={handleSubmit(handleSubmitButton)}
            secureTextEntry
            defaultValue=""
          />
        )}
      />

      <LoginButton onPress={handleSubmit(handleSubmitButton)}>
        <LoginButtonText>
          {loading ? (
            <ActivityIndicator color="#00ffff" size="small" />
          ) : (
            'Login'
          )}
        </LoginButtonText>
      </LoginButton>
    </Container>
  );
};

export default Login;
