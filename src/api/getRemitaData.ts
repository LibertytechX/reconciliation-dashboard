import axios from 'axios';

import { RemitaResponse } from '@/types';

export const getRemitaData = async (
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
