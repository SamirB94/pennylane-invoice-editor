import { useApi } from "api";
import { Customer, Invoice, Product } from "types";
import { useEffect, useCallback, useState } from "react";
import { CustomerAutocomplete } from "../Autocomplete";
import Table from "../UI/Table/Table";
import { mapBooleanValues } from "app/utils/invoiceUtils";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

enum InvoicesTableHeaders {
  Id = "Id",
  Customer = "Customer",
  Address = "Address",
  Total = "Total",
  Tax = "Tax",
  Finalized = "Finalized",
  Paid = "Paid",
  Date = "Date",
  Deadline = "Deadline",
  Actions = "",
}

type Filter = {
  field: string;
  operator: string;
  value: number | undefined;
};

const InvoicesTable = (): React.ReactElement => {
  const api = useApi();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);

  const fetchInvoices = useCallback(async () => {
    try {
      const { data } = await api.getInvoices({
        filter: JSON.stringify(filters),
      });
      setInvoicesList(data.invoices);
    } catch (error) {
      console.log(error);
    }
  }, [api, filters]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const prepareTableData = (invoices: Invoice[]) => {
    if (invoices.length > 0) {
      return {
        headers: Object.values(InvoicesTableHeaders) as string[],
        rows: invoices.map((invoice: Invoice) => ({
          id: invoice.id,
          customer: `${invoice.customer?.first_name} ${invoice.customer?.last_name}`,
          address: `${invoice.customer?.address}, ${invoice.customer?.zip_code} ${invoice.customer?.city}`,
          total: invoice.total,
          tax: invoice.tax,
          finalized: mapBooleanValues(invoice.finalized),
          paid: mapBooleanValues(invoice.paid),
          date: invoice.date,
          deadline: invoice.deadline,
          actions: (
            <Button
              className="btn-sm"
              variant="outline-secondary"
              type="button"
            >
              ...
            </Button>
          ),
        })),
      };
    }

    return {
      headers: Object.values(InvoicesTableHeaders),
      rows: [],
    };
  };

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

  const handleClearFilters = () => {
    setFilters([]);
    setCustomer(null);
  };

  const handleRowClick = (value: any) => {
    const { id, customer } = value;
    if (!id) return;
    console.log(value);
    navigate(`/edit-invoice/${id}`, {
      state: customer,
    });
    // navigate(`/edit-invoice/${id}`); // probably will have buttons for edit: /edit-invoice/:id , create: /create-invoice
  };

  return (
    <div>
      <div className="row justify-content-end mb-3">
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
        <CustomerAutocomplete
          className="col-md-4"
          value={customer}
          onChange={handleCustomerChange}
        />
      </div>
      <Table
        data={prepareTableData(invoicesList)}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default InvoicesTable;
