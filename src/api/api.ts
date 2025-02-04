import { InvoiceCreatePayload, InvoiceUpdatePayload } from "types";
import { Client } from "./gen/client";

export const createInvoice = async (
  api: Client,
  invoiceData: InvoiceCreatePayload | null
) => {
  try {
    const { data } = await api.postInvoices(null, {
      invoice: invoiceData as InvoiceCreatePayload,
    });
    return data;
  } catch (error) {
    //probably display error toast/banner
    console.log(error);
  }
};

export const updateInvoice = async (
  api: Client,
  id: string,
  invoiceData: InvoiceUpdatePayload | null
) => {
  try {
    const { data } = await api.putInvoice(id, {
      invoice: invoiceData as InvoiceUpdatePayload,
    });
    return data;
  } catch (error) {
    //probably display error toast/banner
    console.log(error);
  }
};
