import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '../../context/userContext';

export default function View() {
  const { Id, setId, projects, setProjects, canCreate, setCanCreate } =
    useUser();
  const [createNow, setCreateNow] = useState(false);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [date, setDate] = useState(new Date());

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
    } catch (err) {
      alert(err.response.data);
    }
  };

  const createHandler = async () => {
    if (state !== 'Open' && state !== 'Propose' && state !== 'Closed') {
      alert('Wrong Project State entered!');
      return;
    }

    event.preventDefault();
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
  return (
    <div>
      <h1 className="text-center text-3xl text-bold">View Page</h1>
      <form onSubmit={getUser}>
        <label>
          Enter User ID:{' '}
          <input
            type="number"
            onChange={(event) => setId(event.target.value)}
          />
        </label>
        <button className='ml-2' disabled={Id == 0} type="Submit">
          Submit
        </button>
      </form>
      <div>
        {projects.length !== 0 && (
          <ul>
            {projects.map((proj, index) => {
              return (
                <li key={index.toString()}>
                  Project ID: {proj.id} <br />
                  Project Name: {proj.name} <br />
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
