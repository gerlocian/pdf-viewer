const { getDocument } = require('pdfjs-dist');
const { EventHandler, EventType } = require('services/event-handler/event-handler');

class PdfService {
    #href;
    #pages;
    #pdf;
    #totalPages;

    constructor(href) {
        this.#href = href;
        this.#pages = [];
        this.#pdf = null;
        this.#processPDF();
    }

    getPage(pageNumber) {
        if (pageNumber >= this.#totalPages) return this.#pages[this.#totalPages];
        if (pageNumber <= 1)                return this.#pages[1];
        return this.#pages[pageNumber - 1];
    }

    async #processPDF() {
        this.#pdf = await getDocument(this.#href).promise;
        this.#totalPages = this.#pdf.numPages;
        this.#loadPage(1);
    }

    async #loadPage(pageNumber) {
        if (pageNumber > this.#totalPages) return;
        this.#pages = [...this.#pages, await this.#pdf?.getPage(pageNumber)];
        this.#loadPage(pageNumber + 1);
    }
}

module.exports.PdfService = PdfService;