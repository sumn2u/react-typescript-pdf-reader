import React from "react";
import PDFReader from "../lib";
import "./app.css";

// const App = () => (

class App extends React.Component {
    state = {
        pdfUrl: 'https://arxiv.org/pdf/1801.10031v1.pdf' // or use an EmptyState
    }

  render() {
    let { pdfUrl } = this.state
    return (
      <div>
        <div className="container">
          <h1>React PDF Reader</h1>
          <p>
            current Page: <strong>{this.state.currentPage}</strong>
          </p>
          <hr />
 
          <PDFReader pdfUrl={pdfUrl} />

        </div>
      </div>
    );
  }
}
export default App;
