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

export type Account = {
  _id: string;
  name: string;
  institution: string;
  type: AccountType;
  baselineAmount: number;
  baselineDate: string;
};
