import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  blogs = [];
  searchResults = [];
  likedBlogs = [];
  friendBlog = [];

  disliked = 'https://image.flaticon.com/icons/svg/149/149217.svg';
  liked = 'https://image.flaticon.com/icons/svg/148/148836.svg';
  searchElement = false;
  selectCategory = false;

  category = [];

  recentBlog;

  users = [];

  constructor(
    private service: AppService,
    private router: Router,
    private httpClient: HttpClient,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    if (!this.service.checkLogin()) {
      this.router.navigate(['/starter-page']);
    }
    this.getBlogs();
    this.getCategory();
    this.getFriendBlog();
    this.getUsers();
  }

  getUsers() {
    const url = 'http://localhost:8080/signup/getUsers';
    const headers = this.authService.addHeader();

    this.httpClient.get(url, {headers}).subscribe((res: any) => {
      this.users = res;
    });
  }

  getCategory() {
    const url = 'http://localhost:8080/blog/getCategory';
    const headers = this.authService.addHeader();

    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      this.category = res;
    });
  }

  getFriendBlog() {
    const url = 'http://localhost:8080/blog/getBlogFromFollowing';
    const headers = this.authService.addHeader();

    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      this.friendBlog = res;
      console.log('Friends Blog : ' + this.friendBlog);
    });
  }

  getBlogs() {
    const url = 'http://localhost:8080/blog/recent';
    const headers = this.authService.addHeader();

    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      this.blogs = res;

      console.log(this.category);
      this.getLikedBlogs();
    });
  }

  getSearchData($event) {
    this.blogs = $event;
    this.searchElement = true;
  }

  setLikesAndDislikes() {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.likedBlogs.length; i++) {
      if (this.likedBlogs[i].blog.blogId != null) {
        const element = document.getElementById(this.likedBlogs[i].blog.blogId);
        if (element != null) {
            element.setAttribute('src', this.liked);
          }
      }
    }
  }

  getLikedBlogs() {
    const url = 'http://localhost:8080/blog/getLikedBlogs';
    const headers = this.authService.addHeader();
    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      this.likedBlogs = res;
      console.log(this.likedBlogs);
      this.setLikesAndDislikes();
      console.log(res);
    });
  }

  likeBlog(id) {
    const element = document.getElementById(id);

    const url = 'http://localhost:8080/blog/like/' + id;
    const headers = this.authService.addHeader();

    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      console.log(res);

      if (res) {
        element.setAttribute('src', this.liked);
      } else {
        element.setAttribute('src', this.disliked);
      }
      this.getBlogs();
    });
  }

  remove(id) {
    document.getElementById(id).style.display = 'none';
  }

  searchByCategory(i) {
    const url = 'http://localhost:8080/blog/search/' + i;
    const headers = this.authService.addHeader();

    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      console.log(res);
      this.blogs = res;
      this.selectCategory = true;
    });
  }
}
