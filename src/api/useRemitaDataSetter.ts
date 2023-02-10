import axios from 'axios';
import { format as formatDate } from 'date-fns';
import * as React from 'react';

import { RemitaResponse, TableData } from '@/types';

import { getRemitaData } from './getRemitaData';


export const useRemitaDataSetter = (
  initialLoansData: TableData[] | undefined,
  setMergedData: (value: React.SetStateAction<any[] | undefined>) => void,
  mergedData: any[] | undefined
) => {
  const [isRemitaLoading, setIsRemitaLoading] = React.useState(false);

  const obtainAllRemitaDataResults = async () => {
    setIsRemitaLoading(true);

    const remitaApiPromises =
      initialLoansData?.map(
        ({ authorisationCode, mandateReference, customerId }) =>
          getRemitaData(authorisationCode, mandateReference, customerId)
      ) || [];

    const remitaApiResults = (await Promise.allSettled(remitaApiPromises)) as {
      status: 'fulfilled' | 'rejected';
      value: RemitaResponse;
    }[];

    const merged = initialLoansData?.map((initialLoansItem) => {
      const remitaApiResult = remitaApiResults.find(
        ({ value }) =>
          value?.remita_customer_id === initialLoansItem?.customerId
      );
      return {
        ...initialLoansItem,
        ...(remitaApiResult?.status === 'fulfilled'
          ? remitaApiResult.value
          : {}),
      };
    });

    // Add verdict to every object.
    const updatedMerged = merged?.map((item) => {
      const verdict = item.loanAmount === item.ramount;
      return { ...item, verdict };
    });

    setMergedData(updatedMerged);
    setIsRemitaLoading(false);
  };

  const obtainSingleRemitaDataResult = async (
    authorisationCode: string,
    mandateReference: string,
    customerId: string
  ) => {
    setIsRemitaLoading(true);

    const remitaApiResult = await getRemitaData(
      authorisationCode,
      mandateReference,
      customerId
    );

    // The merged data (if defined) should updated instead of initial loans data
    const currentLoanItemsState = mergedData || initialLoansData;

    // update loans Data
    const updatedLoansData = currentLoanItemsState?.map((loansItem) =>
      loansItem.customerId === remitaApiResult?.remita_customer_id
        ? {
            ...loansItem,
            ...remitaApiResult,
            verdict: loansItem.loanAmount === remitaApiResult.ramount,
          }
        : loansItem
    );

    setMergedData(updatedLoansData);
    setIsRemitaLoading(false);
  };

  return {
    isRemitaLoading,
    obtainAllRemitaDataResults,
    obtainSingleRemitaDataResult,
  };
};
