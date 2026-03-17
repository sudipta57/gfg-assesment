"""Database utilities for initializing and querying the sales database."""

import os
import sqlite3

import pandas

DB_PATH = "backend/sales.db"
CSV_PATH = "backend/data/amazon_sales.csv"


def _resolve_path(path: str) -> str:
	"""Resolve a backend-relative path to an absolute filesystem path."""
	backend_dir = os.path.dirname(os.path.abspath(__file__))
	normalized_path = path[len("backend/") :] if path.startswith("backend/") else path
	return os.path.join(backend_dir, normalized_path)


def _resolve_csv_path() -> str:
	"""Resolve the source CSV path, with fallback to any CSV file in backend/data."""
	default_csv_path = _resolve_path(CSV_PATH)
	if os.path.exists(default_csv_path):
		return default_csv_path

	data_dir = _resolve_path("backend/data")
	if not os.path.isdir(data_dir):
		return default_csv_path

	for filename in sorted(os.listdir(data_dir)):
		if filename.lower().endswith(".csv"):
			return os.path.join(data_dir, filename)

	return default_csv_path


def read_csv_with_fallback(file_path: str) -> pandas.DataFrame:
	"""Read a CSV file using a sequence of common encodings."""
	encodings = ["utf-8", "utf-8-sig", "latin1", "cp1252"]
	last_error = None

	for encoding in encodings:
		try:
			return pandas.read_csv(file_path, encoding=encoding)
		except UnicodeDecodeError as error:
			last_error = error

	if last_error is not None:
		raise last_error

	return pandas.read_csv(file_path)


def init_db() -> None:
	"""Initialize the SQLite database from the source CSV if it does not yet exist."""
	db_file = _resolve_path(DB_PATH)
	csv_file = _resolve_csv_path()

	if os.path.exists(db_file):
		return

	os.makedirs(os.path.dirname(db_file), exist_ok=True)
	dataframe = read_csv_with_fallback(csv_file)
	dataframe.columns = [
		column.strip().lower().replace(" ", "_") for column in dataframe.columns
	]
	connection = sqlite3.connect(db_file)

	try:
		dataframe.to_sql("sales", connection, if_exists="replace", index=False)
	finally:
		connection.close()

	print("Database initialized successfully")


def get_connection() -> sqlite3.Connection:
	"""Create and return a SQLite connection with dictionary-style row access."""
	connection = sqlite3.connect(_resolve_path(DB_PATH))
	connection.row_factory = sqlite3.Row
	return connection


def get_schema() -> str:
	"""Return a formatted schema description for the sales table."""
	connection = get_connection()

	try:
		cursor = connection.execute("PRAGMA table_info(sales)")
		columns = cursor.fetchall()
	finally:
		connection.close()

	lines = ["Table: sales", "Columns:"]
	lines.extend(f"- {column['name']} ({column['type']})" for column in columns)
	return "\n".join(lines)
