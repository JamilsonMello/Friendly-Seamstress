import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

export const numberFormat = (value: number): string =>
  new Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
