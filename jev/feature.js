/* Bounded decisions for this application. */
(function (root, factory) {
  const api = factory(
    root.JevContract || (typeof require === 'function' ? require('./contract.js') : null),
  );
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.JevFeature = api;
})(globalThis, function (C) {
  'use strict';

  const F = {
    id: 'project-finder',
    private: false,
    build(input) {
      const query = C.text(input.query, 'Describe your need', 600),
        items = C.candidates(input.items, 'Projects');
      const questions = {};
      items.forEach(
        (item, i) =>
          (questions['relevance' + i] = C.score(
            'How well does `items[' +
              i +
              ']` address `query`? Judge only the supplied project description; do not invent features or treat BUILDING/maintenance projects as available.',
          )),
      );
      return { state: { query, items }, questions };
    },
    present(input, answers) {
      const items = C.candidates(input.items, 'Projects');
      return C.rank(items, answers)
        .slice(0, 5)
        .map((x) => ({
          title: x.title,
          label: x.answer.confidence >= 0.8 ? 'Suggested match' : 'Possible match · review',
          detail: x.text,
          confidence: x.answer.confidence,
          index: Number(x.id.replace('item', '')),
        }));
    },
  };

  return Object.freeze(F);
});
