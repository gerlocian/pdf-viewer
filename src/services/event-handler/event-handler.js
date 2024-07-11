module.exports.EventHandler = class EventHandler {
    static events = {};

    static emit(event, params) {
        if (!EventHandler.events[event]) return;
        EventHandler.events[event].forEach(callback => callback(params));
    }

    static subscribe(event, callback) {
        EventHandler.events[event] = EventHandler.events[event]
            ? [ ...EventHandler.events[event], callback ]
            : [ callback ];

        return () => EventHandler.events[event].filter(cb => cb !== callback);
    }
}

module.exports.EventType = Object.defineProperties({}, {
    PdfLoaded:      { value: 'pdf-loaded'   },
    PagesLoaded:    { value: 'pages-loaded' },
});