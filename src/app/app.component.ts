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
  data: any;

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
//     let storedTopics = null;
    if(storedTopics != null) {
      parsedTopics = JSON.parse(storedTopics);
      this.topics = parsedTopics;
      console.log(storedTopics);
    } else {
      console.log("local data null, using seed data");
//       const localTopics: string = '[{"topicId":2,"userId":1,"topic":"test","notes":[],"time":"2024-01-27T13:25:33","sharable":true},{"topicId":3,"userId":1,"topic":"Test 2","notes":[{"noteId":2,"title":"Test 1","text":"this is a test","noteImage":null,"time":"2024-01-28T20:32:07","userId":1,"topicId":3},{"noteId":3,"title":"Passwords","text":"User: MyUser\r\n Password: MyPassword \r\n","noteImage":null,"time":"2024-01-28T20:38:38","userId":1,"topicId":3}],"time":"2024-01-27T13:29:28","sharable":true},{"topicId":4,"userId":1,"topic":"Passwords","notes":[{"noteId":4,"title":"AAA","text":"sheila.warman@yahoo.com\nPass:Oneworldaaa23","noteImage":null,"time":"2024-10-04T11:50:39","userId":2,"topicId":4},{"noteId":5,"title":"AARP","text":"User: sheila.warman@gmail.com\nPass: Owaarp23\n3353287141\n3/29/20\nChanged email: sheila.warma@yahoo.com\nAdded to LastPass","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":6,"title":"Acorns","text":"Owacorns23\nYahoo.com\n?The Who","noteImage":null,"time":"2024-10-04T13:30:55","userId":2,"topicId":4},{"noteId":7,"title":"Adobe","text":"ID: sheila.warman@yahoo.com\nLast Pasd","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":8,"title":"AeroGarden","text":"ID: sheila.warman@yahoo.com\nAerooneworld23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":9,"title":"Airbnb","text":"sheila.warman@yahoo.com\nPZaneford42","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":10,"title":"Allegiant Air","text":"Terr@4zane","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":11,"title":"altafiber formerly Cincinnati Bell","text":"","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":12,"title":"Amazon formerly Cincinnati Bell","text":"Email: sheila.warman@yahoo.com/nPass: Oneworldamazon23 or Owaubile23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":13,"title":"Amazon Prime","text":"mattwrock@gmail.com/nFCCWarm@n123","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":14,"title":"American Airlines","text":"AAdvantage # 6X3ND26/nPass: Terra4zane23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":15,"title":"AMEX","text":"Log in: swarman23/nOwAX23??/n3411 660682 71003 ex. 01/29/n5203","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":16,"title":"Amtrack","text":"sheila.warman@yahoo.com\nPass: Owamtrak23!","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":17,"title":"Anthem.com","text":"Pass: Terr@4zane\nUser ID: WarmanClan\n? Bill, Cathy, Geza\nEmail: sheila.warman","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":18,"title":"Apple ID","text":"ID: sheila.warman@gmail.com\nPass: Terra4zane\nPurchased Terras computer 3/28/17","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":19,"title":"Apple TV","text":"mattwrock@gmail.com\nSuperfanFCC2","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":20,"title":"Appliance parts pros.com","text":"Yahoo\nOneappliance23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":21,"title":"Atlas Coffee","text":"Ryan and Jess gift subscription is under\nsheila.warman@gmail.com\nPASS: Morningjoe\nOurs is under\nsheila.warman@yahoo.com\nPass: Oneworldatlas23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":22,"title":"Audible","text":"5136028492\nOwaudible23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":23,"title":"Audio-technica","text":"Yahoo\nOwaudio23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":24,"title":"AXS.com for tickets","text":"Sheila.Warman@\nPass: terra1","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":25,"title":"BandCamp","text":"Yahoo\nOneworldband23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":26,"title":"Barnes and Noble","text":"Zaneford42","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":27,"title":"Bed Bath & Beyond","text":"sheshor\nZaneford42","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":28,"title":"Beyond Menu","text":"sheila.warman@yahoo.com\nterra1\n","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":29,"title":"Bit Warden","text":"Yahoo\nOneworld@bit23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":30,"title":"BJs","text":"Pass: terra21\nsheshor\nMember # BZAZMJV","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":31,"title":"Booking.com","text":"Gmail\nOneworldbooking23","noteImage":null,"time":"2024-06-02T20:21:32","userId":2,"topicId":4},{"noteId":32,"title":"Botox Saving Plan","text":"Gmail\nPass: Owbotox23","n'

      this.http.get('assets/topicsSeed.json').subscribe((data: any) => {
      this.data = data;
      console.log(this.data);
    });
//       this.localStore.saveData(this.topicsStorageKey, localTopics);
      storedTopics = this.localStore.getData(this.topicsStorageKey);
      parsedTopics = JSON.parse(this.data);
      this.topics = parsedTopics;
      console.log(this.topics);
    }
  }

  syncValues() {
    //TODO match Topics
    //TODO get notes and match each note
    //TODO if any Topic or Note does not match, update using the local values
  }


//   loadTopics(): void {
//     this.familyNotesService.getAllTopics().subscribe(topics => {this.topics = topics
//      console.log(this.topics);
//      });
//   }

  get filteredTopics() {
    return this.topics.filter(t => t.topic);
  }

  selectTopic(selected: number): void {
    console.log("current selected " + this.selectedTopicIndex);
    if(selected === this.selectedTopicIndex) {
      selected = -1
    }
    this.selectedTopicIndex = selected;
    console.log("current index " + selected);
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
      this.familyNotesService.getNotesByTopic(id).subscribe(notes => this.notes = notes);
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
    console.log("adding topic");
    console.log(this.selectedTopic);
    console.log(topic);
    const dialogRef = this.dialog.open(TopicDialogComponent, { width: '400px', data: { topic } });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (edit) {
          console.log("Update ");
          this.familyNotesService.updateTopic(result).subscribe(() => this.syncOnline());
        } else {
          this.familyNotesService.addTopic(result).subscribe(() => this.syncOnline());
        }
      }
      this.syncOnline();
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
        this.familyNotesService.deleteTopic(id).subscribe(() => this.syncOnline());
      }
    });
  }

  openNoteDialog(edit: boolean): void {
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
        console.log("result");
        console.log(result);
        if(edit) {
          this.familyNotesService.updateNote(result).subscribe(() => this.getNotesByTopic(result.topicId));
        } else {
          this.familyNotesService.addNote(result).subscribe(() => this.getNotesByTopic(result.topicId));
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
        this.familyNotesService.deleteNote(noteId).subscribe(() => this.getNotesByTopic(topicId));
      }
    });
  }

//   onFileChange(fileInputEvent: any) {
//     console.log(fileInputEvent.target.files[0]);
//     }
}
