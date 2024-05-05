import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import {Note} from "../models/note.model";

const baseTopicUrl = 'http://localhost:8080/vi/api/topic';
const baseNoteUrl = 'http://localhost:8080/vi/api/note';

@Injectable({
  providedIn: 'root'
})
export class FamilyNotesService {

  constructor(private http: HttpClient) { }

  getAllTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(baseTopicUrl);
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
}
