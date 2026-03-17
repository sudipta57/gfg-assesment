"""Query processing utilities for dashboard generation and SQL execution."""

import json

import pandas as pd

from database import get_connection, get_schema
from gemini_service import generate_dashboard_config


def execute_sql(sql_query: str) -> list[dict]:
	"""Execute a SQL query and return the result as a list of rounded row dictionaries."""
	connection = None

	try:
		connection = get_connection()
		dataframe = pd.read_sql_query(sql_query, connection)
		rows = dataframe.to_dict(orient="records")

		for row in rows:
			for key, value in row.items():
				if isinstance(value, float):
					row[key] = round(value, 2)

		return rows
	except Exception as e:
		raise ValueError(f"SQL execution failed: {str(e)}") from e
	finally:
		if connection is not None:
			connection.close()


def process_query(user_prompt: str) -> dict:
	"""Process a user query into a dashboard configuration populated with query results."""
	schema = get_schema()
	config = generate_dashboard_config(user_prompt, schema)

	if "error" in config:
		return {"success": False, "error": config["error"]}

	try:
		sql_query = config["sql_query"]
		data_rows = execute_sql(sql_query)

		for chart in config["charts"]:
			chart["data"] = data_rows

		return {
			"success": True,
			"dashboard_title": config["dashboard_title"],
			"summary": config["summary"],
			"charts": config["charts"],
			"raw_sql": sql_query,
		}
	except ValueError as e:
		return {"success": False, "error": str(e)}
	except Exception as e:
		return {"success": False, "error": f"Pipeline error: {str(e)}"}
