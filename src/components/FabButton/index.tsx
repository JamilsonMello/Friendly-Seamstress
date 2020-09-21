import React, { useCallback, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableWithoutFeedbackProps, Animated } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { Container, CompanyButton, RegisterButton, AddButton } from './styles';

const AnimatedCompanyButton = Animated.createAnimatedComponent(CompanyButton);
const AnimatedRegisterButton = Animated.createAnimatedComponent(RegisterButton);
const AnimatedAddButton = Animated.createAnimatedComponent(AddButton);

const FabButton: React.FC<TouchableWithoutFeedbackProps> = ({ ...rest }) => {
  const [open, setOpen] = useState<boolean>(false);

  const animation = useRef(new Animated.Value(0)).current;
  const { navigate } = useNavigation();

  const handleToggle = useCallback(() => {
    const toValue = open ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();

    setOpen((state) => !state);
  }, [animation, open]);

  return (
    <Container>
      {open && (
        <>
          <TouchableWithoutFeedback
            onPress={() => {
              handleToggle();
              navigate('RegisterCompany');
            }}
          >
            <AnimatedCompanyButton
              style={{
                transform: [
                  {
                    scale: animation,
                  },
                ],
              }}
            >
              <Icon name="home" size={30} color="#ddd" />
            </AnimatedCompanyButton>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() => {
              handleToggle();
              navigate('RegisterUser');
            }}
          >
            <AnimatedRegisterButton
              style={{
                transform: [
                  {
                    scale: animation,
                  },
                ],
              }}
            >
              <Icon name="user-plus" size={30} color="#ddd" />
            </AnimatedRegisterButton>
          </TouchableWithoutFeedback>
        </>
      )}

      <TouchableWithoutFeedback {...rest} onPress={() => handleToggle()}>
        <AnimatedAddButton
          style={{
            transform: [
              {
                rotate: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '45deg'],
                }),
              },
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.9],
                }),
              },
            ],
          }}
        >
          <Icon name="plus" size={30} color={`${open ? '#00FFFF' : '#ddd'}`} />
        </AnimatedAddButton>
      </TouchableWithoutFeedback>
    </Container>
  );
};

export default FabButton;
