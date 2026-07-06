const detectReportType = (columns) => {
  const columnText = columns
    .map((column) => column.name)
    .join(" ")
    .toLowerCase();

  const reportRules = [
    {
      type: "sales",
      keywords: ["sales", "revenue", "amount", "order", "customer", "product"],
    },
    {
      type: "inventory",
      keywords: ["stock", "inventory", "quantity", "sku", "warehouse"],
    },
    {
      type: "hr",
      keywords: ["employee", "salary", "department", "designation", "attendance"],
    },
    {
      type: "finance",
      keywords: ["expense", "profit", "loss", "budget", "payment", "invoice"],
    },
    {
      type: "students",
      keywords: ["student", "marks", "grade", "roll", "attendance", "course"],
    },
  ];

  for (const rule of reportRules) {
    const isMatch = rule.keywords.some((keyword) =>
      columnText.includes(keyword)
    );

    if (isMatch) {
      return rule.type;
    }
  }

  return "custom";
};

module.exports = {
  detectReportType,
};