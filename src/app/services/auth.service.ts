import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from '../interfaces/auth-data';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/users/'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false
  private token = ''
  private tokenTimer: any
  private userId: string
  private authStatusListener = new Subject<boolean>()
  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token
  }

  getIsAuth() {
    return this.isAuthenticated
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }

  getUserId() {
    return this.userId
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email, password }
    this.http.post(BACKEND_URL + '/signup', authData).subscribe(() => {
      this.router.navigate(['/'])
    }, err => {
      this.authStatusListener.next(false)
    })
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email, password }
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/login', authData).subscribe((res) => {
      const token = res.token
      this.token = token
      if (token) {
        const expiresInDuration = res.expiresIn
        this.setAuthTimer(expiresInDuration)
        this.isAuthenticated = true
        this.userId = res.userId
        this.authStatusListener.next(true)
        const now = new Date()
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
        this.saveAuthData(token, expirationDate, this.userId)
        this.router.navigate(['/'])
      }
    }, err => {
      this.authStatusListener.next(false)
    })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData()
    if (!authInformation) return
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
    if (expiresIn < 0) {
      this.token = authInformation.token
      this.isAuthenticated = true
      this.userId = authInformation.userId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut()
    }, duration * 1000)
  }

  logOut() {
    this.token = null
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    this.userId = null
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
    this.router.navigate(['/'])
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const expirationDate = localStorage.getItem('expiration')
    if (!token || !expirationDate || !userId) return ''
    return {
      token,
      expirationDate: new Date(expirationDate),
      userId
    }
  }
}
