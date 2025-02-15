import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { EventHandler, EventType } from '../event-handler/event-handler.mjs';

GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();

export class PdfService {
    #href;
    #pages;
    #pdf;
    #scale;
    #totalPages;

    constructor(href) {
        this.#href = href;
        this.#scale = window?.devicePixelRatio || 1;
        this.#resetPdf();
        this.#processPDF();
    }

    cleanup() {
        this.#resetPdf();
    }

    async getDisplayAnnotationsForPage(pageNumber) {
        return await this.getPage(1).getAnnotations({ intent: 'display' });
    }

    getPage(pageNumber) {
        return this.#pages[this.#validatePageNumber(pageNumber) - 1];
    }

    getViewportForPage(pageNumber, scale = 2.0) {
        return this.getPage(pageNumber).getViewport({ scale });
    }

    renderAllPages() {
        return this.#pages.map(page => {
            const canvas = document?.createElement('canvas');
            this.renderPageToCanvas(page.pageNumber, canvas);
            return canvas;
        });
    }

    renderPageToCanvas(pageNumber, canvas /* ref */) {
        if (!canvas instanceof HTMLCanvasElement) throw new Error('canvas was not an HTMLCanvasElement');

        const viewport = this.getViewportForPage(pageNumber);
        const context = canvas.getContext('2d');
        const transform = this.#scale !== 1 ? [this.#scale, 0, 0, this.#scale, 0, 0] : null;
        const renderContext = { canvasContext: context, transform, viewport, intent: 'any', isEditing: true };

        canvas.width = Math.floor(viewport.width * this.#scale);
        canvas.height = Math.floor(viewport.height * this.#scale);
        canvas.style.width = Math.floor(viewport.width * this.#scale);
        canvas.style.height = Math.floor(viewport.height * this.#scale);

        this.getPage(pageNumber)?.render(renderContext);
    }

    #loadPage(pageNumber) {
        return this.#pdf?.getPage(pageNumber);
    }

    async #processPDF() {
        let promises = [];

        this.#pdf = await getDocument({ url: this.#href, enableXfa: true }).promise;
        this.#totalPages = this.#pdf.numPages;
        EventHandler.emit(EventType.PdfLoaded);

        for(let index = 0; index < this.#totalPages; index++) {
            promises = [...promises, this.#loadPage(index + 1)];
        }
        this.#pages = await Promise.all(promises);
        EventHandler.emit(EventType.PagesLoaded);
    }

    #resetPdf() {
        if (this.#pages?.length !== 0) this.#pages?.forEach(page => page.cleanup());
        this.#pdf?.cleanup();

        this.#pages = [];
        this.#pdf = null;
    }

    #validatePageNumber(pageNumber) {
        return [
            this.#validateMinPage.bind(this),
            this.#validateMaxPage.bind(this)
        ].reduce((num, cb) => cb(num), pageNumber);
    }

    #validateMaxPage(pageNumber) {
        return pageNumber >= this.#totalPages ? this.#totalPages : pageNumber;
    }

    #validateMinPage(pageNumber) {
        return pageNumber <= 1 ? 1 : pageNumber;
    }
}