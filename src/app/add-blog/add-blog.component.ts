import { Component, OnInit } from "@angular/core";
import { AppService } from "../app.service";
import { Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { HttpClient } from "@angular/common/http";
import { empty } from 'rxjs';
import { error } from 'util';

@Component({
  selector: "app-add-blog",
  templateUrl: "./add-blog.component.html",
  styleUrls: ["./add-blog.component.css"]
})
export class AddBlogComponent implements OnInit {
  title;
  category;
  sDes;
  imageUrl;
  actualBlog;
  access=0;

  constructor(
    private service: AppService,
    private router: Router,
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    if (!this.service.checkLogin()) {
      this.router.navigate(["/starter-page"]);
    }
  }

  makePrivate(){
    this.access=1;
  }

  addBlog() {
    let url = "http://localhost:8080/blog/createBlog";
    let headers = this.authService.addHeader();

    this.rightInput("title");
    this.rightInput("category");
    this.rightInput("sDes");
    this.rightInput("actualBlog");

    if (
      this.title != undefined &&
      this.category != undefined &&
      this.sDes != undefined &&
      this.actualBlog != undefined
    ) {
      let blog = {
        title: this.title,
        category: this.category,
        searchDescription: this.sDes,
        imageurl: this.imageUrl,
        access: this.access,
        blog: this.actualBlog
      };

      this.httpClient.post(url, blog, { headers }).subscribe((res: any) => {
        if (res) {
          this.router.navigate(["/home"]);
        } else {
          alert("Error adding blog. Please try again later");
        }
      },error=>{
        alert("Data too long for image")
      });
    }
    else{
      if(!this.title){
        this.wrongInput("title");
      }
      if(!this.category){
        this.wrongInput("category");
      }
      if(!this.sDes){
        this.wrongInput("sDes");
      }
      if(!this.actualBlog){
        document.getElementById("actualBlog").style.border="1px solid red";
      }
    }
  }

  wrongInput(id){
    document.getElementById(id).style.borderBottom="1px solid red";
  }
  rightInput(id){
    document.getElementById(id).style.borderBottom="1px solid black";
  }
}
