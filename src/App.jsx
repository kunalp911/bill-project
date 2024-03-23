import { useState } from "react";
import AppRouter from "./route/AppRouter";
import PublicRouter from "./route/PublicRouter";

function App() {
  const Token = localStorage.getItem("@userData")
  console.log("token",Token)

  return (
    <>
    {
      Token ? <AppRouter/> : <PublicRouter/>
    }
    </>
  );
}

export default App;
