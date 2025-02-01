import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { useApi } from "api";
import { Invoice } from "types";
import { Container } from "react-bootstrap";
import InvoiceLines from "./InvoiceLines";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceCustomerInfo from "./InvoiceCustomerInfo";

const InvoiceReview = () => {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [invoice, setInvoice] = useState<Invoice>();

  useEffect(() => {
    api.getInvoice(id).then(({ data }) => {
      setInvoice(data);
    });
  }, [api, id]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="my-4 p-4 bg-white shadow">
      <div className="p-4 border">
        <h1>Pennylane</h1>
        <div className="row justify-content-between mt-4">
          <InvoiceDetails invoice={invoice} />
          {invoice.customer && (
            <InvoiceCustomerInfo customer={invoice.customer} />
          )}
        </div>
        <InvoiceLines invoiceLines={invoice.invoice_lines} />
      </div>
    </Container>
  );
};

export default InvoiceReview;
