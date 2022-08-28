import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { AddMaterialComponent } from './add-material/add-material.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { LoginComponent } from './login/login.component';
import { HttpService } from '../services/http-service.service';
import { SignupComponent } from './signup/signup.component';
import { MyKitchenComponent } from './my-kitchen/my-kitchen.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import { MyFavoritesComponent } from './my-favorites/my-favorites.component';

@NgModule({
  declarations: [
    HomeComponent,
    AddMaterialComponent,
    AddRecipeComponent,
    AddCategoryComponent,
    LoginComponent,
    SignupComponent,
    MyKitchenComponent,
    MyFavoritesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatGridListModule,
    MatDividerModule,
    MatListModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    HttpClientModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatCardModule,
    NgSelectModule,
    AngularEditorModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatRadioModule
  ],
  providers:[HttpService]
})
export class PagesModule { }
