import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  //checks whether its homepage or not
  @Input() homepageActive;
  //gives output of search to homepage
  @Output() searchOutputEvent=new EventEmitter<any>();

  id;

  search;
  
  constructor(private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private service: AppService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    if(!this.service.checkLogin()){
      this.router.navigate(["/starter-page"]);
    }
    this.getUserInfo();
  }

  logout() {
    let logoutUrl="http://localhost:8080/login/logout";

    if (this.service.checkLogin()) {
      this.authService.logoutService();

      this.httpClient.get(logoutUrl).subscribe(res => {
        console.log(JSON.stringify(res));
        location.reload();
      });
    }
    else{
      console.log("Login first");
    }
  }

  checkLogin() {
    return this.service.checkLogin();
  }

  getUserInfo(){
    console.log("getting user info..");
    let headers=this.authService.addHeader();
    let url="http://localhost:8080/login/getProfile";
    this.httpClient.get(url,{headers}).subscribe((res:any)=>{
      this.id=res.id;
      sessionStorage.setItem("userId",this.id);
    });
  }

  searchBlog(){
    let url="http://localhost:8080/blog/search/"+this.search;
    let headers=this.authService.addHeader();
    
    if(this.search != undefined && this.search != " "){
      this.httpClient.get(url,{headers}).subscribe((res:any)=>{
        console.log(res);
        //setting results in eventemitter
        this.searchOutputEvent.emit(res);
      });
    }
  }

}
