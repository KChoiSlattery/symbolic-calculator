import React from "react";
import { createRoot } from "react-dom/client";

function MyButton({ title }: { title: string }) {
    return (
      <button>{title}</button>
    );
  }
  
const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<MyButton title="aaglksa" />);