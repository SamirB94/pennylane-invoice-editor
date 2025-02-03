const TableHeaders = ({ headers }: { headers: string[] }) => {
  if (!headers) return null;

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

export default TableHeaders;
