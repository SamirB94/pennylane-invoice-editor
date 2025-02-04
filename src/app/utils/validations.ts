import { UseFormTrigger } from "react-hook-form";
import { InvoiceLineCreatePayload, InvoiceLineUpdatePayload } from "types";

export const customerValidation = {
  value: true,
  message: "Please select a customer",
};

export const productValidation = {
  value: true,
  message: "Please select a product",
};

export const quantityValidation = {
  value: true,
  message: "Please enter a quantity",
};

export const priceValidation = {
  value: true,
  message: "Please enter a price",
};

export const taxValidation = {
  value: true,
  message: "Please enter a tax",
};

export const invoiceLineValidation = {
  value: true,
  message: "Please add at least one product",
};

export const deadlineValidation = {
  value: true,
  message: "Deadline is required",
};

export const dateValidation = {
  value: true,
  message: "Deadline is required",
};

export const validateNegativeOrZero = (value: string | number | undefined) => {
  if (value && Number(value) <= 0) {
    return "Value must be greater than 0";
  }
};

export const triggerValidation = (
  value: string | number | undefined,
  name: string,
  trigger: UseFormTrigger<InvoiceLineCreatePayload | InvoiceLineUpdatePayload>
) => {
  validateNegativeOrZero(value);
  trigger();
  return "";
};

export const validateDeadline = (
  date: string | null | undefined,
  deadline: string | null | undefined
) => {
  if (!date || !deadline) return "Both date and deadline are required";
  const deadlineDate = new Date(deadline);
  const invoiceDate = new Date(date);
  return (
    deadlineDate > invoiceDate || "Deadline must be after the invoice date"
  );
};
