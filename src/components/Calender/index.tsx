import React, {useCallback} from 'react';
import {useWindowDimensions} from 'react-native';
import {format} from 'date-fns';
import {CalendarList, CalendarListBaseProps} from 'react-native-calendars';

interface SelectedDateProps {
  day: number;
  month: number;
  year: number;
  dateString: string;
}

interface CalendarProps extends CalendarListBaseProps {
  handleDate: (dateFormatted: string, date: SelectedDateProps) => void;
  handleCloseCalendar: () => void;
}

const Calender: React.FC<CalendarProps> = ({
  handleDate,
  handleCloseCalendar,
}) => {
  const {width, height} = useWindowDimensions();

  const handleDateSubmit = useCallback(
    (event: SelectedDateProps): void => {
      const {day, month, year} = event;

      const formatted = format(
        new Date(year, month - 1, day),
        "dd'/'MM'/'yyyy",
      );

      handleDate(formatted, event);
      handleCloseCalendar();
    },
    [handleDate, handleCloseCalendar],
  );

  return (
    <CalendarList
      horizontal
      pagingEnabled
      calendarWidth={width - 30}
      theme={{
        calendarBackground: '#444242',
        monthTextColor: '#fff',
        dayTextColor: '#fff',
        todayTextColor: '#00FFee',
        textSectionTitleColor: '#fff',
      }}
      style={{
        position: 'absolute',
        bottom: height / 4,
        alignSelf: 'center',
        width: width - 30,
      }}
      onDayPress={handleDateSubmit}
    />
  );
};

export default Calender;
