import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const { access, project } = new PrismaClient();

  if (req.method !== 'POST') {
    return res.status(403).send('Request Forbidden 1');
  }
  var { userId, project_id } = req.body;

  if (!userId || !project_id) {
    return res.status(403).send('Request Forbidden 2');
  }

  // Locate user
  const userFound = await access.findMany({
    where: {
      user_id: userId,
      project_id,
    },
  });

  if (userFound.length == 0) {
    return res.status(404).send('No such user and project combination exists.');
  }

  const canDelete = userFound.filter((acc) => acc.permit == 'Delete');

  if (canDelete.length == 0) {
    return res.status(403).send('User has no permission to delete project.');
  }

  // Firstly, delete all access data associated with project
  const accessDelete = await access.deleteMany({
    where: {
      project_id,
    },
  });

  // Then delete project
  const deletedProject = await project.delete({
    where: {
      id: project_id,
    },
  });

  if (deletedProject.length == 0) {
    return res.status(400).send('Error updating project');
  }
  return res.status(200).json({ deletedProject });
}
