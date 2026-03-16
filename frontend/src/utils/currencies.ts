export interface Currency {
  code: string;
  abbr: string;
  name: string;
  default: boolean;
  rate: number;
  in_use: boolean;
}

export const currencies: Currency[] = [
  { code: "AZN", abbr: "₼", name: "Манаты", default: false, rate: 0.0215, in_use: false },
  { code: "BYR", abbr: "Br", name: "Белорусские рубли", default: false, rate: 0.037007, in_use: false },
  { code: "EUR", abbr: "€", name: "Евро", default: false, rate: 0.010877, in_use: true },
  { code: "GEL", abbr: "₾", name: "Грузинский лари", default: false, rate: 0.034702, in_use: false },
  { code: "KGS", abbr: "сом", name: "Кыргызский сом", default: false, rate: 1.10601, in_use: false },
  { code: "KZT", abbr: "₸", name: "Тенге", default: false, rate: 6.21732, in_use: false },
  { code: "RUR", abbr: "₽", name: "Рубли", default: true, rate: 1, in_use: true },
  { code: "UAH", abbr: "₴", name: "Гривны", default: false, rate: 0.554745, in_use: false },
  { code: "USD", abbr: "$", name: "Доллары", default: false, rate: 0.012647, in_use: true },
  { code: "UZS", abbr: "so'm", name: "Узбекский сум", default: false, rate: 153.48511, in_use: false },
];
