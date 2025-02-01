import { Customer } from "types";

const InvoiceCustomerInfo = ({ customer }: { customer: Customer }) => {
  return (
    <div className="col-md-4">
      <h3>Customer Information</h3>
      <p>
        <strong>Name:</strong> {customer?.first_name} {customer?.last_name}
      </p>
      <p>
        <strong>Address:</strong> {customer?.address}, {customer?.city},{" "}
        {customer?.zip_code}, {customer?.country}
      </p>
    </div>
  );
};

export default InvoiceCustomerInfo;
