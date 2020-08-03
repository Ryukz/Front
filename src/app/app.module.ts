import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { from } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { StarterPageComponent } from './starter-page/starter-page.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DisplayBlogComponent } from './display-blog/display-blog.component';
import { FollowerListComponent } from './follower-list/follower-list.component';
import { StartPageComponent } from './start-page/start-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    UserDetailsComponent,
    NavbarComponent,
    HomeComponent,
    StarterPageComponent,
    AddBlogComponent,
    EditProfileComponent,
    DisplayBlogComponent,
    FollowerListComponent,
    StartPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
