import React from 'react';

import { ActivityIndicator } from 'react-native';

import { useAuth } from '../hooks/context/AuthProvider';
import StackRoutes from './home.stack.routes';
import AuthRoutes from './auth.stack.routes';

const Routes: React.FC = () => {
  const { loading, signed } = useAuth();

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#00FFFF"
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#040405',
        }}
      />
    );
  }

  return signed ? <StackRoutes /> : <AuthRoutes />;
};

export default Routes;
