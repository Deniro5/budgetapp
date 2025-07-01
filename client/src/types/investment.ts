export type Investment = {
  asset: AssetWithPrice;
  quantity: number;
  price: number;
  date: string;
  account: string;
  _id: string;
};

export type RawInvestment = {
  asset: Asset;
  quantity: number;
  price: number;
  date: string;
  account: string;
};

export type Asset = {
  symbol: string;
  name: string;
  exchange: string;
};

export type AssetWithPrice = Asset & {
  history: { date: string; price: number }[];
};
