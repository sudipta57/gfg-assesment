import requests
import json
import sys

BASE_URL = "http://localhost:8000"


def print_result(title: str, response: requests.Response) -> None:
    """Print a formatted summary of a test response."""
    print("=" * 60)
    print(title)
    print(f"Status Code: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        if "charts" in data:
            print(f"Dashboard Title: {data['dashboard_title']}")
            print(f"Summary: {data['summary']}")
            print(f"Number of charts: {len(data['charts'])}")
            for chart in data["charts"]:
                print(f"Chart Title: {chart['title']}")
                print(f"Chart Type: {chart['chart_type']}")
                print(f"Chart Insight: {chart['insight']}")
                print(f"Data Rows: {len(chart['data'])}")
            print(f"SQL Used: {data['raw_sql']}")
        else:
            print(json.dumps(data, indent=2))
    else:
        print(f"Error: {response.text}")

    print("=" * 60)


def run_tests() -> None:
    """Run end-to-end API pipeline tests."""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print_result("TEST 1: Health Check", response)

        response = requests.get(f"{BASE_URL}/schema")
        print_result("TEST 2: Schema Check", response)

        response = requests.post(
            f"{BASE_URL}/query",
            json={
                "prompt": "Show me total revenue by product category",
                "session_id": "test",
            },
        )
        print_result("TEST 3: Simple Query - Revenue by Category", response)

        response = requests.post(
            f"{BASE_URL}/query",
            json={
                "prompt": "Show me monthly revenue trend for all regions in 2023 and highlight which payment method is most popular",
                "session_id": "test",
            },
        )
        print_result("TEST 4: Complex Query - Monthly Trend + Payment Method", response)

        response = requests.post(
            f"{BASE_URL}/query",
            json={
                "prompt": "Show me the weather forecast for next week",
                "session_id": "test",
            },
        )
        print_result("TEST 5: Error Handling - Out of scope question", response)
    except requests.RequestException as error:
        print(f"Request failed: {error}")
        sys.exit(1)


if __name__ == "__main__":
    print("Starting BI Dashboard Pipeline Tests...")
    print("Make sure the server is running at http://localhost:8000")
    run_tests()
    print("All tests completed.")
