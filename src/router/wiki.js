export default [
  {
    meta: {
      date: 'December 13, 2020',
      author: 'Indrek',
      intro:
        'Classic character differences from Lord of Destruction characters explained.',
      tags: ['Classic', 'Speedruns'],
      title: 'Classic'
    },
    path: '/wiki/classic',
    component: () =>
      import(/* webpackChunkName: "wiki" */ '../wiki/classic.vue')
  },
  {
    meta: {
      date: 'December 13, 2020',
      author: 'Indrek',
      intro:
        "Current world record is 52:52 by Indrek. It was ran on November 21, 2020. Here's the history of how we got there.",
      tags: ['History', 'Speedruns', 'Players X'],
      title: 'Any% Softcore Sorceress Players X History'
    },
    path: '/wiki/sc-sor-px',
    component: () =>
      import(/* webpackChunkName: "wiki" */ '../wiki/sc-sor-px.vue')
  },
  {
    meta: {
      date: 'December 13, 2020',
      author: 'Indrek',
      intro:
        "Earliest any% players 1 sorc runs were done around 2012 and the category has seen many changes throughout the years. Current world record is 57:45 by 327. It was ran on November 19, 2020. Here's the history of how we got there.",
      tags: ['History', 'Speedruns', 'Players 1'],
      title: 'Any% Softcore Sorceress Players 1 History'
    },
    path: '/wiki/sc-sor-p1',
    component: () =>
      import(/* webpackChunkName: "wiki" */ '../wiki/sc-sor-p1.vue')
  }
];
