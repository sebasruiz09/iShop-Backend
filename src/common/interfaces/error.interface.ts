// Generated by https://quicktype.io
export interface IError {
  query?: string;
  parameters?: Array<string[] | number | string>;
  driverError?: DriverError;
  length: number;
  severity: string;
  code: string;
  detail: string;
  schema: string;
  table: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
  name?: string;
}

// Generated by https://quicktype.io

interface DriverError {
  length: number;
  name: string;
  severity: string;
  code: string;
  detail: string;
  schema: string;
  table: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;
}