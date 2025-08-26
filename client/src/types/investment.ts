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
  asset: string;
  quantity: number;
  price: number;
  date: string;
  account: {
    _id: string;
    name: string;
  };
  entries: Entry[];
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
  history: { date: string; price: number }[];
};
