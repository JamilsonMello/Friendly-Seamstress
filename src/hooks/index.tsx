import React from 'react';

import { AuthProvider } from './context/AuthProvider';
import { CompaniesProvider } from './context/CompaniesProvider';
import { TabBarShowedProvider } from './context/TabBarShowed';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <CompaniesProvider>
      <TabBarShowedProvider>{children}</TabBarShowedProvider>
    </CompaniesProvider>
  </AuthProvider>
);

export default AppProvider;
