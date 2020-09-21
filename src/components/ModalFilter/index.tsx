import React, { useState, useCallback } from 'react';
import { Picker } from '@react-native-community/picker';
import { Modal, ModalProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useCompany } from '../../hooks/context/CompaniesProvider';
import Calender from '../Calender';
import Input from '../Input';

import {
  FilterView,
  CloseButton,
  Title,
  ButtonFieldDate,
  ChoiceCompany,
  ConfirmButton,
  ConfirmButtonText,
} from './styles';

interface SelectedDateProps {
  day: number;
  month: number;
  year: number;
  dateString: string;
}

interface ModalFilterProps extends ModalProps {
  handleDateSubmit: (dateFormatted: string, date: SelectedDateProps) => void;
  handleFilterHistory: () => void;
  handleVisible: () => void;
  fieldSelected: (field: number) => void;
  companySelected: (company: string) => void;
  initialDate: string;
  finalDate: string;
}

const ModalFilter: React.FC<ModalFilterProps> = ({
  handleDateSubmit,
  handleFilterHistory,
  handleVisible,
  fieldSelected,
  companySelected,
  visible,
  initialDate,
  finalDate,
}) => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<React.ReactText>();

  const { loadCompanies } = useCompany();

  const handleCloseModal = useCallback(() => {
    handleVisible();
  }, [handleVisible]);

  const handleCloseCalendar = useCallback(() => {
    setShowCalendar(!showCalendar);
  }, [showCalendar]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <FilterView>
        <CloseButton
          hitSlop={{
            bottom: 10,
            top: 10,
            right: 10,
            left: 10,
          }}
          onPress={() => handleCloseModal()}
        >
          <Icon color="#999" size={30} name="x" />
        </CloseButton>
        <Title>De</Title>
        <ButtonFieldDate
          onPress={() => {
            setShowCalendar((state) => !state);
            fieldSelected(0);
          }}
        >
          <Input
            icon="calendar"
            editable={false}
            value={initialDate}
            placeholder="Escolha a data inicial"
          />
        </ButtonFieldDate>
        <Title>Ate</Title>
        <ButtonFieldDate
          onPress={() => {
            setShowCalendar((state) => !state);
            fieldSelected(1);
          }}
        >
          <Input
            icon="calendar"
            editable={false}
            value={finalDate}
            placeholder="Escolha a data final"
          />
        </ButtonFieldDate>

        <ChoiceCompany>
          <Picker
            selectedValue={selectedValue}
            onValueChange={(itemValue) => {
              setSelectedValue(itemValue);
              companySelected(itemValue as string);
            }}
            style={{
              height: 50,
              width: '100%',
              color: '#ddd',
            }}
          >
            {loadCompanies().map((data) => (
              <Picker.Item
                key={data.id}
                color="#000"
                label={`${data.name}`}
                value={`${data.name}`}
              />
            ))}
          </Picker>
        </ChoiceCompany>

        <ConfirmButton onPress={() => handleFilterHistory()}>
          <ConfirmButtonText>Confirmar</ConfirmButtonText>
        </ConfirmButton>
      </FilterView>
      {showCalendar && (
        <Calender
          handleCloseCalendar={handleCloseCalendar}
          handleDate={handleDateSubmit}
        />
      )}
    </Modal>
  );
};

export default ModalFilter;
