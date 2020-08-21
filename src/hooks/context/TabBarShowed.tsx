import React, { createContext, useState, useContext, useCallback } from 'react';

interface TabBarShowedProps {
  tabShow: boolean;
  enableTabBar(value: boolean): void;
}

const TabBarShowed = createContext({} as TabBarShowedProps);

const TabBarShowedProvider: React.FC = ({ children }) => {
  const [tabShow, setTabShow] = useState<boolean>(true);

  const enableTabBar = useCallback(
    (value: boolean) => {
      setTabShow(value);
    },
    [setTabShow],
  );

  return (
    <TabBarShowed.Provider value={{ tabShow, enableTabBar }}>
      {children}
    </TabBarShowed.Provider>
  );
};

function useTabShow(): TabBarShowedProps {
  const context = useContext(TabBarShowed);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}

export { TabBarShowedProvider, useTabShow };
