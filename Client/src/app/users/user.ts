export interface User {
  id: string;
  userName: string;
  email: string;
}

export interface ChangeRoleRequest {
  newRole: string;
}
