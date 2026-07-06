const axios = require("axios");

const buildSummaryPrompt = (dataset) => {
  const sampleRows = dataset.rows.slice(0, 20);

  return `
You are a business data analyst.

Analyze this dataset and generate a concise executive summary.

Dataset name: ${dataset.name}
Report type: ${dataset.reportType}
Rows: ${dataset.rowCount}
Columns: ${dataset.columnCount}
Numeric columns: ${dataset.numericColumns.join(", ")}

Sample rows:
${JSON.stringify(sampleRows, null, 2)}

Return the response in Markdown using exactly this structure.

# Executive Summary

Write 2-3 short paragraphs.

# Key Insights

- Insight 1
- Insight 2
- Insight 3

# Recommendations

- Recommendation 1
- Recommendation 2
- Recommendation 3

Keep the response under 300 words.
`;
};

const generateAISummary = async (dataset) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const prompt = buildSummaryPrompt(dataset);

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};

module.exports = {
  generateAISummary,
};