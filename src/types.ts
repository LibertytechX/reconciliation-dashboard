export interface TableData {
  dateOfDisbursement: any;
  numberOfRepayments: number;
  loanAmount: any;
  id: number;
  mandate: string;
  authcode: string;
  phone: string;
  tenure: string;
  amount: number;
  interest: number;
  outstanding: string;
  repayment: number;
  ramount?: string;
  Rrepayment?: string;
  status?: string;
  rtenure?: string;
  routstanding?: string;
  verdict?: string;
}

export interface RemitaDataItem {
  id: number;
  ramount: string;
  Rrepayment: string;
  status: string;
  rtenure: string;
  routstanding: string;
  verdict: string;
}
