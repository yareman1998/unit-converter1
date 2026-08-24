import { Component } from '@angular/core';
// Import the component from the new folder
import { UnitConverterComponent } from './unit-converter/unit-converter.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // Add it to the imports array
  imports: [UnitConverterComponent], 
  // Using your specific file names
  templateUrl: './app.html', 
  styleUrls: ['./app.css']
})
export class App {
  title = 'unit-converter-app';
}