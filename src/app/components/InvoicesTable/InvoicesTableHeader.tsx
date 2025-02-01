const InvoicesTableHeader = ({ headers }: { headers: string[] }) => {
  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    </thead>
  );
};

export default InvoicesTableHeader;
