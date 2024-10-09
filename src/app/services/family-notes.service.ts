import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import {Note} from "../models/note.model";
import { catchError, of } from 'rxjs';

const baseTopicUrl = 'http://localhost:8080/api/v1/topic';
const baseTopicUrlCheck = 'http://localhost:8080/api/v1/topic/check';
const baseTopicUrlDelete = 'http://localhost:8080/api/v1/topic/delete';
const baseTopicUrlUpdate = 'http://localhost:8080/api/v1/topic/update';
const baseNoteUrl = 'http://localhost:8080/api/v1/note';
const baseNoteUrlDelete = 'http://localhost:8080/api/v1/note/delete';
const baseNoteUrlUpdate = 'http://localhost:8080/api/v1/note/update';

@Injectable({
  providedIn: 'root'
})
export class FamilyNotesService {

  constructor(private http: HttpClient) { }

  getAllTopics()
  {
  let headers = new HttpHeaders().set('Access-Control-Allow-Origin', baseTopicUrl);
    return this.http.get<Topic[]>(baseTopicUrl, { headers:headers})
      .pipe(
        catchError(error => {
          console.log(error);
          if(error.statusText === 'Unknown Error') {
            console.log('Error caught locally');
            return of(null);
          } else {
            throw error;
          }
        })
      );
  }

  findTopic(text: string): Observable<Topic[]> {
    let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'http://localhost:8080/v1/api/topic/' + text);
    return this.http.get<Topic[]>(baseTopicUrl + '/find/' + text, { headers:headers});
  }

  getTopic(id: any): Observable<Topic> {
    return this.http.get(`${baseTopicUrl}/${id}`);
  }

  addTopic(topic: Topic): Observable<Topic> {
    console.log("Topic: " + topic.topic);
    return this.http.post(baseTopicUrl, topic);
  }

  updateTopic(topic: Topic): Observable<Topic> {
  let headers = new HttpHeaders().set('Access-Control-Allow-Origin', baseTopicUrlUpdate);
    return this.http.post(baseTopicUrlUpdate, topic);
  }

  deleteTopic(topicId: number): Observable<any> {
    return this.http.delete(`${baseTopicUrlDelete}/${topicId}`);
  }

  deleteAllTopics(): Observable<Topic> {
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

  addNote(note: Note) {
    return this.http.post(baseNoteUrl, note);
  }

  updateNote(note: Note) {
    return this.http.post(baseNoteUrlUpdate, note);
  }

  deleteNote(noteId: any) {
    return this.http.delete(`${baseNoteUrlDelete}/${noteId}`);
    }

  checkOnline() {
  let headers = new HttpHeaders({'Access-Control-Allow-Origin': 'baseTopicUrlUpdate', 'content-type': 'application/json' });
    return this.http.get<string>(baseTopicUrlCheck, {headers:headers});
  }
}
