import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ParamMap, ActivatedRoute } from "@angular/router";
import { AppService } from "../app.service";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: "app-display-blog",
  templateUrl: "./display-blog.component.html",
  styleUrls: ["./display-blog.component.css"]
})
export class DisplayBlogComponent implements OnInit {

  blog;
  comments=[];
  comment;

  blogId;

  superAccess=false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private service: AppService,
    private auth: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!this.service.checkLogin()) {
      this.router.navigate(["/starter-page"]);
    }

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get("id");
      this.blogId=id;
      this.getBlog(id);
    });
  }

  getBlog(id){
    let url="http://localhost:8080/blog/getBlog/"+id;
    let headers=this.auth.addHeader();
    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.blog=res;
      console.log(this.blog);
      this.getComments(id);
      this.checkSuperAccess();
    });
  }

  checkSuperAccess(){
    if(this.blog.user.email == sessionStorage.getItem("email")){
      this.superAccess=true;
    }
    else{
      this.superAccess=false;
    }
  }

  getComments(id){
    let url="http://localhost:8080/comments/displayCommentsOnBlogs/"+id;
    let headers=this.auth.addHeader();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.comments=res;
      console.log(this.comments);
    });
  }

  addAComment(){
    if(this.comment != undefined && this.comment != " "){
      let url="http://localhost:8080/comments/addComment/Blog/"+this.blogId;
    let headers=this.auth.addHeader();

    this.httpClient.post(url,this.comment,{headers}).subscribe((res:any)=>{
      alert("Comment Inserted")
    },error=>{
      alert("Comment Inserted")
    });

    this.getComments(this.blogId);
    location.reload();
    }
    else{
      alert("Comment is empty");
    }
  }

  deleteComment(id){
    let x=confirm("Are you sure you wanna delete this comment?");
    if(x){
      let url="http://localhost:8080/comments/deleteComment/"+id;
      let headers=this.auth.addHeader();

      this.httpClient.get(url,{headers}).subscribe((res:any)=>{
        this.getComments(this.blogId);
      });
    }
    else{
      console.log("confirm rejected");
    }
  }
}
