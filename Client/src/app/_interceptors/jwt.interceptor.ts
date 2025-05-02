import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { API } from '../_environments/api';
import { AuthenticationService } from '../authentication/authentication.service';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthenticationService);

  const isLoggedIn = authService.isLoggedIn;
  const isSentToServer = request.url.startsWith(API.server);

  let authRequest: HttpRequest<unknown> = request.clone();

  if (isLoggedIn && isSentToServer) {
    authRequest = request.clone({
      headers: request.headers.set(
        'Authorization',
        `Bearer ${authService.jwt}`
      ),
    });
  }
  // test

  return next(authRequest);
};
