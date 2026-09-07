import React from 'react';
import { createRoot } from 'react-dom/client';
/* No slick and no flexboxgrid. Both were left over from the agency template:
   ~15.6kB of raw CSS shipped in every bundle for a carousel that does not
   exist and a grid whose class names appear nowhere outside its own file.
   The layout is styled-components and a handful of helpers in index.css. */
import './style/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// createRoot must come from react-dom/client. Imported from react-dom it is
// the unsupported legacy shim, which React 18 warns about.
const root = createRoot(document.getElementById("root"));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
