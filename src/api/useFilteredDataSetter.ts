import axios from 'axios';
import { format as formatDate } from 'date-fns';
import * as React from 'react';

import { TableData } from '@/types';

export const useFilteredDataSetter = (
  dateRange: [Date | null, Date | null]
) => {
  const [filteredData, setFilteredData] = React.useState<
    TableData[] | undefined
  >();

  React.useEffect(() => {
    const formattedDates = dateRange?.map((date) =>
      !!date ? formatDate(new Date(date), 'yyyy-MM-dd') : null
    );
    const areBothDatesValid = formattedDates.every((date) => !!date);

    if (areBothDatesValid) {
      const [startDate, endDate] = formattedDates;

      const getAndSetFilteredData = async (
        startDate: string,
        endDate: string,
        limit = '100'
      ) => {
        const { data } = await axios.post<TableData[]>(
          'https://libertyussd.com/api/web/loan_view/',
          {
            start_date: startDate,
            end_date: endDate,
            limit,
          }
        );

        setFilteredData(data);
      };

      // Type coersion used as areBothDatesValid has done typechecks already
      getAndSetFilteredData(startDate as string, endDate as string);
    }
  }, [dateRange]);

  return filteredData;
};
