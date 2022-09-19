var filteredProjects = [
  {
    id: 1,
    name: 'New Project',
    state: 'Closed',
    date: '2022-09-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'New Name',
    state: 'Open',
    date: '2022-09-19T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Project C',
    state: 'Open',
    date: '2022-04-13T00:00:00.000Z',
  },
];

const newOrder = filteredProjects.sort((a, b) => {
    let fa = a.date,
        fb = b.date;

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
});

console.log(newOrder);
