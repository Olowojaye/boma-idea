import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const { access, project } = new PrismaClient();

  if (req.method !== 'POST') {
    return res.status(403).send('Request Forbidden 1');
  }
  const { userId, newProject } = req.body;

  if (!userId || !newProject) {
    return res.status(403).send('Request Forbidden 2');
  }

  // Locate user
  const userFound = await access.findMany({
    where: {
      user_id: userId,
    },
  });

  if (userFound.length == 0) {
    return res.status(404).send('No such user exists.');
  }

  const canCreate = userFound.filter((acc) => acc.permit == 'Create');

  if (canCreate.length == 0) {
    return res.status(403).send('User has no permission to create.');
  }

  var { name, state, date } = newProject;
  date = new Date(date);
  const savedProject = await project.create({
    data: { name, state, date },
  });

  if (savedProject.length == 0) {
    return res.status(400).send('Error creating project');
  }
  return res.status(200).json({ savedProject });
}
