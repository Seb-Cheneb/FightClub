import { Component, inject } from '@angular/core';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeRoleRequest, User } from '../user';
import { MaterialModule } from '../../_modules/material.module';

@Component({
  selector: 'app-user-admin-page',
  imports: [MaterialModule],
  templateUrl: './user-admin-page.component.html',
})
export class UserAdminPageComponent {
  users: User[] = [];
  userService = inject(UserService);

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
    this.userService.changeRole(userId, roleRequest).subscribe({
      next: () => this.loadUsers(),
      error: (error) => this.snackBar.open(error, 'close'),
    });
  }
}
