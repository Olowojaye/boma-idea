import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const { access, project } = new PrismaClient();
  if (req.method !== 'POST') {
    return res.status(403).send('Request Forbidden');
  }
  const { userId } = req.body;
  if (!userId) {
    return res.status(403).send('Request Forbidden');
  }

  // Locate user
  const userFound = await access.findMany({
    select: {
      project: true,
    },
    where: {
      user_id: userId,
    },
  });

  if (userFound.length == 0) {
    return res.status(404).send('Not Found');
  }

  // Filter unique project ids and projects
  const uniqueProjectIds = [];
  const uniqueProjects = [];
  userFound.forEach((acc) => {
    if (!uniqueProjectIds.includes(acc.project.id)) {
      uniqueProjectIds.push(acc.project.id);
      uniqueProjects.push(acc.project);
    }
  });

  return res.status(200).json({ result: uniqueProjects });
}
