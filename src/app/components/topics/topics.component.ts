import {Component, OnInit, Inject} from '@angular/core';
import {Topic} from "../../models/topic.model";
import {Dialog, DialogRef, DIALOG_DATA, DialogModule} from '@angular/cdk/dialog';
import {Note} from "../../models/note.model";
import {Router} from '@angular/router';
import {FamilyNotesService} from "../../services/family-notes.service";
import {FormsModule} from '@angular/forms';

export interface DialogData {
  newTopic: string;
  }

// export interface NoteDialogData {
//   newTitle: string;
//   newText: string;
//   }

@Component({
  selector: 'topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})

export class TopicsComponent implements OnInit {
//   router = inject(Router)
  deleteMessage= false;
  isUpdated = false;
  topics?: Topic[];
  notes?: Note[];
  currentIndex = -1;
  message:string = '';
  currentTopic: Topic = {};
  newTopic: string | undefined;

  constructor(private familyNotesService: FamilyNotesService, public dialog: Dialog) { }

      ngOnInit(): void {
        this.isUpdated=false;
        this.retrieveTopics();
      }

      retrieveTopics(): void {
        console.log('Getting Topics from service');
        this.familyNotesService.getAllTopics().subscribe({
          next: (data) => {
            const topic: Topic = {
              topicId: data[0].topicId,
              userId: data[0].userId,
              topic: data[0].topic,
              notes: data[0].notes,
              time: data[0].time,
              isSharable: data[0].isSharable
          };
          this.topics = data;
          },
          error: (e) => console.error(e)
        });
      }

      refreshList(): void {
        this.retrieveTopics();
        this.currentTopic = {};
        this.currentIndex = -1;
        this.notes = []
      }

      setActiveTopic(topic: Topic, index: number): void {
        console.log('Current Index: ' + index);
        this.notes = topic.notes as Note[];
        this.currentTopic = topic;
        this.currentIndex = index;
//         this.router.navigate(['notes/', this.notes]);
      }

      removeAllTopics(): void {
        this.familyNotesService.deleteAllTopics().subscribe({
          next: (res) => {
            console.log(res);
            this.refreshList();
          },
          error: (e) => console.error(e)
        });
      }

      searchTopic(): void {
        console.log("find topic");
        // this.currentTopic = {};
        this.currentIndex = -1;
        console.log("text: " + this.message);
        this.familyNotesService.findTopic(this.message).subscribe({
          next: (data) => {
            this.topics = data;
            console.log(data);
          },
          error: (e) => console.error(e)
        });
      }

    public createTopic(): void {
      const dialogRef = this.dialog.open<string>(AddTopicDialog, {
        width: '250px',
        data: { newNote: this.newTopic}
        });

      dialogRef.closed.subscribe(result => {
        console.log(result);
        this.newTopic = result;
        console.log(this.newTopic);
      let t:Topic = new Topic();
      t.topic = this.newTopic;
      t.userId = 1
      t.isSharable = true;
      console.log('add Topic ' + this.newTopic);
      console.log(t.topic);
      this.familyNotesService.createTopic(t).subscribe({
          next: (data) => {
            this.topics = data;
            console.log(data);
            this.newTopic = '';
          },
          error: (e) => console.error(e)
        });
      this.refreshList();
      });
    }

   public updateTopic(): void {
      console.log("update topic Dialog");
    }

    public deleteTopic(): void {
      console.log("delete topic Dialog");
    }

    public createNote(): void {
      console.log("Current Index: " + this.currentIndex);
      if(this.currentIndex == -1) {
        console.log("You Must select A topic before adding a note");
      } else {
        console.log("create note Dialog");
      }
//       const dialogRef = this.dialog.open<string>(AddNoteDialog, {
//         width: '250px',
//         data: { newTitle: this.newTitle, newText: this.newText }
//         });

//       dialogRef.closed.subscribe(result => {
//         console.log('dialog closed');
//         console.log(result.newTitle);
//         console.log(result.newText);
//       let n:Note = new Note();
//       n.title = result.newTitle;
//       n.userId = 1
//       n.topicId = this.currentIndex;
//       console.log('add Note ' + result.newTitle);
//       console.log(n.title);
//       this.familyNotesService.createNote(n).subscribe({
//           next: (data) => {
//             this.notes = data;
//             console.log(data);
//           },
//           error: (e) => console.error(e)
//         });
//       this.refreshList();
//       });
    }

    public deleteNote(): void {
      console.log("delete note Dialog");
    }

    public updateNote(): void {
      console.log("update note Dialog");
    }

    public refreshNotes(): void {
      console.log("refresh notes");
    }
}

@Component({
  selector: 'addTopic.dialog',
  templateUrl: '../dialogs/addTopic.dialog.html',
  standalone: true,
  imports: [FormsModule],
})
export class AddTopicDialog  {
  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: DialogData,
  ) {}
  }


// @Component({
//   selector: 'addNote.dialog',
//   templateUrl: '../dialogs/addNote.dialog.html',
//   standalone: true,
//   imports: [FormsModule],
// })
// export class AddNoteDialog  {
//   constructor(
//     public dialogRef: DialogRef<string>,
//     @Inject(DIALOG_DATA) public data: NoteDialogData,
//   ) {}
//   }
