import { GlobalWorkerOptions, getDocument, PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

export default class PdfViewerElement extends HTMLElement {
    static observedAttributes = ['href'];
    static tagName = 'pogh-pdf-viewer';

    private canvas: HTMLCanvasElement;
    private currentPage: number;
    private outputScale: number;
    private pdf: PDFDocumentProxy | void;
    private totalPages: number;

    static registerElement(): void {                
        if (customElements && !customElements.get(PdfViewerElement.tagName))
            customElements.define(PdfViewerElement.tagName, PdfViewerElement);
    }
    
    constructor() {
        super();
        this.canvas = document.createElement('canvas');
        this.currentPage = 1;
        this.outputScale = window.devicePixelRatio || 1;
        this.pdf = undefined;
        this.totalPages = 0;

        GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();
    }

    public async renderPdf(pdfUrl?: string | URL | null): Promise<void> {
        if (!pdfUrl) return;

        this.pdf = this.pdf || await this.readPdfFile(pdfUrl);
        if (!this.pdf) return;

        this.totalPages = this.pdf?.numPages || 0;
        this.renderPage(1);
    }

    public async renderPage(pageNumber: number): Promise<void> {
        const page = await this.readPdfPage(this.currentPage);
        
    }

    public attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void {
        if (attributeName === 'href' && oldValue !== newValue) {
            this.pdf = undefined;
            this.currentPage = 1;
            this.renderPdf(newValue);
        }
    }

    public connectedCallback(): void {
        this.append(this.canvas);
        this.renderPdf(this.getAttribute('href'));
    }

    public disconnectedCallback(): void {
        this.canvas.remove();
    }

    private clearPdf(): void {
        this.currentPage = 1;
        this.pdf = undefined;
    }

    private async readPdfFile(url: string | URL): Promise<PDFDocumentProxy | void> {
        try {
            return await getDocument(url).promise;
        } catch (e) {
            console.warn(`Could not read document at ${url}.`);
            console.warn(e);
            this.pdf = undefined;
            return;
        }
    }

    private async readPdfPage(pageNumber: number): Promise<PDFPageProxy | void> {
        try {
            return await this.pdf?.getPage(pageNumber);
        } catch (e) {
            console.warn(`Could not read page ${pageNumber} from pdf.`);
            return;
        }
    }
}
