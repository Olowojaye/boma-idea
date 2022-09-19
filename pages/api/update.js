import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const { access, project } = new PrismaClient();

  if (req.method !== 'POST') {
    return res.status(403).send('Request Forbidden 1');
  }
  var { userId, project_id, updateData } = req.body;

  if (!userId || !project_id || !updateData) {
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

  const canUpdate = userFound.filter((acc) => acc.permit == 'Update');

  if (canUpdate.length == 0) {
    return res.status(403).send('User has no permission to update project.');
  }

  // check if date is part of the update
  if (!!updateData.date) {
    updateData.date = new Date(updateData.date);
  }

  const updatedProject = await project.update({
    where: {
      id: project_id,
    },
    data: updateData,
  });

  if (updatedProject.length == 0) {
    return res.status(400).send('Error updating project');
  }
  return res.status(200).json({ updatedProject });
}
