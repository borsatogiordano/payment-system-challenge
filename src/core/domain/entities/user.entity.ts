import { UserRole } from "../enums/user-role-enum";

export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private _document: string;
  private _phone: string;
  private _role: UserRole;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    document: string;
    phone: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._document = props.document;
    this._phone = props.phone;
    this._role = props.role || UserRole.USER;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id() { return this._id; }
  get name() { return this._name; }
  get email() { return this._email; }
  get password() { return this._password; }
  get document() { return this._document; }
  get phone() { return this._phone; }
  get role() { return this._role; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }

  updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
  }) {
    if (data.name) this._name = data.name;
    if (data.email) this._email = data.email;
    if (data.phone) this._phone = data.phone;
    if (data.document) this._document = data.document;
    this._updatedAt = new Date();
  }

  changePassword(newPassword: string) {
    this._password = newPassword;
    this._updatedAt = new Date();
  }

  promoteToAdmin() {
    this._role = UserRole.ADMIN;
    this._updatedAt = new Date();
  }

  demoteToUser() {
    this._role = UserRole.USER;
    this._updatedAt = new Date();
  }

  toPublic() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      document: this._document,
      phone: this._phone,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  static create(props: {
    name: string;
    email: string;
    password: string;
    document: string;
    phone: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    return {
      name: props.name,
      email: props.email,
      password: props.password,
      document: props.document,
      phone: props.phone,
      role: props.role || UserRole.USER,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }
}