import { ButtonGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Invoice } from "types";

const InvoiceActionButtons = ({
  invoice,
  handleDeleteInvoice,
}: {
  invoice: Invoice;
  handleDeleteInvoice: (id: number) => void;
}) => {
  const isEditable = invoice.finalized && invoice.paid;
  return (
    <>
      <ButtonGroup className="col gap-2">
        <Link
          className="text-reset text-decoration-none p-0"
          to={`/invoice/${invoice.id}`}
        >
          <Button className="btn-sm w-100" variant="primary" type="button">
            View
          </Button>
        </Link>
        <Link
          to={`/edit-invoice/${invoice.id}`}
          state={{
            customer: `${invoice?.customer?.first_name} ${invoice?.customer?.last_name}`,
          }}
          className="text-reset text-decoration-none p-0"
        >
          <Button
            className="btn-sm w-100"
            variant="secondary"
            type="button"
            disabled={isEditable}
          >
            Edit
          </Button>
        </Link>
        <Button
          className="btn-sm w-100"
          variant="danger"
          type="button"
          disabled={!!invoice?.finalized}
          onClick={() => handleDeleteInvoice(invoice.id)}
        >
          Delete
        </Button>
      </ButtonGroup>
    </>
  );
};

export default InvoiceActionButtons;
