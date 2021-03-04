import React from "react";
import { useTable } from "react-table";
import { useHistory } from "react-router-dom";
import "./table.css";

interface ITableProps {
    data: any[],
    columns: any[]
}

const Table = ({data, columns}: ITableProps) => {
  const history = useHistory();
  data = React.useMemo(
    () => data,
    [data]
  )

  columns = React.useMemo(
    () => columns,
    [columns]
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} onClick={() => history.push(`/pool/${data[row.id].address}`)}>
                {row.cells.map(cell => {
                    return (
                    <td
                        {...cell.getCellProps()}>
                            {cell.render("Cell")}
                    </td>
                )
                })}
            </tr>
            
          )
        })}
      </tbody>
    </table>
  )
}

export default Table;