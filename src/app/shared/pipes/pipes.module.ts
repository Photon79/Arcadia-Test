import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { SearchPipe } from './search.pipe';
import { StatusPipe } from './status.pipe';

@NgModule({
  declarations: [ SearchPipe, StatusPipe ],
  imports: [ CommonModule ],
  exports: [ SearchPipe, StatusPipe ]
})
export class PipesModule {}
