// app.component.ts
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FamilyNotesService } from './services/family-notes.service';
import { LocalService } from './services/local.service';
import { Topic } from './models/topic.model';
import { Note } from './models/note.model';
import { TopicDialogComponent } from './dialogs/topic-dialog/topic-dialog.component';
import { NoteDialogComponent } from './dialogs/note-dialog/note-dialog.component';
import { DeleteConfirmationDialogComponent } from './dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  topics: Topic[] = [];
  serviceTopics: Topic[] = [];
  filteredTopics: Topic[] = [];
  selectedTopic: Topic | null = null;
  notes: Note[] = [];
  selectedNote: Note | null = null;
  selectedNoteIndex = -1;
  selectedTopicIndex = -1;
  isTopicDisabled = true;
  isNoteDisabled = true;
  searchTopic: string = '';
  online = false;
  topicsStorageKey = 'topics';

  constructor(private familyNotesService: FamilyNotesService, private localStore: LocalService, private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit() {
    this.syncOnline();
  }

  syncOnline(): any {
    this.familyNotesService.getAllTopics().subscribe(topics => {
      console.log(topics);
      if(topics != null) {
        console.log("Using service data");
        this.online = true;
        this.topics = topics;
        if(this.topics.length === 0) {
          this.topics = this.serviceTopics
          this.localStore.saveData(this.topicsStorageKey, JSON.stringify(this.serviceTopics));
          const storedTopics = this.localStore.getData(this.topicsStorageKey);
        } else {
            this.syncValues();
        }
        console.log(this.online);
        console.log(this.topics);
      } else {
          this.loadLocalTopics()
      }
    });
  }

  loadLocalTopics() {
   console.log("Using local data");
    let parsedTopics: Topic[];
    let storedTopics = this.localStore.getData(this.topicsStorageKey);
    if(storedTopics != null) {
      parsedTopics = JSON.parse(storedTopics);
      this.topics = parsedTopics;
    } else {
      console.log("local data null, using seed data");
      this.http.get('assets/topicsSeed.json').subscribe((data: any) => {
      this.topics = data;
      this.localStore.saveData(this.topicsStorageKey, JSON.stringify(this.topics));
    });
      storedTopics = this.localStore.getData(this.topicsStorageKey);
      parsedTopics = JSON.parse(storedTopics!);
      this.topics = parsedTopics;
    }
  }

  syncValues() {
    //TODO match Topics
    //TODO get notes and match each note
    //TODO if any Topic or Note does not match, update using the local values
  }

  selectTopic(selected: number): void {
    console.log("current selected " + this.selectedTopicIndex);
    if(selected === this.selectedTopicIndex) {
      selected = -1
    }
    this.selectedTopicIndex = selected;
    console.log("current index " + this.selectedTopicIndex);
    if(this.selectedTopicIndex === -1) {
      this.selectedTopic = null;
      this.isTopicDisabled=true;
      return;
    } else {
      console.log("update notes ");
      this.selectedTopic = this.topics[this.selectedTopicIndex];
      console.log("topic " + this.selectedTopic.topic + " selected");
      this.notes = this.selectedTopic.notes as Note[];
      let id =this.selectedTopic.topicId;
      this.isTopicDisabled=false;
      if(this.online) {
        this.familyNotesService.getNotesByTopic(id).subscribe(notes => this.notes = notes);
      } else {
        console.log(this.selectedTopic);
        if(this.selectedTopic.notes === null) {
          console.log("create empty not array");
          this.notes = [];
        } else {
        this.notes = this.selectedTopic.notes!;
        }
      }
    }
  }

  openTopicDialog(edit: boolean): void {
    let topic: Topic | null = null;
    if(edit) {
      topic = this.selectedTopic;
    } else {
      topic = {

        }
    }
    const dialogRef = this.dialog.open(TopicDialogComponent, { width: '400px', data: { topic } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(this.online) {
          if (edit) {
              console.log("Update Topic");
              this.familyNotesService.updateTopic(result).subscribe(() => this.syncOnline());
            } else {
              console.log("Add Topic");
              this.familyNotesService.addTopic(result).subscribe(() => this.syncOnline());
            }
        } else if(edit) {
            console.log("Update Topic locally");
            this.selectedTopic = result;
            this.topics[this.selectedTopicIndex] = result;
        } else {
              console.log("Add Topic Locally");
          this.topics.push(result);
        }
        //update changed topics
        this.localStore.saveData(this.topicsStorageKey, JSON.stringify(this.topics));
      }
    });
  }

  deleteTopic(): void {
    if (this.selectedTopic == null) { return; }
    let id = this.selectedTopic.topicId;
    let title = this.selectedTopic.topic
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, { width: '300px', data: {title}});
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        console.log("Topic ID to delete: " + id);
        if(this.online) {
          this.familyNotesService.deleteTopic(id).subscribe(() => this.syncOnline());
        } else {
          this.topics.splice(this.selectedTopicIndex, 1);
          //update deleted topic
          this.localStore.saveData(this.topicsStorageKey, JSON.stringify(this.topics));
        }
      }
    });
  }

  openNoteDialog(edit: boolean): void {
    console.log(this.selectedTopicIndex);
    if (!this.selectedTopic) { console.log("no selected Topic to add a note"); return };
    let note: Note | null = null;
    let id = this.selectedTopic.topicId;
    if(edit) {
      note = this.selectedNote;
    } else {
      note =  {
        topicId: id,
        noteId: null,
        title: '',
        text: ''
        }
    }
    const dialogRef = this.dialog.open(NoteDialogComponent, { width: '400px', data: { note, edit } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(this.online) {
          if(edit) {
            this.familyNotesService.updateNote(result).subscribe(() => this.getNotesByTopic(result.topicId));
          } else {
            this.familyNotesService.addNote(result).subscribe(() => this.getNotesByTopic(result.topicId));
          }
        } else {
          if(edit) {
            this.notes[this.selectedNoteIndex] = result;
          } else {
            this.notes.push(result);
          }
          //update local storage so we can sync later
          this.topics[this.selectedTopicIndex].notes = this.notes;
          this.localStore.saveData(this.topicsStorageKey, JSON.stringify(this.topics));
        }
      }
    });
  }

  selectNote(selected: number): void {
    console.log("current Note selected " + this.selectedNoteIndex);
    if(selected === this.selectedNoteIndex) {
      selected = -1
    }
    this.selectedNoteIndex = selected;
    console.log("current index " + selected);
    if(this.selectedNoteIndex === -1) {
      this.selectedNote = null;
      this.isNoteDisabled=true;
      return;
    } else {
      console.log("update notes ");
      this.selectedNote = this.notes[this.selectedNoteIndex];
      this.isNoteDisabled=false;
    }
  }

  getNotesByTopic(topicId: number): void {
    this.familyNotesService.getNotesByTopic(topicId).subscribe(notes => this.notes = notes);
  }

  deleteNote(): void {
    if (!this.selectedNote) { return; }
    let title = this.selectedNote.title
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, { width: '300px', data: {title}});
    let noteId = this.selectedNote.noteId;
    let topicId = this.selectedNote.topicId
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && this.selectedTopic) {
        if(this.online) {
          this.familyNotesService.deleteNote(noteId).subscribe(() => this.getNotesByTopic(topicId));
        } else {
          //remove from notes array and update local storage
          this.notes.splice(this.selectedNoteIndex, 1);
          this.topics[this.selectedNoteIndex].notes = this.notes;
          this.localStore.saveData(this.topicsStorageKey, JSON.stringify(this.topics));
        }
      }
    });
  }

  filterTopics() {
    this.filteredTopics = this.topics.filter(topic => {
      return topic.topic!.toLowerCase().includes(this.searchTopic.toLowerCase());
    });
  }

//   onFileChange(fileInputEvent: any) {
//     console.log(fileInputEvent.target.files[0]);
//     }
}
