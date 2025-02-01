import { useApi } from "api";
import { Customer, Invoice, Product } from "types";
import { useEffect, useCallback, useState } from "react";
import { InvoicesTableHeader, InvoicesTableRow } from ".";
import { CustomerAutocomplete, ProductAutocomplete } from "../Autocomplete";

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
}

const InvoicesTable = (): React.ReactElement => {
  const api = useApi();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState<string>("");
  const [product, setProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<
    { field: string; operator: string; value: any }[]
  >([]);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  const tableHeaders: string[] = Object.values(InvoicesTableHeaders);

  const handleCustomerChange = (customer: Customer | null) => {
    setFilters((prevFilters) => {
      if (customer === null) {
        setCustomerSearch("");
        return [];
      }
      return [
        ...prevFilters,
        { field: "customer_id", operator: "eq", value: customer.id },
      ];
    });
    setCustomer(customer);
    setCustomerSearch(customer?.first_name + " " + customer?.last_name);
  };

  const handleCustomerSearch = (searchValue: string) => {
    setCustomerSearch(searchValue);
    if (searchValue === "") {
      setCustomer(null);
      // fetchInvoices();
      return;
    }
  };

  console.log("FILTERS: ", filters);
  console.log("CUSTOMER: ", customer);
  console.log("SEARCH: ", customerSearch);

  const handleProductChange = (product: Product | null) => {
    setFilters((prevFilters) => [
      ...prevFilters,
      { field: "id", operator: "eq", value: product?.id },
    ]);
    setProduct(product);
  };

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

  return (
    <div>
      <div className="row justify-content-end mb-3">
        <CustomerAutocomplete
          className="col-md-4"
          value={customer}
          onChange={handleCustomerChange}
          searchValue={customerSearch}
          setSearchValue={handleCustomerSearch}
        />
        <ProductAutocomplete
          className="col-md-4"
          value={product}
          onChange={handleProductChange}
        />
      </div>
      <table className="table table-bordered table-striped table-hover">
        <InvoicesTableHeader headers={tableHeaders} />
        <tbody>
          {invoicesList?.map((invoice) => (
            <InvoicesTableRow key={invoice.id} invoice={invoice} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesTable;
