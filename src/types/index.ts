import { Components, OperationMethods } from "api/gen/client";
import { Awaited } from "./helpers";

export type Invoice = Awaited<
  ReturnType<OperationMethods["getInvoices"]>
>["data"]["invoices"][0];

export type Product = Awaited<
  ReturnType<OperationMethods["getSearchProducts"]>
>["data"]["products"][0];

export type Customer = Awaited<
  ReturnType<OperationMethods["getSearchCustomers"]>
>["data"]["customers"][0];

export type InvoiceCreatePayload = Components.Schemas.InvoiceCreatePayload;
export type InvoiceUpdatePayload = Components.Schemas.InvoiceUpdatePayload;
export type InvoiceLineCreatePayload =
  Components.Schemas.InvoiceLineCreatePayload;
export type InvoiceLineUpdatePayload =
  Components.Schemas.InvoiceLineUpdatePayload;
export type Unit = Components.Schemas.Unit;
export type VatRate = Components.Schemas.VatRate;
export type Pagination = Components.Schemas.Pagination;
export enum InvoicesTableHeaders {
  Id = "Id",
  Customer = "Customer",
  Address = "Address",
  Total = "Total",
  Tax = "Tax",
  Finalized = "Finalized",
  Paid = "Paid",
  Date = "Date",
  Deadline = "Deadline",
  Actions = "",
}

export enum InvoicesLinesHeaders {
  Id = "Id",
  Quantity = "Quantity",
  Label = "Label",
  Unit = "Unit",
  VatRate = "Vat Rate",
  Price = "Price",
  Tax = "Tax",
  Actions = "",
}
