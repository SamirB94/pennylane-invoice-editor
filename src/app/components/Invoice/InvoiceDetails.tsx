import { Invoice } from "types";

const InvoiceDetails = ({ invoice }: { invoice: Invoice }) => {
  return (
    <>
      <div className="col-md-6">
        <h3>Invoice</h3>
        <p>
          <strong>Invoice ID:</strong> {invoice.id}
        </p>
        <p>
          <strong>Date:</strong> {invoice.date}
        </p>
        <p>
          <strong>Due Date:</strong> {invoice.deadline}
        </p>
        <p>
          <strong>Total:</strong> {invoice.total}
        </p>
        <p>
          <strong>Tax:</strong> {invoice.tax}
        </p>
        <p>
          <strong>Status:</strong> {invoice.paid ? "Paid" : "Unpaid"}
        </p>
      </div>
    </>
  );
};

export default InvoiceDetails;
