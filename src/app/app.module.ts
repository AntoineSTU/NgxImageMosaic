import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxImageMosaicModule } from 'ngx-image-mosaic';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, NgxImageMosaicModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
