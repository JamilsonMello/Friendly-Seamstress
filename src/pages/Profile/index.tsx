import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { FlatList, useWindowDimensions, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Feather';
import { firebase } from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

import { useCompany } from '../../hooks/context/CompaniesProvider';
import { numberFormat } from '../../utils/format';
import ModalFilter from '../../components/ModalFilter';

import {
  Container,
  ProfileView,
  ProfileImage,
  ProfileName,
  ProfileOffice,
  RegisterProductionButton,
  RegisterProductionButtonText,
  ViewHistory,
  ViewTextHistory,
  FilterButton,
  ProductionHistory,
  Quantity,
  TitleProduction,
  DateProduction,
  BottomView,
  ArrowDownContainer,
  TotalText,
  TotalValue,
  ButtonIcon,
} from './styles';

interface UserProps {
  user: {
    user_id: string;
    provider_id: string;
    name: string;
    whatsapp: number;
    office: string;
    avatar_url: string | null;
  };
}

interface HistoryProps {
  id: string;
  provider_id: string;
  company: string;
  received: Date;
  description: string;
  operation: string;
  pay_out: boolean;
  quantity: number;
  title: string;
  user_id: string;
  value: number;
  delivered: number | null;
  status: boolean;
}

interface SelectedDateProps {
  day: number;
  month: number;
  year: number;
  dateString: string;
}

interface DateProps {
  initialDate: Date;
  finalDate: Date;
}

interface DateFormattedProps {
  initialDate: string;
  finalDate: string;
}

type RootStackParamList = {
  Profile: UserProps;
};

type Props = StackScreenProps<RootStackParamList, 'Profile'>;

const Profile: React.FC<Props> = ({ route }) => {
  const [history, setHistory] = useState<HistoryProps[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState<DateProps>({} as DateProps);
  const [company, setCompany] = useState<string | undefined>('Todos');
  const [showTotal, setShowTotal] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [field, setField] = useState<number>();
  const [dateFormatted, setDateFormatted] = useState<DateFormattedProps>(
    {} as DateFormattedProps,
  );

  const { width } = useWindowDimensions();
  const { user } = route.params;

  const { navigate } = useNavigation();
  const { loadCompanies } = useCompany();

  const loadHistory = useCallback(async () => {
    const { docs } = await firebase
      .firestore()
      .collection('production')
      .where('provider_id', '==', `${user.provider_id}`)
      .where('user_id', '==', `${user.user_id}`)
      .where(
        'received',
        '>=',
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
      )
      .where('received', '<=', new Date(Date.now()).getTime())
      .orderBy('received', 'desc')
      .get();

    const dataArray = docs.map((data) => ({
      id: data.id,
      ...data.data(),
    }));

    setDate({} as DateProps);
    setDateFormatted({} as DateFormattedProps);
    setHistory(dataArray as HistoryProps[]);
  }, [user]);

  const { total, value } = useMemo(() => {
    const totalValue = history?.reduce(
      (acc, data) => ({
        total: acc.total += data.quantity,
        value: acc.value += data.value * data.quantity,
      }),
      { total: 0, value: 0 },
    );

    const totalSum = numberFormat(totalValue.value);

    return {
      total: totalValue.total,
      value: totalSum,
    };
  }, [history]);

  const handleFilterHistory = useCallback(async () => {
    if (!date.finalDate || !date.initialDate) {
      return;
    }

    const companyFilter =
      company === 'Todos'
        ? loadCompanies().map((data) => data.name)
        : [company];

    setModalVisible((state) => !state);

    const { docs } = await firebase
      .firestore()
      .collection('production')
      .where('provider_id', '==', `${user.provider_id}`)
      .where('user_id', '==', `${user.user_id}`)
      .where('received', '>=', date.initialDate.getTime())
      .where('received', '<=', date.finalDate.getTime())
      .where('company', 'in', companyFilter)
      .orderBy('received', 'desc')
      .get();

    const dataArray = docs.map((data) => ({
      id: data.id,
      ...data.data(),
    }));

    setDate({} as DateProps);
    setDateFormatted({} as DateFormattedProps);
    setHistory(dataArray as HistoryProps[]);
  }, [
    date.finalDate,
    date.initialDate,
    user.provider_id,
    user.user_id,
    company,
    loadCompanies,
  ]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDateSubmit = useCallback(
    (formattedDate: string, dateEvent: SelectedDateProps) => {
      const { day, month, year } = dateEvent;

      setDateFormatted({
        initialDate: field === 0 ? formattedDate : dateFormatted.initialDate,
        finalDate: field === 1 ? formattedDate : dateFormatted.finalDate,
      });

      setDate({
        initialDate:
          field === 0 ? new Date(year, month - 1, day) : date.initialDate,
        finalDate:
          field === 1 ? new Date(year, month - 1, day) : date.finalDate,
      });
    },
    [dateFormatted, field, date],
  );

  const handleFieldSelected = useCallback((fieldValue: number): void => {
    setField(fieldValue);
  }, []);

  const handleCompany = useCallback(
    (companySelected: string | undefined): void => {
      setCompany(companySelected);
    },
    [],
  );

  const handleUpdateStatus = useCallback(
    async (id, status): Promise<void> => {
      const historyUpdated: HistoryProps[] = history.map((data) => ({
        ...data,
        status: data.id === id ? !status : data.status,
        delivered: data.id === id && !status ? new Date().getTime() : null,
      }));

      setHistory(historyUpdated);
      await firebase
        .firestore()
        .collection('production')
        .doc(id)
        .update({
          delivered: !status ? new Date().getTime() : null,
          status: !status,
        });
    },
    [history],
  );

  const handleModalVisible = useCallback(() => {
    setModalVisible(!modalVisible);
    setDateFormatted({} as DateFormattedProps);
  }, [modalVisible]);

  const handleRefreshing = useCallback(() => {
    setRefreshing(true);
    loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  return (
    <Container>
      <ModalFilter
        handleFilterHistory={handleFilterHistory}
        visible={modalVisible}
        fieldSelected={handleFieldSelected}
        handleVisible={handleModalVisible}
        handleDateSubmit={handleDateSubmit}
        finalDate={dateFormatted.finalDate}
        initialDate={dateFormatted.initialDate}
        companySelected={handleCompany}
      />

      <ProfileView>
        <ProfileImage
          source={{
            uri:
              user.avatar_url ||
              'https://api.adorable.io/avatars/50/abott@adorable.png',
          }}
        />
        <ProfileName>{user.name}</ProfileName>
        <ProfileOffice>{user.office}</ProfileOffice>

        <RegisterProductionButton
          onPress={() => navigate('RegisterProduction', { user })}
        >
          <RegisterProductionButtonText>Cadastrar</RegisterProductionButtonText>
        </RegisterProductionButton>

        <ViewHistory widthSize={width}>
          <ViewTextHistory>Histórico</ViewTextHistory>

          <TouchableOpacity
            hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
            onPress={() => setShowTotal((state) => !state)}
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              left: (width - 60) / 2,
            }}
          >
            <Icon
              name={`${!showTotal ? 'chevron-down' : 'chevron-up'}`}
              size={25}
              color="#fff"
            />
          </TouchableOpacity>
          <FilterButton
            hitSlop={{ left: 20, right: 10 }}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <Icon name="sliders" size={20} color="#fff" />
          </FilterButton>
        </ViewHistory>
      </ProfileView>

      {showTotal && (
        <ArrowDownContainer>
          <TotalText>{`Total: ${total}`}</TotalText>
          <TotalValue>{value}</TotalValue>
        </ArrowDownContainer>
      )}

      <FlatList
        data={history}
        onRefresh={handleRefreshing}
        refreshing={refreshing}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <ProductionHistory
            lastItem={history.length - 1 === index}
            onPress={() => {
              navigate('Details', { item, collection: 'production' });
            }}
          >
            <TitleProduction>
              {`${item.title.replace(
                item.title.charAt(0),
                item.title.charAt(0).toUpperCase(),
              )}  |  ${item.company.replace(
                item.company.charAt(0),
                item.company.charAt(0).toUpperCase(),
              )}`}
            </TitleProduction>
            <ButtonIcon
              hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
              onPress={() => handleUpdateStatus(item.id, item.status)}
            >
              <Icon
                name="check-circle"
                size={20}
                color={item.status ? '#2EE022' : '#ddd3'}
              />
            </ButtonIcon>
            <BottomView>
              <Quantity>
                Quantidate:
                {` ${item.quantity}`}
              </Quantity>
              <DateProduction>
                {format(item.received, "dd'/'MM'/'yyyy")}
              </DateProduction>
            </BottomView>
          </ProductionHistory>
        )}
      />
    </Container>
  );
};

export default Profile;
