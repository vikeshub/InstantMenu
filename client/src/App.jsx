import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1 className="text-8xl font-bold underline font-extrabold">Hello world!</h1>
      <Button onClick={() => alert('Shadcn UI Button Clicked!')}>Shadcn Button</Button>
    </div>
  );
}

export default App;
