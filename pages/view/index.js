import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/userContext';

export default function View() {
  const { Id, setId, projects, setProjects, canCreate, setCanCreate } =
    useUser();
  const [createNow, setCreateNow] = useState(false);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [date, setDate] = useState(new Date());
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [sortOrder, setSortOrder] = useState('');

  const getUser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/permission', {
        userId: parseInt(Id),
      });
      setCanCreate(true);

      const { data } = await axios.post('/api/readall', {
        userId: parseInt(Id),
      });
      setProjects(data.result);
      setFilteredProjects(data.result);
    } catch (err) {
      alert(err.response.data);
    }
  };

  const createHandler = async (event) => {
    event.preventDefault();
    if (state !== 'Open' && state !== 'Propose' && state !== 'Closed') {
      alert('Wrong Project State entered!');
      return;
    }

    try {
      const { data } = await axios.post('/api/create', {
        userId: parseInt(Id),
        newProject: {
          name,
          state,
          date,
        },
      });
      projects.push(data.savedProject);
      setCreateNow(false);
    } catch (err) {
      alert(err.response.data);
    }
  };

  const handleFilter = (event) => {
    const concern = event.target.value;
    if (concern == 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter((item) => item.state == concern));
    }
  };

  const handleSort = (a, b) => {
    if (sortOrder == 'name') {
      let fa = a.name.toLowerCase(),
        fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    } else if (sortOrder == 'date') {
      let fa = a.date,
        fb = b.date;

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    }
  };

  return (
    <div className='grid place-items-center'>
      <h1 className="text-center text-3xl text-bold">View Page</h1>
      <form onSubmit={getUser}>
        <label>
          Enter User ID:{' '}
          <input
            type="number"
            onChange={(event) => setId(event.target.value)}
          />
        </label>
        <button className="ml-2" disabled={Id == 0} type="Submit">
          Submit
        </button>
      </form>
      <div>
        <div className=" mt-2">
          <select
            className="select w-xs mb-2 shadow-sm bg-gray-50 text-blue-800 mr-2"
            onChange={handleFilter}
            defaultValue="default"
          >
            <option value="default" disabled>
              Filter by state
            </option>
            <option value="Open">Open</option>
            <option value="Propose">Propose</option>
            <option value="Closed">Closed</option>
            <option value="all">All categories</option>
          </select>
          <select
            className="select w-xs mb-2 shadow-sm bg-gray-50 text-blue-800"
            onChange={(event) => setSortOrder(event.target.value)}
            defaultValue="default"
          >
            <option value="default" disabled>
              Order by
            </option>
            <option value="name">Name</option>
            <option value="date">Date</option>
          </select>
        </div>
        {filteredProjects.length !== 0 && (
          <ul>
            {filteredProjects.sort(handleSort).map((proj, index) => {
              return (
                <li key={index.toString()} className="mb-2">
                  Project ID: {proj.id} <br />
                  Project Name: {proj.name} <br />
                  Project State: {proj.state} <br />
                  Project Date: {proj.date.split('T')[0]} <br />
                  <button>
                    <Link href={`/view/${proj.id}`}>
                      <a>Edit project</a>
                    </Link>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {canCreate && (
          <button
            onClick={() => setCreateNow(true)}
            className="text-5xl font-bold"
          >
            +
          </button>
        )}
        {createNow && (
          <form onSubmit={createHandler}>
            <label className="block mt-2">
              Project Name:{' '}
              <input
                type="text"
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </label>
            <label className="block mt-2">
              Project State:{' '}
              <input
                type="text"
                onChange={(event) => {
                  setState(event.target.value);
                }}
              />
              <br />
              (Hint: Must be 'Propose', 'Open' or 'Closed')
            </label>
            <label className="block mt-2">
              Project Date:{' '}
              <input
                type="date"
                onChange={(event) => {
                  setDate(event.target.value);
                }}
              />
            </label>
            <button className="block mt-2" disabled={Id == 0} type="Submit">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
