import React from 'react';

type Props = {
  children?: React.ReactNode;
  className?: string;
  key?: any;
};

const Table = ({ children, className }: Props) => {
  return (
    <>
      <div className="w-11/12 md:w-full overflow-x-auto mx-auto">
        <table
          className={
            className ||
            'mx-auto w-full rounded-lg bg-white shadow-lg mt-5 overflow-auto'
          }
        >
          {children}
        </table>
      </div>
    </>
  );
};

const TableBody: React.FC<Props> = ({ children, className }) => {
  return <tbody className={className || 'overflow-auto'}>{children}</tbody>;
};

const TableRow: React.FC<Props> = ({ children, className }) => {
  return (
    <tr className={className || 'text-gray-600 text-center'}>{children}</tr>
  );
};

const TableHeader: React.FC<Props> = ({ children, className }) => {
  return <thead className={className || 'bg-white rounded'}>{children}</thead>;
};

const TableHeaderCell: React.FC<Props> = ({ children, className }) => {
  return (
    <th className={className || 'text-gray-600 text-center'}>{children}</th>
  );
};

const TableDataCell: React.FC<Props> = ({ children, className }) => {
  return (
    <td className={className || 'text-gray-600 text-center'}>{children}</td>
  );
};

Table.Row = TableRow;
Table.Body = TableBody;
Table.Header = TableHeader;
Table.HeaderCell = TableHeaderCell;
Table.DataCell = TableDataCell;

export default Table;
