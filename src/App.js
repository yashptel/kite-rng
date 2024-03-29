import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { Outlet } from "react-router-dom";
import "./App.css";
import { COMPANY_NAME } from "./constants";

import { initFlowbite } from "flowbite";
import Footer from "./components/footer";

const App = () => {
  useEffect(() => {
    initFlowbite();
  }, []);

  return (
    <div className="min-h-full flex flex-col">
      <Helmet
        title={`Software Development Agency, Product Enginnering & Solutions Company | ${COMPANY_NAME}`}
        meta={[
          {
            name: "description",
            content:
              "Software Development Agency, Product Enginnering & Solutions Company. We are a team of developers who love to create beautiful and functional websites.",
          },
          { name: "keywords", content: "home, page" },
        ]}
      />

      <Outlet />

      <Footer />
    </div>
  );
};

export default App;
