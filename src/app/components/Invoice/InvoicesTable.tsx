import { useApi } from "api";
import { Customer, Invoice, Pagination } from "types";
import { useEffect, useCallback, useState } from "react";
import { CustomerAutocomplete } from "../Autocomplete";
import Table from "../UI/Table/Table";
import { mapInvoiceToTableData } from "app/utils/invoiceUtils";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import PopoverActionButtons from "../UI/Button/PopoverActionButtons";
import InvoiceActionButtons from "./InvoiceActionButtons";

type Filter = {
  field: string;
  operator: string;
  value: number | undefined;
};

const InvoicesTable = (): React.ReactElement => {
  const api = useApi();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<Filter[]>([]);

  const fetchInvoices = useCallback(async () => {
    try {
      const { data } = await api.getInvoices({
        ...pagination,
        filter: JSON.stringify(filters),
      });
      setInvoicesList(data.invoices);
      setPagination(data.pagination);
    } catch (error) {
      console.log(error);
    }
  }, [api, filters, pagination]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCustomerChange = (customer: Customer | null) => {
    setFilters((prevFilters: Filter[]) => {
      if (customer === null) {
        return [];
      }
      return [
        ...prevFilters,
        { field: "customer_id", operator: "eq", value: customer.id },
      ];
    });
    setCustomer(customer);
  };

  const handleDeleteInvoice = (id: number) => {
    try {
      api.deleteInvoice(id).then(() => {
        fetchInvoices();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const preparedTableData = mapInvoiceToTableData(
    invoicesList,
    (invoice: Invoice) => (
      <PopoverActionButtons
        children={
          <InvoiceActionButtons
            invoice={invoice}
            handleDeleteInvoice={handleDeleteInvoice}
          />
        }
      />
    )
  );

  const handleClearFilters = () => {
    setFilters([]);
    setCustomer(null);
  };

  const tableOptions = (
    <div className="row mb-3">
      <CustomerAutocomplete
        className="col-md-4"
        value={customer}
        onChange={handleCustomerChange}
      />
      <Button variant="primary col-md-2">
        <Link className="text-reset text-decoration-none" to="/create-invoice">
          Add Invoice
        </Link>
      </Button>
      {customer && (
        <Button
          className="btn-sm col-md-2"
          variant="outline-secondary"
          type="button"
          onClick={handleClearFilters}
        >
          Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <Table
        data={preparedTableData}
        fallbackContent={
          //should be in component probably
          <tr>
            <td colSpan={6}>No invoices found</td>
          </tr>
        }
        pagination={pagination}
        setPagination={setPagination}
        options={tableOptions}
      />
    </div>
  );
};

export default InvoicesTable;
