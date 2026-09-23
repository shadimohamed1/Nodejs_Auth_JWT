export class RefreshTokenRepository {
  constructor(initialTokens = []) {
    this.refreshTokens = new Set(initialTokens);
  }

  async save(token) {
    this.refreshTokens.add(token);
    return token;
  }

  async exists(token) {
    return this.refreshTokens.has(token);
  }

  async delete(token) {
    return this.refreshTokens.delete(token);
  }

  async clear() {
    this.refreshTokens.clear();
  }
}
