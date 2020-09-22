import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { firebase } from '@react-native-firebase/firestore';

import FabButton from '../../components/FabButton';
import { useAuth } from '../../hooks/context/AuthProvider';
import { useCompany } from '../../hooks/context/CompaniesProvider';

import {
  Container,
  User,
  ViewLeft,
  UserImage,
  UserHeader,
  Title,
  Office,
} from './styles';

interface UserProps {
  user_id: string;
  provider_id?: string;
  name?: string;
  whatsapp?: number;
  office?: string;
  avatar_url?: string | null;
}

interface CompaniesProps {
  id: string;
  adress: string;
  city: string;
  name: string;
  provider_id: string;
  state: string;
}

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState<UserProps[]>([] as UserProps[]);

  const { provider } = useAuth();
  const { navigate } = useNavigation();
  const { saveComapanies } = useCompany();

  const loadData = useCallback(async () => {
    const [usersData, companiesData] = await Promise.all([
      firebase
        .firestore()
        .collection('users')
        .where('provider_id', '==', `${provider.uid}`)
        .get(),
      firebase
        .firestore()
        .collection('company')
        .where('provider_id', '==', `${provider.uid}`)
        .orderBy('name', 'desc')
        .get(),
    ]);

    const dataArray = usersData.docs.map((data) => ({
      user_id: data.id,
      ...data.data(),
    }));

    const dataCompanies = companiesData.docs.map((data) => ({
      id: data.id,
      ...data.data(),
    }));

    console.log(dataCompanies);

    saveComapanies(dataCompanies as CompaniesProps[]);

    setUsers(dataArray);
    setLoading(false);
  }, [provider, saveComapanies]);

  const handleRefreshing = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  return (
    <Container>
      <FlatList
        data={users}
        onRefresh={handleRefreshing}
        refreshing={refreshing}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.user_id)}
        renderItem={({ item }) => (
          <User
            key={item.user_id}
            onPress={() => navigate('Profile', { user: item })}
          >
            <ViewLeft>
              <UserImage
                source={{
                  uri:
                    item.avatar_url ||
                    'https://api.adorable.io/avatars/50/abott@adorable.png',
                }}
              />

              <UserHeader>
                <Title>{item.name}</Title>
                <Office>{item?.office || 'Cargo não definido'}</Office>
              </UserHeader>
            </ViewLeft>

            <TouchableOpacity>
              <Icon name="more-vertical" size={30} color="#ddd" />
            </TouchableOpacity>
          </User>
        )}
      />

      <FabButton />
    </Container>
  );
};

export default Home;
