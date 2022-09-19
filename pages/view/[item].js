import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/userContext';

export default function ProjectView() {
  const router = useRouter();
  const [canUpdate, setCanUpdate] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [updateNow, setUpdateNow] = useState(false);
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [date, setDate] = useState(new Date());
  const projectId = router.query.item;
  const { Id, setId, projects, setProjects } = useUser();
  const [proj, setProj] = useState({});

  useEffect(() => {
    const getUserPermissions = async () => {
      try {
        const { data } = await axios.post('/api/read', {
          userId: parseInt(Id),
          projectId: parseInt(projectId),
        });
        if (data.result[0].permissions.includes('Delete')) {
          setCanDelete(true);
        }
        if (data.result[0].permissions.includes('Update')) {
          setCanUpdate(true);
        }
      } catch (err) {
        alert(err.response.data);
      }
    };
    setProj(projects.filter((project) => project.id == projectId)[0]);
    getUserPermissions();
  }, []);

  const updateHandler = async () => {
    if (state !== 'Open' && state !== 'Propose' && state !== 'Closed') {
      alert('Wrong Project State entered!');
      return;
    }

    event.preventDefault();
    try {
      const { data } = await axios.post('/api/update', {
        userId: parseInt(Id),
        project_id: parseInt(projectId),
        updateData: {
          ...(name !== '' && { name }),
          ...(state !== '' && { state }),
          ...(date !== new Date() && { date }),
        },
      });

      // Get updated user projects data
      const response = await axios.post('/api/readall', {
        userId: parseInt(Id),
      });
      setProjects(response.data.result);
      setUpdateNow(false);
      setProj(projects.filter((project) => project.id == projectId)[0]);
    } catch (err) {
      alert(err.response.data);
    }
  };

  // Refresh page details on update
  useEffect(() => {
    if (!!proj.id && projects.filter((project) => project.id == projectId)[0]) {
      setProj(projects.filter((project) => project.id == projectId)[0]);
    }
  }, [projects]);

  const deleteHandler = async () => {
    try {
      const deleteRes = await axios.post('/api/delete', {
        userId: parseInt(Id),
        project_id: parseInt(projectId),
      });
      alert('Project Deleted');
      router.push('/view');
      setProjects(projects.filter((item) => item.id != parseInt(projectId)));
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <div>
      <button className="block">
        <Link href="/view">
          <a>Return to projects list</a>
        </Link>
      </button>
      {!!proj.id && (
        <div>
          <div>User Id: {Id}</div>
          Project ID: {proj.id} <br />
          Project Name: {proj.name} <br />
          Project State: {proj.state} <br />
          Project Date: {proj.date.split('T')[0]} <br />
        </div>
      )}

      {canUpdate && (
        <button className='mr-2' onClick={() => setUpdateNow(true)}>Update project</button>
      )}
      {canDelete && <button onClick={deleteHandler}>Delete</button>}
      {updateNow && (
        <form onSubmit={updateHandler}>
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
  );
}
