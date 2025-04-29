import { Routes } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';
import { AdminGuard } from './_guards/admin.guard';
import { ModeratorGuard } from './_guards/moderator.guard';

export const routes: Routes = [
  /** Home */
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./shared/pages/home/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  /** Authentication and user management */
  {
    path: 'authentication',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./authentication/pages/authentication-page.component').then(
            (m) => m.AuthenticationPageComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./authentication/pages/register-page.component').then(
            (m) => m.RegisterPageComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./authentication/pages/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
      },
    ],
  },
  /** App logic*/
  {
    path: 'clubs',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./clubs/pages/clubs.component').then((m) => m.ClubsComponent),
        canActivate: [ModeratorGuard],
      },
      {
        path: 'add/:id',
        pathMatch: 'full',
        loadComponent: () =>
          import('./clubs/pages/club-add.component').then(
            (m) => m.ClubAddComponent
          ),
        canActivate: [ModeratorGuard],
      },
      {
        path: 'edit/:id',
        pathMatch: 'full',
        loadComponent: () =>
          import('./clubs/pages/club-edit.component').then(
            (m) => m.ClubEditComponent
          ),
        canActivate: [ModeratorGuard],
      },
    ],
  },
  {
    path: 'fighters',
    children: [
      {
        path: 'getAll',
        pathMatch: 'full',
        loadComponent: () =>
          import('./fighters/pages/fighter-page.component').then(
            (m) => m.FighterPageComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'add/:id',
        pathMatch: 'full',
        loadComponent: () =>
          import('./fighters/pages/add-fighter-page.component').then(
            (m) => m.AddFighterPageComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        pathMatch: 'full',
        loadComponent: () =>
          import('./fighters/pages/edit-fighter-page.component').then(
            (m) => m.EditFighterPageComponent
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'competitions',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./competitions/pages/competitions-page.component').then(
            (m) => m.CompetitionsPageComponent
          ),
        canActivate: [],
      },
      {
        path: 'add',
        pathMatch: 'full',
        loadComponent: () =>
          import('./competitions/pages/add-competition-page.component').then(
            (m) => m.AddCompetitionPageComponent
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'edit/:id',
        pathMatch: 'full',
        loadComponent: () =>
          import('./competitions/pages/edit-competition-page.component').then(
            (m) => m.EditCompetitionPageComponent
          ),
        canActivate: [AdminGuard],
      },
      {
        path: 'club-page/:id',
        pathMatch: 'full',
        loadComponent: () =>
          import('./competitions/pages/competition-club-page.component').then(
            (m) => m.CompetitionClubPageComponent
          ),
        canActivate: [AdminGuard],
      },
    ],
  },
  {
    path: '401',
    loadComponent: () =>
      import('./_errors/unauthorized-access.component').then(
        (m) => m.UnauthorizedAccessComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./_errors/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
