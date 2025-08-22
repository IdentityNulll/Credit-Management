import React from 'react'
import Home from './Pages/Home/Home.jsx'
import React, { useEffect, useState } from "react";

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setUsername(tg.initDataUnsafe.user.first_name);
      }
    }
  }, []);
  return (
    <div>
      <Home />  
    </div>
  )
}

export default App
