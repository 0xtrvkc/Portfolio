/* Application adapter; all writes require an explicit action button. */
(function () {
  'use strict';
  function init() {
    JevUI.mount({
      title: 'Find a project for your problem',
      description:
        'Describe what you want to explore. Jev compares it with the current published project descriptions.',
      fields: [
        {
          key: 'query',
          label: 'What do you want to do?',
          max: 600,
          placeholder: 'Examine trading consistency and drawdown',
        },
      ],
      runLabel: 'Find projects',
      input(v) {
        const items = window.TRVKCPortfolio.get()
          .tools.filter((x) => x.status === 'LIVE')
          .map((x) => ({
            id: x.id,
            title: x.title,
            text: x.description + ' | ' + x.tags.join(', '),
            url: x.url,
          }));
        return { query: v.query, items };
      },
      actionLabel: 'Open project',
      action(row, input) {
        const raw = input.items[row.index]?.url;
        const url = new URL(raw);
        if (!['https:', 'http:'].includes(url.protocol))
          throw new Error('Project link is unavailable.');
        window.open(url.href, '_blank', 'noopener,noreferrer');
      },
    });
    window.addEventListener('trvkc:cloud-data', () =>
      window.dispatchEvent(new Event('jev:context')),
    );
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
