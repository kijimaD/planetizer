import "./App.less";
import { TopPage } from "./pages/TopPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { AppLayout } from "./pages/AppLayout";
import { FeedProvider } from "./hooks/FeedProvider";

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <FeedProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="/" element={<TopPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </FeedProvider>
    </ChakraProvider>
  );
}

export default App;
