export interface Bill {
  id?: string;
  client_code: string;
  kwh: string;
  billing_date_from: string;
  billing_date_to: string;
  type_consumption: string;
  uid: string;
};