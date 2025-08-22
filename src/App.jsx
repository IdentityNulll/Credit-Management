import React from "react";
import Home from "./Pages/Home/Home.jsx";

function App() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.ready();   // notify Telegram we're ready
      tg.expand();  // make it fullscreen

      // Get user info if available
      console.log("hello")
      if (tg.initDataUnsafe?.user) {
        setUsername(tg.initDataUnsafe.user.first_name);
      }
    } else {
      console.log("Telegram WebApp API not found");
    }
  }, []);
  return (
    <div>
      <Home />
    </div>
  );
}

export default App;
