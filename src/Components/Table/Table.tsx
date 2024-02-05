import React from "react";

const Table = ({ title, headers, data, onEdit }) => {
  return (
    <div className="table-container table-card">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((info) => (
            <tr key={info.id}>
              <td>
                {info.date}
              </td>
              {headers.map((header, index) => (
                <td key={index}>
                  {info.choices[header.toLowerCase()] > 0
                    ? info.choices[header.toLowerCase()]
                    : "X"}
                </td>
              ))}
              <td>
                <button onClick={() => onEdit(info)}>Edit Request</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
