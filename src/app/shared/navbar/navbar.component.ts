import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isBrowser: boolean = false;
  username: string | null = null;
  userRole: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authService: AuthService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.username = this.authService.getUsername();
      this.userRole = this.authService.getRole();
    }
  }

  isLoggedIn(): boolean {
    if (this.isBrowser) {
      return this.authService.isAuthenticated();
    }
    return false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

