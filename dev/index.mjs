import PdfViewerComponent from '../src/component.mts';
PdfViewerComponent.registerElement();

const test = document.createElement('object');
test.setAttribute('type', 'application/pdf');
test.setAttribute('data', 'test-single-page.pdf');

const element = document.createElement(PdfViewerComponent.tagName);
element.setAttribute('href', 'test-single-page.pdf');

document.body.append(test);
document.body.append(element);