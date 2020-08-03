import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AppService } from "../app.service";
import { error } from 'util';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  firstName;
  lastName;
  userName;
  email;
  mobile;
  password;
  bio;

  loading = false;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private service: AppService
  ) {}

  ngOnInit() {
    if (this.service.checkLogin()) {
      this.router.navigate(["home"]);
    }
  }

  signIn() {
    if (
      this.firstName != undefined &&
      this.firstName != " " &&
      this.lastName != undefined &&
      this.lastName != " " &&
      this.userName != undefined &&
      this.userName != " " &&
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email) &&
      this.email != undefined &&
      this.mobile != undefined &&
      this.mobile.match(/^\d{10}$/) &&
      this.password != undefined &&
      this.password.match(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
      )
    ) {
      let url = "http://localhost:8080/signup/sendingData";
      let user = {
        firstName: this.firstName,
        lastName: this.lastName,
        userName: this.userName,
        email: this.email,
        mobile: this.mobile,
        password: this.password,
        bio: this.bio
      };

      this.loading = true;

      let getOTP = "http://localhost:8080/signup/sendOTP";
      this.httpClient.post(getOTP, user).subscribe((res: any) => {
        var otp = prompt("Enter OTP ( Sent on given mail ) : ");

        if (parseInt(otp) === parseInt(res)) {

          this.httpClient.post(url, user).subscribe((res: any) => {
            if (res) {
              this.loading = false;
              this.router.navigate(["/login"]);
            } else {
              alert("User already exist.");
              this.loading=false;
            }
          });
        }
        else{
          alert("OTP is wrong");
          this.loading=false;
        }
      },error=>{
        alert("Email not verified");
        this.loading=false;
      });
    } else {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        alert("Enter valid email");
        this.loading=false;
      } else if (!this.mobile.match(/^\d{10}$/)) {
        this.loading=false;
        alert("Enter a valid mobile number");
      } else if (
        !this.password.match(
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/
        )
      ) {
        this.loading = false;
        alert(
          "Password must contain alphanumeric digist, atleast one special character and should be between greater than 7 digits and less than 15."
        );
      }
    }
  }

  moveToHome() {
    this.router.navigate(["/home"]);
  }
}
