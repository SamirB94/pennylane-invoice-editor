import { FC } from "react";
import { Components } from "../../../api/gen/client";

type InvoiceLine = Components.Schemas.InvoiceLine;

const InvoiceLinez: FC<{ invoiceLine: InvoiceLine }> = ({ invoiceLine }) => {
  return (
    <li key={invoiceLine.id}>
      <strong>{invoiceLine.label}</strong> - {invoiceLine.quantity}{" "}
      {invoiceLine.unit} @ {invoiceLine.price} (Tax: {invoiceLine.tax})
    </li>
  );
};

const InvoiceLines: FC<{ invoiceLines: InvoiceLine[] }> = ({
  invoiceLines,
}) => {
  return (
    <div className="mt-4">
      <h3>Invoice Lines</h3>
      {invoiceLines.map((line) => (
        <InvoiceLinez key={line.id} invoiceLine={line} />
      ))}
    </div>
  );
};

export default InvoiceLines;
