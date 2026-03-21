import { generateMockUsers } from '../utils/mockingUsers.js';

export const getMockingUsers = async (req, res) => {
  try {
    const usersNumber = req.params.n ?? 50;
    const users = await generateMockUsers(usersNumber);

    return res.status(200).json({
      status: 'success',
      payload: users
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
};

export default {
    getMockingUsers
}
