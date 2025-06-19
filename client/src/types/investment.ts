export type RawInvestment = {
  symbol: string;
  quantity: number;
  price: number;
  date: string;
  account: string;
};

export type InvestmentSearchResult = {
  symbol: string;
  name: string;
  exchange: string;
};
