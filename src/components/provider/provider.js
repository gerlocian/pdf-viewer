// const { EventHandler, EventType } = require('services/event-handler/event-handler');
// const { PdfService } = require('services/pdf-service/pdf-service');

class PdfViewerProvider extends HTMLElement {
    static observedAttributes = ['href'];

    constructor() {
        super();
    }

    connectedCallback() {}

    disconnectedCallback() {}
}