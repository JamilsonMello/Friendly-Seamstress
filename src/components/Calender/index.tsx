import React, { useCallback, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { format } from 'date-fns';
import { CalendarList, CalendarListBaseProps } from 'react-native-calendars';

interface SelectedDateProps {
  day: number;
  month: number;
  year: number;
  dateString: string;
}

interface CalendarProps extends CalendarListBaseProps {
  handleDate: (dateFormatted: string, date: SelectedDateProps) => void;
  handleCloseCalendar?: () => void;
  openCalendar?: number;
}

const Calender: React.FC<CalendarProps> = ({
  handleDate,
  handleCloseCalendar,
  openCalendar,
}) => {
  const { width, height } = useWindowDimensions();

  const currentDate = useMemo(() => {
    const date = new Date();

    if (openCalendar) {
      date.setMonth(openCalendar - 1);
    }

    return date;
  }, [openCalendar]);

  const handleDateSubmit = useCallback(
    (event: SelectedDateProps): void => {
      const { day, month, year } = event;

      const formatted = format(
        new Date(year, month - 1, day),
        "dd'/'MM'/'yyyy",
      );

      handleDate(formatted, event);
      if (handleCloseCalendar) {
        handleCloseCalendar();
      }
    },
    [handleDate, handleCloseCalendar],
  );

  return (
    <CalendarList
      horizontal
      pagingEnabled
      calendarWidth={width - 30}
      current={currentDate}
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
