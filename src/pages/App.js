import { useFetch } from "../hooks/useFetch";

function App() {
  const baseURL = "https://fe.it-academy.by/Examples/words_tree/";
  const entryPoint = "root.txt";

  const { isLoading, error, response } = useFetch(baseURL, entryPoint);

  if (isLoading) {
    return <div className="loader">Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Something went wrong</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <p>{response}</p>
    </div>
  );
}

export default App;
