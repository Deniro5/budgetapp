import { Asset } from "./investment";

export enum AccountType {
  CHEQUING = "Chequing",
  SAVINGS = "Savings",
  TFSA = "Tax-Free Savings Account",
  RRSP = "Registered Retirement Savings Plan",
  RRIF = "Registered Retirement Income Fund",
  RESP = "Registered Education Savings Plan",
  RDSP = "Registered Disability Savings Plan",
  FHSA = "First Home Savings Account",
  HIGH_INTEREST_SAVINGS = "High-Interest Savings",
  GIC = "Guaranteed Investment Certificate",
  CASH_ACCOUNT = "Cash Account",
}

export type AccountInvestmentSummaryItem = {
  quantity: number;
  price: number;
  asset: Asset;
};

export type RawAccount = {
  _id: string;
  name: string;
  institution: string;
  type: AccountType;
  baselineAmount: number;
  baselineDate: string;
  isArchived?: boolean;
};

export type Account = RawAccount & {
  balance: number;
  investmentSummary: AccountInvestmentSummaryItem[];
  createdAt: string;
};
