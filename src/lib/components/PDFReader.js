import * as React from 'react';
import './PDFReader.css';
const PDFJS = require('pdfjs-dist') // tslint:disable-line

/**
 * PDFReader
 *
 * @class PDFReader
 * @extends {React.Component<PDFReaderProps, PDFReaderState>}
 */

export interface PDFReaderProps {
   pdfUrl?: string
}

export interface PDFReaderState {
    pdfUrl?: string
}


class PDFReader extends React.Component<PDFReaderProps, PDFReaderState> {
    refs: {
        canvas: HTMLCanvasElement,
        prev: HTMLElement,
        next: HTMLElement,
        page_num: HTMLElement,
        page_count: HTMLElement,
        zoomin: HTMLElement,
        zoomout: HTMLElement,
        downloadpdf: HTMLElement
    }

    constructor(props: PDFReaderProps) {
        super(props)
        if(props.pdfUrl.length && props.pdfUrl !== undefined ) {
         setTimeout(() =>{
            this.readPDF()
          }, 500);
        }

    }

    readPDF = () => {
        let url = this.props.pdfUrl
        // Disable workers to avoid yet another cross-origin issue (workers need
        // the URL of the script to be loaded, and dynamically loading a cross-origin
        // script does not work).let canvas =this.refs.canvas
        PDFJS.disableWorker = true

        let pdfDoc: any,
            pageNum = 1,
            pageRendering = false,
            pageNumPending: any,
            scale = 1,
            canvas = this.refs.canvas,
            ctx = canvas.getContext('2d')

      /**
      * Get page info from document, resize canvas accordingly, and render page.
      * @param num Page number.
      */
        let renderPage = (num: any) => {
            pageRendering = true
            // Using promise to fetch the page
            pdfDoc.getPage(num).then((page: any) => {
                let viewport = page.getViewport(scale)
                canvas.height = viewport.height
                canvas.width = viewport.width

                // Render PDF page into canvas context
                let renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                }
                let renderTask = page.render(renderContext)

                // Wait for rendering to finish
                renderTask.promise.then(() => {
                    pageRendering = false
                    if (pageNumPending !== null && pageNumPending) {
                        // New page rendering is pending
                        renderPage(pageNumPending)
                        pageNumPending = null
                    }
                })
            })

            // Update page counters
            this.refs.page_num.textContent = String(pageNum)
        }

        /**
        * If another page rendering in progress, waits until the rendering is
        * finised. Otherwise, executes rendering immediately.
        */
        function queueRenderPage(num: any) {
            if (pageRendering) {
                pageNumPending = num
            } else {
                renderPage(num)
            }
        }

        /**
        * Displays previous page.
        */
        function onPrevPage() {
            if (pageNum <= 1) {
                return
            }
            pageNum--
            queueRenderPage(pageNum)
        }
        this.refs.prev.addEventListener('click', onPrevPage)

        /**
        * Displays next page.
        */
        function onNextPage() {
            if (pageNum >= pdfDoc.numPages) {
                return
            }
            pageNum++
            queueRenderPage(pageNum)
        }
        this.refs.next.addEventListener('click', onNextPage)

        /**
        * Asynchronously downloads PDF.
        */
        PDFJS.getDocument(url).then((pdfDoc_: any) => {
            pdfDoc = pdfDoc_

            this.refs.page_count.textContent = pdfDoc.numPages

            // Initial/first page rendering
            renderPage(pageNum)
        })

        /**
        * display page
        */

        function displayPage(page_num: number) {
            console.log(page_num, 'page_num')
            pdfDoc.getPage(page_num).then((page: any) => {
                renderPage(page_num)
            })
            // pdfDoc.getPage(page_num).then(function getPage(page_num) { renderPage(page_num) })
        }
        /**
        * zoom in scale by 0.25
        */
        function zoomIn() {
            scale = scale + 0.25
            displayPage(pageNum)
        }


        this.refs.zoomin.addEventListener('click', zoomIn)



        /**
        * zoom out downscale by 0.25
        */
        function zoomOut() {
            if (scale <= 0.25) return
            scale = scale - 0.25
            displayPage(pageNum)
        }

        this.refs.zoomout.addEventListener('click', zoomOut)


    }

    render() {
        return (<div className="pdf-btn-wrap">
            <div className="pdf-next-prev">
                <button ref="prev"><i className="lms lms-arrow"></i></button>
                <button className="nextPage" ref="next"><i className="lms lms-arrow"></i></button>
            </div>
            <div className="pdf-page">
                <span>Page: <span ref="page_num"></span> / <span ref="page_count"></span></span>
            </div>
            <div className="pdf-zoom">
                <span ref="zoomin">Zoom in</span> <span ref="zoomout">Zoom out</span>
            </div>
            <div className="pdf-download">
                {this.props.pdfUrl ? (<a href={this.props.pdfUrl}><i className="lms lms-download"></i></a>) : ''}
            </div>
            <canvas ref="canvas" className="pdf-file" />
            </div>)

    }
}

export default PDFReader
