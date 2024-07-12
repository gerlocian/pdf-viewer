// const { EventHandler, EventType } = require('services/event-handler/event-handler');
import { PdfService } from '../../services/pdf-service/pdf-service.mjs';

export class PdfViewerProvider extends HTMLElement {
    static observedAttributes = ['href'];

    #pdfService;

    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.getAttribute('href')) return;
        this.#pdfService = new PdfService(this.getAttribute('href'));
        this.#pdfService.renderAllPages().forEach(page => this.append(page));
    }

    disconnectedCallback() {
        this.#pdfService.cleanup();
        this.innerHTML = '';
    }
}