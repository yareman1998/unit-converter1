import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitConverterPipe } from './unit-converter.pipe';
import { HistoryService, ConversionLog } from '../services/history'; 

@Component({
  selector: 'app-unit-converter',
  standalone: true,
  imports: [CommonModule, FormsModule, UnitConverterPipe],
  //Add the pipe to providers so we can inject it into the constructor
  providers: [UnitConverterPipe], 
  templateUrl: './unit-converter.component.html',
  styleUrls: ['./unit-converter.component.css']
})
export class UnitConverterComponent {
  inputValue: number | null = null;
  selectedCategory: string = 'length';
  
  unitOptions: { [key: string]: string[] } = {
    length: ['meters', 'feet', 'inches', 'centimeters'],
    weight: ['kilograms', 'grams', 'pounds', 'ounces'],
    temperature: ['Celsius', 'Fahrenheit', 'Kelvin']
  };

  availableUnits: string[] = this.unitOptions[this.selectedCategory]; 
  fromUnit: string = this.availableUnits[0];
  toUnit: string = this.availableUnits[1];
  isDarkMode: boolean = false;

  //Inject both the service and the pipe
  constructor(
    private historyService: HistoryService,
    private converterPipe: UnitConverterPipe
  ) {}

  onCategoryChange() {
    this.availableUnits = this.unitOptions[this.selectedCategory];
    this.fromUnit = this.availableUnits[0];
    this.toUnit = this.availableUnits[1] ? this.availableUnits[1] : this.availableUnits[0];
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  // 4. The function to package and save the data
  saveToDatabase() {
    if (this.inputValue === null) return;

    // Calculate the result using the pipe logic
    const result = this.converterPipe.transform(
      this.inputValue, 
      this.selectedCategory, 
      this.fromUnit, 
      this.toUnit
    );

    if (result === null) return;

    // Package the data exactly how Pydantic expects it
    const log: ConversionLog = {
      category: this.selectedCategory,
      input_value: this.inputValue,
      from_unit: this.fromUnit,
      to_unit: this.toUnit,
      result_value: result
    };

    // Send it to the FastAPI backend
    this.historyService.saveConversion(log).subscribe({
      next: (response) => {
        console.log('Success:', response);
        alert('Saved to MongoDB Atlas!');
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Failed to save to database.');
      }
    });
  }
}