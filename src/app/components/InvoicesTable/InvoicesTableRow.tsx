import { useNavigate } from "react-router-dom";
import { Invoice } from "types";

const InvoicesTableRow = ({ invoice }: { invoice: Invoice }) => {
  const navigate = useNavigate();
  const navigateTo = (id: Invoice["id"]) => {
    navigate(`/invoice/${id}`);
  };

  return (
    <tr
      key={invoice.id}
      className="pointer"
      onClick={() => navigateTo(invoice.id)}
      role="button"
    >
      <td>{invoice.id}</td>
      <td>
        {invoice.customer?.first_name} {invoice.customer?.last_name}
      </td>
      <td>
        {invoice.customer?.address}, {invoice.customer?.zip_code}{" "}
        {invoice.customer?.city}
      </td>
      <td>{invoice.total}</td>
      <td>{invoice.tax}</td>
      <td>{invoice.finalized ? "Yes" : "No"}</td>
      <td>{invoice.paid ? "Yes" : "No"}</td>
      <td>{invoice.date}</td>
      <td>{invoice.deadline}</td>
    </tr>
  );
};

export default InvoicesTableRow;
