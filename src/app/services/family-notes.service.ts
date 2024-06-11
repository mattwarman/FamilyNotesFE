import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import {Note} from "../models/note.model";

const baseTopicUrl = 'http://localhost:8080/api/v1/topic';
const baseNoteUrl = 'http://localhost:8080/api/v1/note';

@Injectable({
  providedIn: 'root'
})
export class FamilyNotesService {

  constructor(private http: HttpClient) { }

  getAllTopics(): Observable<Topic[]>
  {
  let headers = new HttpHeaders().set('Access-Control-Allow-Origin', baseTopicUrl);
    return this.http.get<Topic[]>(baseTopicUrl, { headers:headers});
  }

  findTopic(text: string): Observable<Topic[]> {
    let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:8080/v1/api/topic/' + text);
    return this.http.get<Topic[]>(baseTopicUrl + '/find/' + text, { headers:headers});
  }

  getTopic(id: any): Observable<Topic> {
    return this.http.get(`${baseTopicUrl}/${id}`);
  }

  createTopic(data: any): Observable<any> {
    return this.http.post(baseTopicUrl, data);
  }

  updateTopic(id: any, data: any): Observable<any> {
    return this.http.put(`${baseTopicUrl}/${id}`, data);
  }

  deleteTopic(id: any): Observable<any> {
    return this.http.delete(`${baseTopicUrl}/${id}`);
  }

  deleteAllTopics(): Observable<any> {
    return this.http.delete(baseTopicUrl);
  }

  findTopicByUser(userid: any): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${baseTopicUrl}?userId=${userid}`);
  }

  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(baseNoteUrl);
  }

  getNotesByTopic(id: any): Observable<Note[]> {
    return this.http.get<Note[]>(`${baseNoteUrl}/${id}`);
  }

  createNote(data: any): Observable<any> {
    return this.http.post(baseNoteUrl, data);
  }
}
