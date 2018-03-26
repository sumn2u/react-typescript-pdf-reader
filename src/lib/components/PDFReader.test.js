import React from "react";
import ReactDOM from "react-dom";
import PDFReader from "./PDFReader";

it("PDFReader renders without crashing", () => {
  const div = document.createElement("div");
  let pdfUrl = 'https://arxiv.org/pdf/1801.10031v1.pdf'
  ReactDOM.render(<PDFReader pdfUrl={pdfUrl} />, div);
});
