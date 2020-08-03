import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppService } from "../app.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"]
})
export class UserDetailsComponent implements OnInit {
  userId;
  firstName;
  lastName;
  userName;
  email;
  mobile;
  password;
  bio;

  blogs = [];

  id;
  blogId;
  likes;
  title;
  category;
  sDes;
  imageUrl;
  actualBlog;
  access;
  boolPrivate;

  superAccess = false;
  masterUserId;

  likedBlogs = [];

  disliked = "https://image.flaticon.com/icons/svg/149/149217.svg";
  liked = "https://image.flaticon.com/icons/svg/148/148836.svg";

  followersLength = 0;
  followingLength = 0;

  requests=[];

  constructor(
    private httpClient: HttpClient,
    private service: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    if (!this.service.checkLogin()) {
      this.router.navigate(["/starter-page"]);
    }

    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get("id");
      this.userId = id;
    });

    this.getUserInfo(this.userId);
    this.getUserBlogs(this.userId);
    this.getFollowers();
    this.getRequest();
    this.getFollowing();

    //giver super acess
    if (sessionStorage.getItem("userId") == this.userId) {
      this.superAccess = true;
    }
  }

  getUserBlogs(id) {
    let url = "http://localhost:8080/blog/getMyBlogs/" + this.userId;
    let headers = this.auth.addHeader();

    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      this.blogs = res;
      this.getLikedBlogs();
      console.log(res);
    });
  }

  getUserInfo(id) {
    this.userId = id;
    console.log("getting user info..");
    let url = "http://localhost:8080/login/getProfile/" + id;
    this.httpClient.get(url).subscribe((res: any) => {
      this.firstName = res.firstName;
      this.lastName = res.lastName;
      this.userName = res.userName;
      this.email = res.email;
      this.mobile = res.mobile;
      this.password = res.password;
      this.bio = res.bio;
    });
  }

  deleteBlog(id) {
    var x=confirm("Do you really want to delete the blog ?");
    if(x){
      let headers = this.auth.addHeader();
    id = parseInt(id);
    console.log("Blog id : " + id);
    let url = "http://localhost:8080/blog/deleteBlog/" + id;
    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      alert("Deletion Succesfull");

      this.getUserBlogs(id);
    });
    }
  }

  editBlog(id) {
    let url = "http://localhost:8080/blog/getBlog/" + id;
    let headers = this.auth.addHeader();

    //getting selected blog
    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      this.title = res.title;
      this.category = res.category;
      this.sDes = res.searchDescription;
      this.imageUrl = res.imageurl;
      this.actualBlog = res.blog;
      this.likes = res.likes;
      this.id = id;

      if (res.access) {
        this.access = 1;
        this.boolPrivate = true;
      } else {
        this.access = 0;
        this.boolPrivate = false;
      }
    });
  }

  makePrivate() {
    if (this.access == 0) {
      this.access = 1;
      this.boolPrivate = true;
    } else {
      this.access = 0;
      this.boolPrivate = false;
    }
  }

  updateBlog() {
    this.title.trim();
    this.sDes.trim();
    this.category.trim();
    this.actualBlog.trim();

    if((this.title != "" && this.title != undefined) && (this.sDes != "" && this.sDes != undefined) &&
    (this.category != "" && this.category != undefined) && (this.access != undefined) && (this.actualBlog != "" && 
    this.actualBlog != undefined)){
      //sending data as blog
    let headers = this.auth.addHeader();
    let blog = {
      blogId: this.id,
      likes: this.likes,
      title: this.title,
      searchDescription: this.sDes,
      category: this.category,
      imageurl: this.imageUrl,
      access: this.access,
      blog: this.actualBlog
    };

    let url = "http://localhost:8080/blog/updateBlog";
    this.httpClient.post(url, blog, { headers }).subscribe((res: any) => {
      alert(res);
    });

    this.getUserBlogs(this.id);
    }
    else{
      alert("Invalid input");
    }
  }

  editProfile() {
    this.router.navigate(["home/user-details/" + this.userId + "/edit"]);
  }

  getLikedBlogs() {
    let url = "http://localhost:8080/blog/getLikedBlogs";
    let headers = this.auth.addHeader();
    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      this.likedBlogs = res;
      this.setLikesAndDislikes();
      console.log(res);
    });
  }

  setLikesAndDislikes() {
    for (let i = 0; i < this.likedBlogs.length; i++) {
      // document.getElementById(this.likedBlogs[i].blog.blogId).setAttribute("src",this.liked);
      var element = document.getElementById(this.likedBlogs[i].blog.blogId);
      if (element != null) {
        element.setAttribute("src", this.liked);
      }
    }
  }

  likeBlog(id) {
    var element = document.getElementById(id);

    let url = "http://localhost:8080/blog/like/" + id;
    let headers = this.auth.addHeader();

    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      console.log(res);

      if (res) {
        element.setAttribute("src", this.liked);
      } else {
        element.setAttribute("src", this.disliked);
      }

      this.getUserBlogs(this.userId);
    });
  }

  getFollowers() {
    let url = "http://localhost:8080/follow/getFollowers/"+this.userId;
    let headers = this.auth.addHeader();

    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      let arr = [];
      arr = res;
      this.followersLength = arr.length;
    });

    if(this.superAccess){
      //navigate to see list
      this.router.navigate(["/home/user-details/followList/"+this.userId]);
    }
  }

  follow(){
    let url="http://localhost:8080/follow/sendRequest/"+this.userId;
    let headers=this.auth.addHeader();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      if(res){
        document.getElementById("followButton").innerHTML="Request Sent";
      }
      else{
        alert("Request already Sent");
      }
    });
  }

  getRequest(){
    let url="http://localhost:8080/follow/getAllRequest";
    let headers=this.auth.addHeader();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.requests=res;
    });
  }

  acceptRequest(id){
    let url="http://localhost:8080/follow/acceptRequest/"+id;
    let headers=this.auth.addHeader();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.getRequest();
      this.getFollowers();
    });

  }

  rejectRequest(id){
    let url="http://localhost:8080/follow/declineRequest/"+id;
    let headers=this.auth.addHeader();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.getRequest();
    });
  }

  getFollowing(){
    let url="http://localhost:8080/follow/getFollowing/"+this.userId;
    let headers=this.auth.addHeader();

    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      let arr=[];
      arr=res;
      this.followingLength=arr.length;
    });

    if(this.superAccess){
      //navigate to see list
      this.router.navigate(["/home/user-details/followList/"+this.userId]);
    }
  }
}
