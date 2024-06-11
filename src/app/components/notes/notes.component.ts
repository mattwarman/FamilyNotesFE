/*
 * Created by matt on 1/28/2024
*/
import {Component, OnInit} from '@angular/core';
import {Note} from "../../models/note.model";
import {FamilyNotesService} from "../../services/family-notes.service";
import {dateTimestampProvider} from "rxjs/internal/scheduler/dateTimestampProvider";

@Component({
  selector: 'notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})


export class NotesComponent implements OnInit {
//   router = inject(Router)
  currentNote: Note | undefined;
  notes?: Note[];
  currentIndex: number | undefined;
  note: Note = {
    noteId: '',
    title: '',
    text: '',
    image: null
  };
  private topicId: any;

  constructor() {
//     this.route.params.subscribe(params) =>{
//       this.notes = param['notes'];
//       console.log(params.notes);
//     }
  }

  ngOnInit(): void {
//     this.topicId = 1;
//     this.retrieveNotes()
  }

//   retrieveNotes(): void {
//     this.familyNoteService.getNotesByTopic(this.topicId).subscribe({
//       next:(data) => {
//         this.notes = data;
//         console.log(data);
//       },
//       error: (e) => console.error(e)
//     });
//   }


  refreshList(): void {
//     this.retrieveNotes();
    this.currentNote = {};
    this.currentIndex = -1;
  }

}

