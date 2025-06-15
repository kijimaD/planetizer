import "./App.less";
import { TopPage } from "./pages/TopPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { AppLayout } from "./pages/AppLayout";

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<TopPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ChakraProvider>
  );
}

export default App;
