import { OverlayTrigger, Popover, Button } from "react-bootstrap";

const PopoverActionButtons = ({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <OverlayTrigger
      rootClose
      trigger="click"
      placement="left"
      overlay={
        <Popover id="popover-basic">
          <Popover.Body>{children}</Popover.Body>
        </Popover>
      }
    >
      <Button
        disabled={disabled}
        className="btn-sm"
        variant="outline-secondary"
      >
        ...
      </Button>
    </OverlayTrigger>
  );
};

export default PopoverActionButtons;
