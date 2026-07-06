export const getFilteredRows = (rows, searchText) => {
  return rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );
};

export const getPaginatedRows = (rows, currentPage, rowsPerPage) => {
  const startIndex = (currentPage - 1) * rowsPerPage;
  return rows.slice(startIndex, startIndex + rowsPerPage);
};

export const getChartData = (rows, columns) => {
  const textColumn = columns.find((column) => column.type === "text");
  const numberColumn = columns.find((column) => column.type === "number");

  if (!textColumn || !numberColumn) {
    return {
      chartData: [],
      chartLabelKey: "",
      chartValueKey: "",
    };
  }

  return {
    chartData: rows.slice(0, 8).map((row) => ({
      [textColumn.name]: row[textColumn.name],
      [numberColumn.name]: Number(row[numberColumn.name]) || 0,
    })),
    chartLabelKey: textColumn.name,
    chartValueKey: numberColumn.name,
  };
};