import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { useApi } from "api";
import { Invoice } from "types";
import { Button, Container } from "react-bootstrap";
import InvoiceDetails from "./InvoiceDetails";
import InvoiceCustomerInfo from "./InvoiceCustomerInfo";
import Table from "../UI/Table/Table";
import { mapInvoiceLineToTableData } from "app/utils/invoiceUtils";
import { Link } from "react-router-dom";
import InvoiceLinesTotals from "./InvoiceLinesTotals";

const InvoiceReview = () => {
  const { id } = useParams<{ id: string }>();
  const api = useApi();
  const [invoice, setInvoice] = useState<Invoice>();

  useEffect(() => {
    try {
      api.getInvoice(id).then(({ data }) => {
        setInvoice(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, [api, id]);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  const isButtonDisabled = !!invoice?.finalized && !!invoice?.paid;

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
        <Table data={mapInvoiceLineToTableData(invoice.invoice_lines)} />
        <InvoiceLinesTotals invoiceLines={invoice.invoice_lines} />
        <div className="row justify-content-between px-2">
          <Button className="col-md-3" variant="outline-primary">
            <Link
              className="text-reset text-decoration-none"
              type="button"
              to={"/"}
            >
              Back to Invoice List
            </Link>
          </Button>
          {!isButtonDisabled && (
            <Link
              to={`/edit-invoice/${invoice?.id}`}
              className="text-reset text-decoration-none col-md-3 p-0"
              state={{
                customer: `${invoice?.customer?.first_name} ${invoice?.customer?.last_name}`,
              }}
            >
              <Button className="w-100" variant="primary">
                Edit
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
};

export default InvoiceReview;
