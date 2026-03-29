import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RecordItem {
  id?: string;
  title: string;
  artist: string;
  price: number;
  media_grade: string;
  sleeve_grade: string;
  format: string;
  label?: string;
  year?: string;
  catalog_number?: string;
  description?: string;
  audio_features?: string;
  accessories?: string;
  image_url: string;
  liked?: boolean;
  created_at?: string;
  
  // For frontend compatibility with old models
  mediaGrade?: string;
  sleeveGrade?: string;
  catalogNumber?: string;
  audioFeatures?: string;
  image?: string;
  condition?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private http = inject(HttpClient);
  private apiUrl = '/api/records';

  getRecords(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRecord(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createRecord(recordData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, recordData);
  }
}
