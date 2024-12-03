import { useRoutes } from "react-router-dom";
import Router from "./routes/Router";

function App() {
  const components = useRoutes(Router);
  return components;
}

export default App;
