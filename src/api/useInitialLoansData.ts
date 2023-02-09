import axios from 'axios';

import { TableData } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useInitialLoansData = () => {
  return useQuery<TableData[]>({
    queryKey: ['initial-loans-data'],
    queryFn: async () => {
      const { data } = await axios.get(
        'https://libertyussd.com/api/web/loan_view/'
      );
      return data;
    },
  });
};
