import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitConverter',
  standalone: true
})
export class UnitConverterPipe implements PipeTransform {

  transform(value: number | null, category: string, fromUnit: string, toUnit: string): number | null {
    if (value === null || isNaN(value) || !category || !fromUnit || !toUnit) {
      return null;
    }

    if (fromUnit === toUnit) {
      return value;
    }

    switch (category) {
      case 'length':
        return this.convertLength(value, fromUnit, toUnit);
      case 'weight':
        return this.convertWeight(value, fromUnit, toUnit);
      case 'temperature':
        return this.convertTemperature(value, fromUnit, toUnit);
      default:
        return null;
    }
  }

  private convertLength(value: number, from: string, to: string): number {
    
    const toMeters: { [key: string]: number } = {
      'meters': 1,
      'feet': 0.3048,
      'inches': 0.0254,
      'centimeters': 0.01
    };

    
    const valueInMeters = value * toMeters[from];
    return valueInMeters / toMeters[to];
  }

  private convertWeight(value: number, from: string, to: string): number {
    
    const toGrams: { [key: string]: number } = {
      'kilograms': 1000,
      'grams': 1,
      'pounds': 453.59237,
      'ounces': 28.34952
    };

    
    const valueInGrams = value * toGrams[from];
    return valueInGrams / toGrams[to];
  }

  private convertTemperature(value: number, from: string, to: string): number {
    let celsius = value;

    
    if (from === 'Fahrenheit') {
      celsius = (value - 32) * 5 / 9;
    } else if (from === 'Kelvin') {
      celsius = value - 273.15;
    }

    
    if (to === 'Fahrenheit') {
      return (celsius * 9 / 5) + 32;
    } else if (to === 'Kelvin') {
      return celsius + 273.15;
    }
    
    
    return celsius;
  }
}