import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define an interface that matches your Python Pydantic model
export interface ConversionLog {
  category: string;
  input_value: number;
  from_unit: string;
  to_unit: string;
  result_value: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  // This points to your FastAPI backend
  private apiUrl = 'http://127.0.0.1:8000/api/history';

  constructor(private http: HttpClient) { }

  // POST: Send a new conversion to the database
  saveConversion(conversion: ConversionLog): Observable<any> {
    return this.http.post(this.apiUrl, conversion);
  }

  // GET: Retrieve the history from the database
  getHistory(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}