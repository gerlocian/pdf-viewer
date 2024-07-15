import { EventHandler, EventType } from '../../services/event-handler/event-handler.mjs';
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

        EventHandler.subscribe(EventType.PagesLoaded, this.#renderPages.bind(this));
        EventHandler.subscribe(EventType.PagesLoaded, this.#monitorPages.bind(this));  
    }

    disconnectedCallback() {
        this.#pdfService.cleanup();
        this.innerHTML = '';
    }

    #renderPages() {
        this.#pdfService.renderAllPages().forEach(page => this.append(page));
    }

    async #monitorPages() {
        console.log(await this.#pdfService.getDisplayAnnotationsForPage(1));
    }
}