import { InvoicesTable } from "app/components/Invoice";
import { FC } from "react";

const InvoicesListPage: FC = () => {
  return (
    <div className="mt-4">
      <InvoicesTable />
    </div>
  );
};

export default InvoicesListPage;
