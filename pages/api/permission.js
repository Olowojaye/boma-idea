import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const { access } = new PrismaClient();
  if (req.method !== 'POST') {
    return res.status(403).send('Request Forbidden');
  }
  const { userId } = req.body;
  if (!userId) {
    return res.status(403).send('Request Forbidden');
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
    return res.status(403).send('User has no permission to create.')
  }
  return res.status(200).json({ result: canCreate });
}
