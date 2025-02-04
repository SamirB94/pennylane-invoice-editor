import { calculateTotals } from "app/utils/invoiceUtils";
import { InvoiceLineUpdatePayload } from "types";

const InvoiceLinesTotals = ({
  invoiceLines,
}: {
  invoiceLines: InvoiceLineUpdatePayload[];
}) => {
  const { total, tax, price } = calculateTotals(invoiceLines);

  return (
    <div>
      <p className="text-end">Tax fee: {tax}</p>
      <p className="text-end">Price: {price}</p>
      <p className="text-end fw-bold">Total: {total}</p>
    </div>
  );
};

export default InvoiceLinesTotals;
