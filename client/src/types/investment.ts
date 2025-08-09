type Entry = {
  account: string;
  asset: Asset;
  createdAt: string;
  date: string;
  price: number;
  quantity: number;
  updatedAt: string;
  userId: string;
};

export type Investment = {
  asset: AssetWithPrice;
  quantity: number;
  price: number;
  date: string;
  account: string;
  entries: Entry[];
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
