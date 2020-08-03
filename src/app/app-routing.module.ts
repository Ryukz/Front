import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { StarterPageComponent } from './starter-page/starter-page.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DisplayBlogComponent } from './display-blog/display-blog.component';
import { FollowerListComponent } from './follower-list/follower-list.component';


const routes: Routes = [{path: 'login', component: LoginComponent},
{path: 'signup', component: SignupComponent},
{path: 'home', component: HomeComponent},
{path: 'home/user-details/:id', component: UserDetailsComponent},
{path: 'starter-page', component: StarterPageComponent},
{path: 'home/addBlog', component: AddBlogComponent},
{path: 'home/user-details/:id/edit', component: EditProfileComponent},
{path: 'home/display-blog/:id', component: DisplayBlogComponent},
{path: 'home/user-details/followList/:id', component: FollowerListComponent},
{path: '', redirectTo: '/home', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
