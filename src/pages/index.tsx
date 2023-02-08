import * as React from 'react';
import Head from 'next/head';
import { Inter } from '@next/font/google';
import axios from 'axios';
import {
  DataGrid,
  GridFilterModel,
  GridToolbar,
} from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { RemitaResponse, TableData } from '@/types';

const inter = Inter({ subsets: ['latin'] });

const column = [
  { field: 'id', headerName: 'Known ID', width: 90 },
  { field: 'customerId', headerName: 'Customer ID', width: 120 },
  { field: 'mandateReference', headerName: 'Mandate' },
  { field: 'authorisationCode', headerName: 'Authentication Code', width: 150 },
  { field: 'phoneNumber', headerName: 'Phone', width: 130 },
  { field: 'loanAmount', headerName: 'Amount' },
  { field: 'dateOfDisbursement', headerName: 'Date Disbursed', width: 115 },
  { field: 'loan_interest_rate', headerName: 'Interest' },
  { field: 'outstanding_loan_bal', headerName: 'Outstanding' },
  { field: 'numberOfRepayments', headerName: 'No of Repayment' },
  { field: 'ramount', headerName: 'RRR Amount' },
  { field: 'Rrepayment', headerName: 'RRR No of Repayment', width: 150 },
  { field: 'status', headerName: 'Status', width: 85 },
  { field: 'routstanding', headerName: 'RRR Outstanding', width: 150 },
  {
    field: 'last_repayment_date',
    headerName: 'Last Repayment Date',
    width: 150,
  },
];

export default function Home() {
  const [isRemitaButtonDisabled, setIsRemitaButtonDisabled] =
    React.useState(false);
  const [isRemitaLoading, setIsRemitaLoading] = React.useState(false);

  const [mergedData, setMergedData] = React.useState<any[] | undefined>();

  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [
      {
        columnField: 'dateOfDisbursement',
        operatorValue: '',
        value: '',
      },
    ],
  });

  const {
    isLoading,
    error,
    data: initialLoansData,
  } = useQuery<TableData[]>({
    queryKey: ['Repodata'],
    queryFn: async () => {
      const { data } = await axios.get(
        'https://libertyussd.com/api/web/loan_view/'
      );
      return data;
    },
  });

  const getRemitaData = async (
    authCode: string,
    mandate: string,
    remitaCustomerId: string
  ) => {
    const { data } = await axios.post<RemitaResponse>(
      `https://libertyussd.com/api/web/check_remita_loan_details/`,
      {
        auth_code: authCode,
        mandate,
        remita_customer_id: remitaCustomerId,
      }
    );
    return data;
  };

  const obtainRemitaDataResults = async () => {
    setIsRemitaLoading(true);

    const remitaApiResults = await Promise.all(
      initialLoansData?.map(
        ({ authorisationCode, mandateReference, customerId }) =>
          getRemitaData(authorisationCode, mandateReference, customerId)
      ) || []
    );

    setIsRemitaLoading(false);

    const merged = initialLoansData?.map((item1) => {
      return {
        ...item1,
        ...remitaApiResults?.find(
          (item2) => item2?.remita_customer_id === item1?.customerId
        ),
      };
    });

    setMergedData(merged);
  };
  console.log();

  let sum = 0;
  initialLoansData?.forEach((total) => {
    sum += total.loanAmount;
  });
  let totalAmount = sum.toLocaleString();

  let pay = 0;
  initialLoansData?.forEach((pays) => {
    pay += pays.numberOfRepayments;
  });
  let totalRepay = pay.toLocaleString();

  if (isLoading || isRemitaLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <p>Loading</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen w-full flex flex-col justify-center items-center mt-10">
        <p className="text-6xl text-blue- my-12">Reconciliation Dashboard</p>

        <div className="w-[90%] flex flex-row justify-between items-center my-8">
          <div className="flex gap-4 items-center">
            <p className="text-center text-2xl">Total Amount</p>

            <button
              className="border-2 py-2 px-5 bg-blue-500 text-white text-lg 
            rounded-md shadow-sm hover:bg-blue-300 hover:shadow-lg"
            >
              {totalAmount}
            </button>

            <p className="text-center text-2xl">Total Repayment</p>
            <button
              className="border-2 py-2 px-5 bg-blue-500 text-white text-lg 
            rounded-md shadow-sm hover:bg-blue-300 hover:shadow-lg"
            >
              {totalRepay}
            </button>
          </div>
          <button
            className="border-2 py-2 px-5 disabled:cursor-not-allowed disabled:opacity-50 bg-orange-400 text-white text-lg 
            rounded-md shadow-sm hover:bg-orange-300 hover:shadow-lg"
            disabled={isRemitaButtonDisabled}
            onClick={() => {
              obtainRemitaDataResults();
              setIsRemitaButtonDisabled(true);
            }}
          >
            Load
          </button>
        </div>

        <div className="h-screen w-[90%] flex-shrink">
          <DataGrid
            rows={mergedData || initialLoansData || []}
            columns={column}
            // initialState={{
            //   pagination: {
            //     pageSize: 10,
            //   },
            // }}
            components={{ Toolbar: GridToolbar }}
            filterModel={filterModel}
            onFilterModelChange={(newFilterModel) =>
              setFilterModel(newFilterModel)
            }
          />
        </div>
      </main>
    </>
  );
}
