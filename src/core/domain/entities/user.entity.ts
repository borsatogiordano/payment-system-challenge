export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public password: string,
    public document: string,
    public phone: string,
    public role: UserRole,
    public createdAt: Date,
    public updatedAt: Date,
  ) { }

  static create(
    name: string,
    email: string,
    password: string,
    document: string,
    phone: string,
    role: UserRole = UserRole.USER
  ) {
    return {
      name,
      email,
      password,
      document,
      phone,
      role,
    };
  }

  toPublic() {
    const { password, ...publicData } = this;
    return publicData;
  }
}