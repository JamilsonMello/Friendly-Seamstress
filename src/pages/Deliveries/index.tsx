import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  FlatList,
  SafeAreaView,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { firebase } from '@react-native-firebase/firestore';
import { format } from 'date-fns';

import months from '../../DATA/months';
import { useTabShow } from '../../hooks/context/TabBarShowed';
import { useAuth } from '../../hooks/context/AuthProvider';
import { numberFormat } from '../../utils/format';
import { useCompany } from '../../hooks/context/CompaniesProvider';
import ModalFilter from '../../components/ModalFilter';

import {
  Container,
  VictoryChartContainer,
  NewOrderButton,
  NewOrderButtonText,
  ButtonIcon,
  ProductItem,
  ProductTopView,
  ProductBottomView,
  ProductTitle,
  ProductAmount,
  ProductDate,
  MonthsView,
  MonthButton,
  MonthButtonText,
  ViewNone,
  ViewTextNone,
  ArrowDownContainer,
  TotalText,
  TotalValue,
} from './styles';

interface dataArrayProps {
  x: number;
  y: number;
}

interface SelectedDateProps {
  day: number;
  month: number;
  year: number;
  dateString: string;
}

interface HistoryProps {
  id: string;
  provider_id: string;
  company: string;
  received: Date;
  description: string;
  delivered: Date | null | number;
  pay_out: boolean;
  quantity: number;
  title: string;
  value: number;
  status: boolean;
}

interface DatesFormattedProps {
  initialDate: string;
  finalDate: string;
}

interface CompareDateProps {
  initial: Date;
  final: Date;
}

const Deliveries: React.FC = () => {
  const [history, setHistory] = useState<HistoryProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistoryList, setLoadingHistoryList] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showTotal, setShowTotal] = useState<boolean>(false);
  const [field, setField] = useState<number>(0);
  const [openCalendar, setOpenCalendar] = useState(0);
  const [getMonthToSearch, setGetMonthToSearch] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [company, setCompany] = useState<string | undefined>('Todos');
  const [compareDate, setCompareDate] = useState<CompareDateProps>(
    {} as CompareDateProps,
  );
  const [filterDatesFormatted, setFilterDatesFormatted] = useState<
    DatesFormattedProps
  >({} as DatesFormattedProps);

  const { height, width } = useWindowDimensions();
  const { enableTabBar } = useTabShow();
  const { provider } = useAuth();
  const { navigate } = useNavigation();
  const { loadCompanies } = useCompany();

  useFocusEffect(
    useCallback(() => {
      return () => enableTabBar(true);
    }, [enableTabBar]),
  );

  const handleDateSubmit = useCallback(
    (formattedDate: string, dateEvent: SelectedDateProps) => {
      const { day, month, year } = dateEvent;

      setFilterDatesFormatted({
        initialDate:
          field === 0 ? formattedDate : filterDatesFormatted.initialDate,
        finalDate: field === 1 ? formattedDate : filterDatesFormatted.finalDate,
      });

      setCompareDate({
        initial:
          field === 0 ? new Date(year, month - 1, day) : compareDate.initial,
        final: field === 1 ? new Date(year, month - 1, day) : compareDate.final,
      });
    },
    [field, filterDatesFormatted, compareDate],
  );

  const handleFieldSelected = useCallback((fieldValue: number): void => {
    setField(fieldValue);
  }, []);

  const handleUpdateStatus = useCallback(
    async (id, status): Promise<void> => {
      const historyUpdated: HistoryProps[] = history.map((value) => ({
        ...value,
        status: value.id === id ? !status : value.status,
        delivered: value.id === id && !status ? new Date().getTime() : null,
      }));

      setHistory(historyUpdated);
      await firebase
        .firestore()
        .collection('orders')
        .doc(id)
        .update({
          delivered: !status ? new Date().getTime() : null,
          status: !status,
        });
    },
    [history],
  );

  const handleData = useMemo((): dataArrayProps[] | undefined => {
    let datePass: number = new Date(Date.now()).getDate();
    let quantityPass = 0;

    if (history[0]) {
      const dataSet = Array.from(history, (value) => {
        if (datePass === new Date(value.received).getDate()) {
          quantityPass += value.quantity;
          return {
            x: new Date(value.received).getDate(),
            y: quantityPass,
          };
        }

        datePass = new Date(value.received).getDate();
        quantityPass = value.quantity;

        return {
          x: new Date(value.received).getDate(),
          y: quantityPass,
        };
      }).filter((value, index, self) => value.x !== self[index + 1]?.x);

      return dataSet;
    }

    return undefined;
  }, [history]);

  const handleTotalValue = useMemo(() => {
    const totalValue = history?.reduce(
      (acc, value) => ({
        total: acc.total += value.quantity,
        value: acc.value += value.value * value.quantity,
      }),
      { total: 0, value: 0 },
    );

    const value = numberFormat(totalValue.value);

    return {
      total: totalValue.total,
      value,
    };
  }, [history]);

  const loadHistory = useCallback(
    async (month) => {
      setLoadingHistoryList(true);
      setGetMonthToSearch(month || new Date().getMonth() + 1);
      const year = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      let startDate;
      let endDate;

      if (month) {
        startDate = new Date(year, month - 1, 1)
        endDate = new Date(year, month, 0);
      } else {
        startDate = new Date(year, currentMonth, 1)
        endDate = new Date(year, currentMonth + 1, 0);
      }

      const { docs } = await firebase
        .firestore()
        .collection('orders')
        .where('provider_id', '==', `${provider.uid}`)
        .where('received', '>=', startDate.getTime())
        .where('received', '<=', endDate.getTime())
        .orderBy('received', 'desc')
        .get();

      const dataOrders = docs.map((data) => ({
        id: data.id,
        ...data.data(),
      }));

      setHistory(dataOrders as HistoryProps[]);
      setLoading(false);
      setLoadingHistoryList(false);
    },
    [provider.uid],
  );

  const handleModalVisible = useCallback(() => {
    setModalVisible(!modalVisible);
  }, [modalVisible]);

  const handleCompany = useCallback(
    (companySelected: string | undefined): void => {
      setCompany(companySelected);
    },
    [],
  );

  const handleFilterHistory = useCallback(async (): Promise<void> => {
    setLoadingHistoryList(true);

    if (!compareDate.initial || !compareDate.final) {
      setLoadingHistoryList(false);

      return;
    }
    setGetMonthToSearch(compareDate.initial.getMonth() + 1);

    setModalVisible(false);

    const companyFilter =
      company === 'Todos'
        ? loadCompanies().map((data) => data.name)
        : [company];

    const { docs } = await firebase
      .firestore()
      .collection('orders')
      .where('provider_id', '==', `${provider.uid}`)
      .where('received', '>=', compareDate.initial.getTime())
      .where('received', '<=', compareDate.final.getTime())
      .where('company', 'in', companyFilter)
      .orderBy('received', 'desc')
      .get();

    const dataOrders = docs.map((data) => ({
      id: data.id,
      ...data.data(),
    }));

    setHistory(dataOrders as HistoryProps[]);
    setLoading(false);
    setFilterDatesFormatted({} as DatesFormattedProps);
    setLoadingHistoryList(false);
  }, [provider.uid, compareDate, company, loadCompanies]);

  const handleRefreshing = useCallback(async () => {
    setRefreshing(true);
    await loadHistory(getMonthToSearch);
    setRefreshing(false);
  }, [loadHistory, getMonthToSearch]);

  const handleLongPress = useCallback(
    (id) => {
      if (id !== getMonthToSearch) return;
      setModalVisible(true);
      setCompareDate({} as CompareDateProps);
      setGetMonthToSearch(id);
      setOpenCalendar(id);
      Vibration.vibrate(200);
    },
    [getMonthToSearch],
  );

  const getItemLayout = useCallback((data, index) => {
    return {
      length: 58,
      offset: 58 * index,
      index,
    };
  }, []);

  useEffect(() => {
    loadHistory(getMonthToSearch);
  }, [loadHistory, getMonthToSearch]);

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
    <SafeAreaView style={{ flex: 1 }}>
      <Container>
        {history.length === 0 ? (
          <ViewNone>
            <ViewTextNone>Sem Registro</ViewTextNone>
          </ViewNone>
        ) : (
          <VictoryChartContainer>
            <VictoryChart
              minDomain={{ y: 0 }}
              height={200}
              width={width - 30}
              padding={35}
            >
              <VictoryAxis
                label="Dias"
                orientation="bottom"
                tickFormat={(v) => Math.round(v)}
                style={{
                  axisLabel: {
                    fill: '#fff',
                    padding: 18,
                  },
                  tickLabels: {
                    fill: '#fff',
                    padding: 5,
                    fontSize: 10,
                    fontWeight: 600,
                  },
                }}
              />
              <VictoryBar
                style={{
                  data: {
                    stroke: '#00FFFF',
                    strokeWidth: 2,
                  },
                }}
                x="x"
                y="y"
                animate={{
                  duration: 3000,
                  onLoad: { duration: 3000 },
                }}
                data={handleData}
              />
            </VictoryChart>
          </VictoryChartContainer>
        )}
        <MonthsView>
          <FlatList
            initialScrollIndex={getMonthToSearch - 1}
            getItemLayout={getItemLayout}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={months}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
              <MonthButton
                selected={getMonthToSearch === index + 1}
                key={item.id}
                onLongPress={() => handleLongPress(item.id)}
                onPress={() => loadHistory(item.id)}
              >
                <MonthButtonText>{item.month}</MonthButtonText>
              </MonthButton>
            )}
          />

          <NewOrderButton onPress={() => navigate('RegisterNewOrder')}>
            <NewOrderButtonText>Novo Pedido</NewOrderButtonText>
          </NewOrderButton>
        </MonthsView>

        <TouchableOpacity
          hitSlop={{ left: 10, right: 10, bottom: 10, top: 10 }}
          onPress={() => setShowTotal((state) => !state)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: 35,
          }}
        >
          <Icon
            name={`${!showTotal ? 'chevron-down' : 'chevron-up'}`}
            size={25}
            color="#fff"
          />
        </TouchableOpacity>

        {showTotal && (
          <ArrowDownContainer>
            <TotalText>{`Total:  ${handleTotalValue.total}`}</TotalText>
            <TotalValue>{`${handleTotalValue.value}`}</TotalValue>
          </ArrowDownContainer>
        )}

        {loadingHistoryList ? (
          <ActivityIndicator
            style={{ marginVertical: height / 4 }}
            color="#00ffff"
            size="small"
          />
        ) : (
          <FlatList
            data={history}
            scrollEventThrottle={16}
            onRefresh={handleRefreshing}
            refreshing={refreshing}
            contentContainerStyle={{ paddingBottom: 10 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <ProductItem
                key={item.id}
                onPress={() => {
                  navigate('Details', { item, collection: 'orders' });
                }}
              >
                <ProductTopView>
                  <ProductTitle>{`${item.title}  |  ${item.company}`}</ProductTitle>
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
                </ProductTopView>
                <ProductBottomView>
                  <ProductAmount>
                    {'Quantidade: '}
                    {item.quantity}
                  </ProductAmount>
                  <ProductDate>
                    {format(item.received, "dd'/'MM'/'yyyy")}
                  </ProductDate>
                </ProductBottomView>
              </ProductItem>
            )}
          />
        )}

        <ModalFilter
          handleFilterHistory={handleFilterHistory}
          visible={modalVisible}
          fieldSelected={handleFieldSelected}
          handleVisible={handleModalVisible}
          handleDateSubmit={handleDateSubmit}
          finalDate={filterDatesFormatted.finalDate}
          initialDate={filterDatesFormatted.initialDate}
          companySelected={handleCompany}
          openCalendar={openCalendar}
        />
      </Container>
    </SafeAreaView>
  );
};

export default React.memo(Deliveries);
