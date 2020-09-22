import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import {
  FlatList,
  SafeAreaView,
  Modal,
  useWindowDimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Vibration,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { VictoryChart, VictoryBar, VictoryAxis } from 'victory-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CalendarList } from 'react-native-calendars';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import * as yup from 'yup';
import { firebase } from '@react-native-firebase/firestore';
import { format } from 'date-fns';
import { Picker } from '@react-native-community/picker';

import months from '../../DATA/months';
import { useTabShow } from '../../hooks/context/TabBarShowed';
import { useAuth } from '../../hooks/context/AuthProvider';
import Input from '../../components/Input';
import { numberFormat } from '../../utils/format';
import { useCompany } from '../../hooks/context/CompaniesProvider';
import Calendar from '../../components/Calender';
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
  CloseButton,
  RegisterNewOrderView,
  RegisterButton,
  RegisterButtonText,
  ViewNone,
  ViewTextNone,
  FilterView,
  ButtonFieldDate,
  Title,
  ConfirmButton,
  ConfirmButtonText,
  ArrowDownContainer,
  TotalText,
  TotalValue,
  ChoiceCompany,
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

interface DataForm {
  title: string;
  quantity: string;
  value: number;
  date: Date;
  description: string;
}

interface DatesFormattedProps {
  initialDate: string;
  finalDate: string;
}

interface CompareDateProps {
  initial: Date;
  final: Date;
}

const schema = yup.object().shape({
  title: yup.string().required('O nome é obrigatório'),
  quantity: yup
    .number()
    .integer()
    .positive('Digite apenas números positivos')
    .required('Campo obrigatório! Apenas números são permitidos')
    .typeError('Campo obrigatório! Digite apenas números'),
  value: yup
    .number()
    .required('Campo obrigatório! Apenas números são permitidos')
    .typeError('Campo obrigatório! Digite apenas números'),
  date: yup
    .date()
    .required('Campo obrigatório!')
    .typeError('Campo obrigatório'),
  description: yup.string().default('Sem descrição'),
});

const Deliveries: React.FC = () => {
  const [history, setHistory] = useState<HistoryProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistoryList, setLoadingHistoryList] = useState(true);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showTotal, setShowTotal] = useState<boolean>(false);
  const [field, setField] = useState<number>(0);
  const [openCalendar, setOpenCalendar] = useState(0);
  const [filter, setFilter] = useState(false);
  const [selectedValue, setSelectedValue] = useState<React.ReactText>('');
  const [getMonthToSearch, setGetMonthToSearch] = useState<number>();
  const [company, setCompany] = useState<string | undefined>('Todos');
  const [compareDate, setCompareDate] = useState<CompareDateProps>(
    {} as CompareDateProps,
  );
  const [dateFormatted, setDateFormatted] = useState('');
  const [filterDatesFormatted, setFilterDatesFormatted] = useState<
    DatesFormattedProps
  >({} as DatesFormattedProps);
  const [selectedDate, setSelectDate] = useState<SelectedDateProps>(
    {} as SelectedDateProps,
  );

  const quantityRef = useRef<TextInput>(null);
  const valueRef = useRef<TextInput>(null);
  const companyRef = useRef<TextInput>(null);

  const { height, width } = useWindowDimensions();
  const { enableTabBar } = useTabShow();
  const { provider } = useAuth();
  const { navigate } = useNavigation();
  const { loadCompanies } = useCompany();

  const {
    handleSubmit,
    errors,
    control,
    reset,
    setValue,
    clearErrors,
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

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

  const handleSubmitButton = useCallback(
    async ({
      title,
      quantity,
      value,
      description,
    }: DataForm): Promise<void> => {
      setLoadingRequest(true);
      const { day, month, year } = selectedDate;

      setValue('title', '');
      setValue('quantity', '');
      setValue('value', undefined);
      setValue('date', undefined);
      setValue('description', '');
      setDateFormatted('');

      // Keyboard.dismiss();

      await firebase
        .firestore()
        .collection('orders')
        .add({
          title,
          quantity,
          value,
          company: selectedValue || loadCompanies()[0].name,
          received: new Date(year, month - 1, day).getTime(),
          description,
          provider_id: provider.uid,
          pay_out: false,
          delivered: null,
          status: false,
        });

      setLoadingRequest(false);
      setModalVisible(false);
      setSelectedValue('');
      clearErrors();
      setSelectDate({} as SelectedDateProps);
    },
    [
      setValue,
      provider.uid,
      selectedDate,
      loadCompanies,
      clearErrors,
      selectedValue,
    ],
  );

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
      const year = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      const startDate = new Date(year, month - 1 || currentMonth, 1);
      const endDate = new Date(year, month || currentMonth + 1, 0);

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
      setGetMonthToSearch(startDate.getMonth() + 1);
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
    setSelectedValue('');
    setFilterDatesFormatted({} as DatesFormattedProps);
    setLoadingHistoryList(false);
    setFilter(false);
  }, [provider.uid, compareDate, company, loadCompanies]);

  const handleRefreshing = useCallback(async () => {
    setRefreshing(true);
    await loadHistory(getMonthToSearch);
    setRefreshing(false);
  }, [loadHistory, getMonthToSearch]);

  const handleLongPress = useCallback(
    (id) => {
      if (id !== getMonthToSearch) return;
      setFilter(true);
      setModalVisible(true);
      setCompareDate({} as CompareDateProps);
      setGetMonthToSearch(id);
      setOpenCalendar(id);
      Vibration.vibrate(200);
    },
    [getMonthToSearch],
  );

  useEffect(() => {
    loadHistory(getMonthToSearch);
    reset(undefined);
  }, [loadHistory, getMonthToSearch, reset]);

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
            initialScrollIndex={getMonthToSearch}
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

          <NewOrderButton
            onPress={() => {
              setOpenCalendar(new Date().getMonth() + 1);
              setModalVisible((state) => !state);
            }}
          >
            <NewOrderButtonText>Novo Pedido</NewOrderButtonText>
          </NewOrderButton>
        </MonthsView>

        {showTotal && (
          <ArrowDownContainer>
            <TotalText>{`Total:  ${handleTotalValue.total}`}</TotalText>
            <TotalValue>{`${handleTotalValue.value}`}</TotalValue>
          </ArrowDownContainer>
        )}

        <TouchableOpacity
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
                onPress={() => navigate('Details', { item })}
              >
                <ProductTopView>
                  <ProductTitle>{`${item.title}  |  ${item.company}`}</ProductTitle>
                  <ButtonIcon
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

        {/* <Modal visible={modalVisible} animationType="slide" transparent>
          {filter ? ( */}
        <>
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
        </>
        {/* ) : (
            <RegisterNewOrderView
              keyboardShouldPersistTaps="always"
              canCancelContentTouches={false}
              pinchGestureEnabled={!showCalendar}
            >
              <CloseButton
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setDateFormatted('');
                }}
              >
                <Icon
                  color="#999"
                  size={25}
                  name="x"
                  style={{ position: 'relative' }}
                />
              </CloseButton>

              <Controller
                control={control}
                name="title"
                render={({ onChange, value }) => (
                  <Input
                    erro={errors?.title}
                    icon="type"
                    value={value}
                    editable={!showCalendar}
                    placeholder="Titulo"
                    returnKeyType="next"
                    onChangeText={(text: string) => onChange(text)}
                    onSubmitEditing={() => quantityRef.current?.focus()}
                  />
                )}
                defaultValue=""
              />

              <Controller
                control={control}
                name="quantity"
                render={({ onChange, value }) => (
                  <Input
                    ref={quantityRef}
                    erro={errors?.quantity}
                    icon="bar-chart"
                    value={value}
                    editable={!showCalendar}
                    placeholder="Quantidade de peças"
                    returnKeyType="next"
                    keyboardType="numeric"
                    onChangeText={(text: string) => onChange(text)}
                    onSubmitEditing={() => valueRef.current?.focus()}
                  />
                )}
                defaultValue=""
              />

              <Controller
                control={control}
                name="value"
                render={({ onChange, value }) => (
                  <Input
                    ref={valueRef}
                    erro={errors?.value}
                    icon="dollar-sign"
                    value={value}
                    editable={!showCalendar}
                    placeholder="Valor da peça"
                    returnKeyType="next"
                    keyboardType="numeric"
                    onChangeText={(text: string) => onChange(text)}
                    onSubmitEditing={() => companyRef.current?.focus()}
                  />
                )}
                defaultValue=""
              />

              <Controller
                control={control}
                name="date"
                render={() => (
                  <TouchableOpacity
                    onPress={() => setShowCalendar((state) => !state)}
                  >
                    <Input
                      erro={errors.date}
                      icon="calendar"
                      value={dateFormatted}
                      editable={false}
                      placeholder="Data"
                      returnKeyType="next"
                    />
                  </TouchableOpacity>
                )}
                defaultValue=""
              />

              <ChoiceCompany>
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue) => setSelectedValue(itemValue)}
                  style={{
                    height: 50,
                    width: '100%',
                    color: '#fff',
                  }}
                >
                  {loadCompanies().map((value) => (
                    <Picker.Item
                      key={value.id}
                      color="#666"
                      label={`${value.name}`}
                      value={`${value.name}`}
                    />
                  ))}
                </Picker>
              </ChoiceCompany>

              <Controller
                control={control}
                name="description"
                render={({ onChange, value }) => (
                  <Input
                    // ref={descriptionRef}
                    erro={errors?.description}
                    icon="edit-3"
                    value={value}
                    editable={!showCalendar}
                    placeholder="Alguma Observação?"
                    returnKeyType="next"
                    multiline
                    numberOfLines={3}
                    scrollEnabled={false}
                    onChangeText={(text: string) => onChange(text)}
                  />
                )}
                defaultValue=""
              />
              <RegisterButton
                onPress={handleSubmit(handleSubmitButton)}
                disabled={showCalendar}
              >
                <RegisterButtonText>
                  {loadingRequest ? (
                    <ActivityIndicator color="#00ffff" size="small" />
                  ) : (
                    'CADASTRAR'
                  )}
                </RegisterButtonText>
              </RegisterButton>
            </RegisterNewOrderView>
          )}
        </Modal> */}
      </Container>
    </SafeAreaView>
  );
};

export default React.memo(Deliveries);
