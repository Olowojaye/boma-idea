import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const { access, project } = new PrismaClient();
  const { userId, projectId } = req.body;
  if (!userId || !projectId) {
    return res.status(403).send('Request Forbidden');
  }

  const userProjects = await access.findMany({
    select: {
      permit: true,
      project: true,
    },
    where: {
      user_id: userId,
      project_id: projectId,
    },
  });
  if (userProjects.length == 0) {
    return res.status(404).send('Not Found.');
  }

  let filteredProjects = [];
  let uniqueProjectIds = [];
  userProjects.forEach((proj) => {
    if (!uniqueProjectIds.includes(proj.project.id)) {
      uniqueProjectIds.push(proj.project.id);
      filteredProjects.push({
        project: proj.project,
        permissions: [proj.permit],
      });
    } else {
      filteredProjects[
        uniqueProjectIds.indexOf(proj.project.id)
      ].permissions.push(proj.permit);
    }
  });
  return res.status(200).json({ result: filteredProjects });
}
