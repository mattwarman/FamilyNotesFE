// app.component.ts
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FamilyNotesService } from './services/family-notes.service';
import { Topic } from './models/topic.model';
import { Note } from './models/note.model';
import { TopicDialogComponent } from './dialogs/topic-dialog/topic-dialog.component';
import { NoteDialogComponent } from './dialogs/note-dialog/note-dialog.component';
import { DeleteConfirmationDialogComponent } from './dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  topics: Topic[] = [];
  selectedTopic: Topic | null = null;
  notes: Note[] = [];
  selectedNote: Note | null = null;
  selectedNoteIndex = -1;
  selectedTopicIndex = -1;
  isTopicDisabled = true;
  isNoteDisabled = true;

  constructor(private familyNotesService: FamilyNotesService, public dialog: MatDialog) {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics(): void {
    this.familyNotesService.getAllTopics().subscribe(topics => this.topics = topics);
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
          this.familyNotesService.updateTopic(result).subscribe(() => this.loadTopics());
        } else {
          this.familyNotesService.addTopic(result).subscribe(() => this.loadTopics());
        }
      }
      this.loadTopics();
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
        this.familyNotesService.deleteTopic(id).subscribe(() => this.loadTopics());
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

//   loadNotes(): void {
//     if (this.selectedTopic) {
//       this.familyNotesService.getNotesByTopic(this.selectedTopic.topicId).subscribe(notes => this.notes = notes);
//     }
//   }
}
