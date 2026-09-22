export class UserController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getProfile = (req, res) => {
    return res.status(200).json({
      message: "Protected Route Accessed",
      userId: req.user.sub,
      role: req.user.role
    });
  };

  deleteUser = async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const deleted = await this.userRepository.deleteById(userId);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
