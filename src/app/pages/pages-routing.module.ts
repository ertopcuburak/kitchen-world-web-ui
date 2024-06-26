import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddMaterialComponent } from './add-material/add-material.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyFavoritesComponent } from './my-favorites/my-favorites.component';
import { MyKitchenComponent } from './my-kitchen/my-kitchen.component';
import { SignupComponent } from './signup/signup.component';
import { AppComponent } from '../app.component';
import { MyNotifsComponent } from './my-notifs/my-notifs.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-material', component: AddMaterialComponent },
  { path: 'add-recipe', component: AddRecipeComponent },
  { path: 'add-category', component: AddCategoryComponent },
  { path: 'my-kitchen', component: MyKitchenComponent },
  { path: 'my-favorites', component: MyFavoritesComponent },
  { path: 'my-notifs', component: MyNotifsComponent },
  { path: 'auth-check', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
