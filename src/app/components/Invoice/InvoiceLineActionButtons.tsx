import { Button, ButtonGroup } from "react-bootstrap";

const InvoiceLineActionButtons = ({
  onEdit,
  onDelete,
  disabled,
}: {
  onEdit: () => void;
  onDelete: () => void;
  disabled: boolean;
}) => {
  return (
    <ButtonGroup>
      <Button
        variant="outline-primary"
        onClick={() => onEdit()}
        className="bi bi-x-lg"
        disabled={disabled}
      >
        Edit
      </Button>
      <Button
        variant="outline-danger"
        onClick={() => onDelete()}
        className="bi bi-trash"
        disabled={disabled}
      >
        Delete
      </Button>
    </ButtonGroup>
  );
};

export default InvoiceLineActionButtons;
