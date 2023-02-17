import * as React from "react";
import { useState } from "react";
import { TableData, RemitaResponse } from "@/types";
import axios from "axios";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { getRemitaData } from "@/api";

export default function Mandate() {
  const [mandateString, setMandateString] = useState("");
  const [mandateData, setMandateData] = useState<TableData[] | undefined>();
  const [dataLoading, setDataLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const mandateArray = mandateString.split(/[\n., ]+/).filter(Boolean);

  const handleInput = (event: { target: any; preventDefault: () => void }) => {
    event.preventDefault();
    let targets = event.target.value as string;
    setMandateString(targets);
  };

  const getMandateData = async (mandateReference: string[]) => {
    const { data: mandateData } = await axios.post<TableData[]>(
      "https://libertyussd.com/api/web/mandate_reconciliation_filter/",
      { mandates: mandateReference }
    );

    return mandateData;
  };

  const handleClick = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    dataLoading;
    const mandateDataResponse = await getMandateData(mandateArray);
    setMandateData(mandateDataResponse);
  };

  const obtainAllRemitaData = async () => {
    setDataLoading(true);
    const remitaResult =
      mandateData?.map(({ authorisationCode, mandateReference, customerId }) =>
        getRemitaData(authorisationCode, mandateReference, customerId)
      ) || [];

    const remitaPromise = (await Promise.allSettled(
      remitaResult
    )) as unknown as {
      status: "fulfilled" | "rejected";
      value: RemitaResponse;
    }[];

    const mergeMandateData = mandateData?.map((initialMandateData) => {
      const remitaPromiseResult = remitaPromise.find(
        ({ value }) =>
          value?.remita_customer_id === initialMandateData.customerId
      );
      return {
        ...initialMandateData,
        ...(remitaPromiseResult?.status === "fulfilled"
          ? remitaPromiseResult.value
          : {}),
      };
    });

    const mergedDataStatus = mergeMandateData?.map((item) => {
      const verdict = item.loanAmount === item.ramount;
      return { ...item, verdict };
    });

    setMandateData(mergedDataStatus);
    setDataLoading(false);
  };

  const obtainSingleRemitaData = async (
    authorisationCode: string,
    mandateReference: string,
    customerId: string
  ) => {
    const remitaApiesult = await getRemitaData(
      authorisationCode,
      mandateReference,
      customerId
    );

    const loadLoanData = mandateData?.map((loanItem) => {
      loanItem.customerId === remitaApiesult?.remita_customer_id
        ? {
            ...loanItem,
            ...remitaApiesult,
            verdict: loanItem.loanAmount === remitaApiesult.ramount,
          }
        : loanItem;
    });
    // setMandateData(loadLoanData);
    setDataLoading(false);
  };
  if (dataLoading) {
    <div className="h-screen w-screen flex items-center justify-center">
      Loading...
    </div>;
  }

  const columns = [
    {
      field: "load_remita_data",
      headerName: "Load remita data",
      width: 160,
      renderCell: (params: GridRenderCellParams<undefined>) => {
        const {
          row: { authorisationCode, mandateReference, customerId },
        } = params;

        const fetchRowRemitaData = () => {
          obtainSingleRemitaData(
            authorisationCode,
            mandateReference,
            customerId
          );
        };

        return (
          <button
            className="bg-amber-200 w-max mx-auto py-1 px-3 duration-500 ease-in-out transition hover:bg-amber-300 rounded-md"
            onClick={fetchRowRemitaData}
          >
            Load remita data
          </button>
        );
      },
    },
    {
      field: "verdict",
      headerName: "Verdict",
      width: 90,
      type: "boolean",
      cellClassName: (param: any) => {
        const { value } = param;
        if (value === undefined) return "bg-orange-300";
        if (!value) return "bg-red-300";
        return "bg-green-300";
      },
    },
    { field: "id", headerName: "Known ID", width: 90 },
    { field: "customerId", headerName: "Customer ID", width: 120 },
    { field: "mandateReference", headerName: "Mandate", width: 130 },
    {
      field: "authorisationCode",
      headerName: "Authentication Code",
      width: 280,
    },
    { field: "phoneNumber", headerName: "Phone", width: 130 },
    { field: "loanAmount", headerName: "Amount" },
    {
      field: "dateOfDisbursement",
      headerName: "Date Disbursed",
      width: 115,
      valueFormatter: (param: { value: string | number }) =>
        new Date(param?.value).toLocaleDateString(),
    },
    { field: "loan_interest_rate", headerName: "Interest" },
    { field: "outstanding_loan_bal", headerName: "Outstanding" },
    { field: "numberOfRepayments", headerName: "No of Repayment", width: 130 },
    { field: "ramount", headerName: "RRR Amount" },
    { field: "Rrepayment", headerName: "RRR No of Repayment", width: 180 },
    { field: "status", headerName: "Status", width: 85 },
    { field: "routstanding", headerName: "RRR Outstanding", width: 150 },
    {
      field: "last_repayment_date",
      headerName: "Last Repayment Date",
      width: 150,
    },
  ];

  return (
    <div className="md:mt-24 mx-12 md:mx-20">
      <h1 className="text-3xl md:text-7xl w-[90%] text-center md:text-left font-bold text-cyan-900 mt-8 md:my-8 xs:mt-12 ">
        Reconciliation Dashboard
      </h1>
      <p className=" text-xl md:text-2xl font-semibold text-slate-900 mt-12">
        Enter mandate reference number(s) below
      </p>
      <div className="gridd gap-3 mt-5">
        <textarea
          className="md:py-6 px-4 border-2 border-black  md:w-[30%] md:mt-5"
          placeholder="search here"
          value={mandateString}
          onChange={handleInput}
        ></textarea>
        <div className="flex md:flex-row justify-between md:items-center xs:flex-col xs:gap-4">
          <button
            className="transition font-semibold md:w-max ease-in-out duration-500 xs:py-2 xs:w-[60%] xs:px-1 md:py-3 md:px-8 disabled:cursor-not-allowed disabled:opacity-50 bg-cyan-600 text-white md:text-lg 
            rounded-md hover:bg-cyan-700 grid justify-self-end "
            onClick={handleClick}
          >
            Load Mandate Data
          </button>
          <button
            className="transition font-semibold md:w-max ease-in-out duration-500 xs:py-2 xs:w-[60%] xs:px-1 md:py-3 md:px-8 disabled:cursor-not-allowed disabled:opacity-50 bg-orange-600 text-white md:text-lg 
            rounded-md hover:bg-orange-700 grid justify-self-end "
            onClick={() => {
              obtainAllRemitaData(), setDataLoading(true);
            }}
          >
            Load All Remita Data
          </button>
        </div>
      </div>
      <div className="h-[70vh] w-full mt-7">
        <DataGrid
          columns={columns}
          rows={mandateData || []}
          pageSize={pageSize}
        />
      </div>
    </div>
  );
}
