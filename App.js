import React, { useState } from "react";
import "./App.css"; // Optional: for separate styling if needed

const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ5ODc4OTUwLCJpYXQiOjE3NDk4Nzg2NTAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM0Yzk0MGEyLTFlMzYtNDRlZi1iMjBiLTJjYWNhNWM2YTk1YyIsInN1YiI6InNhbmphbmFzYW5qdTI0MzA3QGdtYWlsLmNvbSJ9LCJlbWFpbCI6InNhbmphbmFzYW5qdTI0MzA3QGdtYWlsLmNvbSIsIm5hbWUiOiJzYW5qYW5hIHJlZGR5IG4iLCJyb2xsTm8iOiIyMmNkMDQ4IiwiYWNjZXNzQ29kZSI6InBtVnNFaCIsImNsaWVudElEIjoiYzRjOTQwYTItMWUzNi00NGVmLWIyMGItMmNhY2E1YzZhOTVjIiwiY2xpZW50U2VjcmV0IjoiWVpmekJVc0ZtdWVKcVFtRiJ9.TMm14lLDcXFpS4eMn4au45jC1m08aDR2MBgbaQTromU";

function App() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStockPrice = async () => {
    if (!symbol) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(
        `http://20.244.56.144/evaluation-service/stock?symbol=${symbol}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error ${response.status}: ${errorMessage}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📈 Stock Price Aggregator</h1>

      <div style={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          style={styles.input}
        />
        <button onClick={fetchStockPrice} disabled={loading || !symbol} style={styles.button}>
          {loading ? "Fetching..." : "Fetch Price"}
        </button>
      </div>

      {error && <p style={styles.error}>❌ {error}</p>}

      {data && (
        <div style={styles.resultCard}>
          <h2>📊 Result</h2>
          <p><strong>Symbol:</strong> {symbol}</p>
          <pre style={styles.result}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// Inline styles for quick design (feel free to move to App.css)
const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    marginTop: "3rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "2rem",
    color: "#343a40",
    marginBottom: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    width: "60%",
    borderRadius: "4px",
    border: "1px solid #ced4da",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "#dc3545",
    marginBottom: "1rem",
  },
  resultCard: {
    backgroundColor: "#ffffff",
    padding: "1rem",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    textAlign: "left",
  },
  result: {
    fontSize: "0.95rem",
    backgroundColor: "#f1f3f5",
    padding: "0.75rem",
    borderRadius: "4px",
    overflowX: "auto",
  },
};

export default App;
