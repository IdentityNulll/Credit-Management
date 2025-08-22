import React from 'react'
import Home from './Pages/Home/Home.jsx'

function App() {
    useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      console.log("Telegram initialized", tg.initDataUnsafe);
    } else {
      console.log("Telegram WebApp API not found");
    }
  }, []);
  return (
    <div>
      <Home />  
    </div>
  )
}

export default App
