import {
  Invoice,
  InvoiceLineUpdatePayload,
  InvoicesLinesHeaders,
  InvoicesTableHeaders,
} from "types";

export const mapBooleanValues = (value: boolean): string => {
  return value ? "Yes" : "No";
};

export const mapInvoiceToTableData = (
  invoices: Invoice[],
  actions?: (invoice: Invoice) => React.ReactNode
) => {
  const normalizedHeaders =
    !actions || invoices?.length === 0
      ? Object.values(InvoicesTableHeaders).filter(
          (header: string) => header !== ""
        )
      : Object.values(InvoicesTableHeaders);
  if (!invoices || invoices?.length === 0) {
    return {
      headers: normalizedHeaders as string[],
      rows: [],
    };
  }

  return {
    headers: normalizedHeaders as string[],
    rows: invoices.map((invoice: Invoice) => ({
      id: invoice.id,
      customer: `${invoice.customer?.first_name} ${invoice.customer?.last_name}`,
      address: `${invoice.customer?.address}, ${invoice.customer?.zip_code} ${invoice.customer?.city}`,
      total: invoice.total,
      tax: invoice.tax,
      finalized: mapBooleanValues(invoice.finalized),
      paid: mapBooleanValues(invoice.paid),
      date: invoice.date,
      deadline: invoice.deadline,
      actions: actions && actions(invoice),
    })),
  };
};

export const mapInvoiceLineToTableData = (
  invoiceLines: InvoiceLineUpdatePayload[],
  actions?: (invoiceLine: InvoiceLineUpdatePayload) => React.ReactNode
) => {
  const normalizedHeaders =
    !actions || invoiceLines?.length === 0
      ? Object.values(InvoicesLinesHeaders).filter(
          (header: string) => header !== ""
        )
      : Object.values(InvoicesLinesHeaders);
  if (!invoiceLines || invoiceLines?.length === 0) {
    return {
      headers: normalizedHeaders as string[],
      rows: [],
    };
  }

  return {
    headers: normalizedHeaders as string[],
    rows: invoiceLines.map((line: InvoiceLineUpdatePayload) => ({
      id: line.id,
      quantity: line.quantity,
      label: line.label,
      unit: line.unit,
      vat_rate: line.vat_rate,
      price: line.price,
      tax: line.tax,
      _destroy: line._destroy,
      ...(actions && { actions: actions(normalizeInvoiceLine(line)) }),
    })),
  };
};

export const normalizeInvoiceLine = (invoiceLine: InvoiceLineUpdatePayload) => {
  return {
    id: invoiceLine.id,
    product_id: invoiceLine.product_id,
    quantity: invoiceLine.quantity,
    label: invoiceLine.label,
    unit: invoiceLine.unit,
    vat_rate: invoiceLine.vat_rate,
    tax: invoiceLine.tax,
    price: invoiceLine.price,
    _destroy: invoiceLine._destroy,
  };
};

export const calculateTotals = (currentLines: InvoiceLineUpdatePayload[]) => {
  const totalTax = currentLines.reduce((acc, line) => {
    return acc + (line.tax ? parseFloat(String(line.tax)) : 0);
  }, 0);

  const totalPrice = currentLines.reduce((acc, line) => {
    return acc + (line.price ? parseFloat(String(line.price)) : 0);
  }, 0);

  const total = totalPrice + totalTax;
  return {
    tax: totalTax || 0,
    price: totalPrice || 0,
    total: total || 0,
  };
};
