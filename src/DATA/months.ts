interface MonthsProps {
  id: number;
  month: string;
  selected: boolean;
}

const months: MonthsProps[] = [
  {
    id: 1,
    month: 'JAN',
    selected: false,
  },
  {
    id: 2,
    month: 'FEV',
    selected: false,
  },
  {
    id: 3,
    month: 'MAR',
    selected: false,
  },
  {
    id: 4,
    month: 'ABR',
    selected: false,
  },
  {
    id: 5,
    month: 'MAI',
    selected: false,
  },
  {
    id: 6,
    month: 'JUN',
    selected: false,
  },
  {
    id: 7,
    month: 'JUL',
    selected: false,
  },
  {
    id: 8,
    month: 'AGO',
    selected: false,
  },
  {
    id: 9,
    month: 'SET',
    selected: false,
  },
  {
    id: 10,
    month: 'OUT',
    selected: false,
  },
  {
    id: 11,
    month: 'NOV',
    selected: false,
  },
  {
    id: 12,
    month: 'DEZ',
    selected: false,
  },
];

const dataMonths = Array.from(months, (value: MonthsProps) => ({
  ...value,
  selected: value.id === new Date().getMonth() + 1,
}));

export default dataMonths;
