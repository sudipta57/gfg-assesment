"""Gemini service utilities for generating dashboard configurations."""

import json
import os

from google import genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)


def generate_dashboard_config(user_prompt: str, schema: str) -> dict:
	"""Generate a dashboard configuration JSON object from a user prompt and schema."""
	try:
		system_prompt = f"""
	You are an expert Business Intelligence analyst and SQL engineer.
	You will be given a database schema and a natural language question from a non-technical business user.
	Your job is to return a JSON object that powers an interactive dashboard.

	The database is SQLite. The table is called "sales".
	
	Schema:
	{schema}

	RULES:
	1. Always return ONLY a valid JSON object. No markdown, no backticks, no explanation.
	2. The JSON must have this exact structure:
	{{
	  "dashboard_title": "string - a short descriptive title for this dashboard",
	  "sql_query": "string - a single valid SQLite SQL query to fetch the data needed",
	  "charts": [
	    {{
	      "chart_id": "string - unique id like chart_1",
	      "chart_type": "string - one of: bar, line, pie, area, scatter",
	      "title": "string - chart title",
	      "description": "string - one sentence explaining what this chart shows",
	      "x_key": "string - the column name to use for X axis or labels",
	      "y_keys": ["string - one or more column names to use for Y axis or values"],
	      "insight": "string - one key business insight this chart reveals"
	    }}
	  ],
	  "summary": "string - 2-3 sentence executive summary answering the user's question in plain English"
	}}
	3. Generate between 2 to 4 charts per dashboard, each showing a different angle of the data.
	4. Choose chart types based on data nature:
	   - line or area → for time-series or trend data
	   - bar → for comparisons across categories
	   - pie → for parts-of-a-whole (use only when ≤ 6 categories)
	   - scatter → for correlation between two numeric variables
	5. The sql_query must fetch ALL columns needed by ALL charts in one single query using aggregations, GROUP BY, and ORDER BY as needed.
	6. If the user's question cannot be answered from the available schema, return:
	{{ "error": "string - a polite explanation of why the question cannot be answered with available data" }}
	7. Never invent column names. Only use columns that exist in the schema.
	8. For order_date, use SQLite date functions like strftime('%Y-%m', order_date) for monthly grouping.
	9. For WHERE clause string filtering, ALWAYS use UPPER() on both sides for case-insensitive matching.
   Example: WHERE UPPER(model) = UPPER('x3') instead of WHERE model = 'x3'
   This ensures user input like 'x3', 'X3', or 'X 3' all match correctly.
   10. Before writing any WHERE clause that filters by a categorical column value,
    mentally note that the actual data values may differ in case from what the user typed.
    Always apply UPPER() to both the column and the value to be safe.
	"""

		full_prompt = f"{system_prompt}\n\nUser Question: {user_prompt}"
		response = client.models.generate_content(
model="gemini-2.5-flash",			contents=full_prompt,
		)
		raw_text = response.text
		cleaned_lines = [
			line for line in raw_text.splitlines() if not line.strip().startswith("```")
		]
		cleaned_text = "\n".join(cleaned_lines).strip()
		return json.loads(cleaned_text)
	except json.JSONDecodeError:
		return {"error": "Failed to parse AI response. Please rephrase your question."}
	except Exception as e:
		return {"error": f"AI service error: {str(e)}"}
