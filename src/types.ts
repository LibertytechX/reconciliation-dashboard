export interface TableData {
  id: number;
  mandateReference: string;
  customerId: string;
  authorisationCode: string;
  phoneNumber: string;
  numberOfRepayments: number;
  loanAmount: number;
  outstanding_loan_bal: number;
  loan_interest_rate: number;
  paid_amount: number;
  dateOfDisbursement: string;
}

export interface RemitaResponse {
  remita_customer_id: string;
  customerId: string;
  ramount: number;
  status: string;
  Rrepayment: number;
  routstanding: number;
  number_of_repayments: number;
  last_repayment_date: string;
}
