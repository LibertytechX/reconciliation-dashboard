import * as React from 'react';
import DatePicker from 'react-datepicker';

interface DateRangePickerProps {
  dateRange: [Date | null, Date | null];
  setDateRange: React.Dispatch<
    React.SetStateAction<[Date | null, Date | null]>
  >;
}

export const DateRangePicker: React.FunctionComponent<DateRangePickerProps> = ({
  dateRange,
  setDateRange,
}) => {
  const [startDate, endDate] = dateRange;

  return (
    <>
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        dateFormat="dd/MM/yyyy"
        onChange={(update) => {
          setDateRange(update);
        }}
        placeholderText="Select a date range"
        withPortal
        showYearDropdown
      />
    </>
  );
};
