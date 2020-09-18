import React, {createContext, useContext, useCallback, useState} from 'react';

interface CompaniesProps {
  id: string;
  adress: string;
  city: string;
  name: string;
  provider_id: string;
  state: string;
}

interface CompaniesProviderProps {
  saveComapanies(data: CompaniesProps[]): void;
  loadCompanies(): CompaniesProps[];
}

const CompanyContext = createContext<CompaniesProviderProps>(
  {} as CompaniesProviderProps,
);

const CompaniesProvider: React.FC = ({children}) => {
  const [companies, setCompanies] = useState<CompaniesProps[]>(
    [] as CompaniesProps[],
  );

  const saveComapanies = useCallback((data: CompaniesProps[]): void => {
    const allCompanies = {
      id: 'all',
      adress: 'all',
      city: 'all',
      name: 'Todos',
      provider_id: 'all',
      state: 'all',
    };
    setCompanies([allCompanies, ...data]);
  }, []);

  const loadCompanies = useCallback((): CompaniesProps[] => {
    return companies;
  }, [companies]);

  return (
    <CompanyContext.Provider value={{saveComapanies, loadCompanies}}>
      {children}
    </CompanyContext.Provider>
  );
};

function useCompany(): CompaniesProviderProps {
  const context = useContext(CompanyContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}

export {CompaniesProvider, useCompany};
