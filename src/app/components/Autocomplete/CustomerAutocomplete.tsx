import { useCallback } from "react";
import { AsyncPaginate, LoadOptions } from "react-select-async-paginate";

import { Customer } from "types";
import { useApi } from "api";
import { GroupBase } from "react-select";

interface CustomerAutocompleteProps {
  value: Customer | null;
  onChange: (Customer: Customer | null) => void;
  searchValue: string;
  setSearchValue: (searchValue: string) => void;
  className?: string;
}

const defaultAdditional = { page: 1 };

const getCustomerLabel = (customer: Customer) => {
  return `${customer.first_name} ${customer.last_name}`;
};

const CustomerAutocomplete = ({
  value,
  onChange,
  className,
  searchValue,
  setSearchValue,
}: CustomerAutocompleteProps) => {
  const api = useApi();

  const loadOptions: LoadOptions<
    Customer,
    GroupBase<Customer>,
    { page: number }
  > = useCallback(
    async (search, loadedOptions, additional) => {
      console.log("LOAD OPTIONS: ", loadedOptions);
      const page = additional?.page ?? 1;
      const { data } = await api.getSearchCustomers({
        query: searchValue ?? "",
        per_page: 10,
        page,
      });
      return {
        options: data.customers,
        hasMore: data.pagination.page < data.pagination.total_pages,
        additional: {
          page: page + 1,
        },
      };
    },
    [api, searchValue]
  );

  return (
    <AsyncPaginate
      className={className}
      placeholder="Search a customer"
      getOptionLabel={getCustomerLabel}
      additional={defaultAdditional}
      value={value}
      onChange={onChange}
      inputValue={searchValue}
      onInputChange={setSearchValue}
      loadOptions={loadOptions}
      debounceTimeout={300}
    />
  );
};

export default CustomerAutocomplete;
