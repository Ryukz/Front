import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthenticationService } from "../authentication.service";
import { AppService } from "../app.service";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.css"]
})
export class EditProfileComponent implements OnInit {
  firstname;
  lastname;
  bio;
  username;
  email;
  mobile;
  password;

  constructor(
    private httpClient: HttpClient,
    public router: Router,
    private auth: AuthenticationService,
    private service: AppService
  ) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    let url =
      "http://localhost:8080/login/getProfile/" +
      sessionStorage.getItem("userId");
    let headers = this.auth.addHeader();
    this.httpClient.get(url, { headers }).subscribe((res: any) => {
      this.firstname = res.firstName;
      this.lastname = res.lastName;
      this.bio = res.bio;
      this.username = res.userName;
      this.email = res.email;
      this.mobile = res.mobile;
      this.password = res.password;
    });
  }

  updateProfile() {
    if (
      this.firstname != undefined &&
      this.firstname != " " &&
      this.lastname != undefined &&
      this.lastname != " " &&
      this.username != undefined &&
      this.username != " " &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) &&
      this.email != undefined &&
      this.mobile != undefined &&
      this.mobile.match(/^\d{10}$/) &&
      this.password != undefined &&
      this.password.match(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
      )
    ) {
      let url = "http://localhost:8080/login/updateProfile";
      let headers = this.auth.addHeader();

      let data = {
        firstName: this.firstname,
        lastName: this.lastname,
        userName: this.username,
        bio: this.bio,
        email: this.email,
        mobile: this.mobile,
        password: this.password
      };

      this.httpClient.post(url, data, { headers }).subscribe((res: any) => {
        console.log(res);
        alert("Profile Updated relogin to save changes");
        this.logout();
      });
    } else {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        alert("Enter valid email");
      } else if (!this.mobile.match(/^\d{10}$/)) {
        alert("Enter a valid mobile number");
      } else if (
        !this.password.match(
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
        )
      ) {
        alert(
          "Password must contain alphanumeric digist, atleast one special character and should be between greater than 7 digits and less than 15."
        );
      }
    }
  }

  logout() {
    let logoutUrl = "http://localhost:8080/login/logout";

    if (this.service.checkLogin()) {
      this.auth.logoutService();

      this.httpClient.get(logoutUrl).subscribe(res => {
        console.log(JSON.stringify(res));
        location.reload();
      });
    } else {
      console.log("Login first");
    }
  }
}
