import { Component, inject } from '@angular/core';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeRoleRequest, User } from '../user';
import { MaterialModule } from '../../_modules/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
  selector: 'app-user-admin-page',
  imports: [MaterialModule, CommonModule, FormsModule],
  templateUrl: './user-admin-page.component.html',
})
export class UserAdminPageComponent {
  users: User[] = [];
  userService = inject(UserService);
  authService = inject(AuthenticationService);
  availableRoles: string[] = ['User', 'Moderator', 'Admin'];

  tableColumns: string[] = ['username', 'email', 'role'];
  snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (r) => (this.users = r),
      error: (error) => this.snackBar.open(error, 'close'),
    });
  }

  updateRole(userId: string, role: string) {
    const roleRequest: ChangeRoleRequest = { newRole: role };
    this.authService.changeRole(userId, roleRequest).subscribe({
      next: () => this.loadUsers(),
      error: (error) => this.snackBar.open(error, 'close'),
    });
  }
}
