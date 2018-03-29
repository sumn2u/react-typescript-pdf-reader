import React from "react";
import PDFReader from "../lib";
import "./app.css";


class App extends React.Component {
    state = {
        pdfUrl: 'https://arxiv.org/pdf/1801.10031v1.pdf' // or use an EmptyState
    }

  render() {
    let { pdfUrl } = this.state
    return (
      <div>
        <div className="container">
          <h1><i className="pdf pdf-pdf"></i> React PDFReader</h1>
          <hr />

          <PDFReader pdfUrl={pdfUrl} />

        </div>
      </div>
    );
  }
}
export default App;
