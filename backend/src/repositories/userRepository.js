export class UserRepository {
  constructor(initialUsers = []) {
    this.users = [...initialUsers];
  }

  async findByEmail(email) {
    return this.users.find(user => user.email === email) || null;
  }

  async findById(id) {
    return this.users.find(user => user.id === id) || null;
  }

  async create({ email, passwordHash, role = "USER" }) {
    const newUser = {
      id: this.users.length + 1,
      email,
      passwordHash,
      role,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  async deleteById(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }

  async getAll() {
    return [...this.users];
  }
}
