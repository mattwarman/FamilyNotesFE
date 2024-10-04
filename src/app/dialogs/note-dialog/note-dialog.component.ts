// dialogs/note-dialog/note-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { Note } from '../../models/note.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-note-dialog',
  templateUrl: './note-dialog.component.html'
})
export class NoteDialogComponent {
  noteForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { note: Note, edit: boolean  },
    private fb: FormBuilder
  ) {
    console.log(data.note);
    if(data.edit) {
      this.noteForm = this.fb.group({
        title: [data.note.title, Validators.required],
        text: [data.note.text, Validators.required],
        image: [data.note.image]
      });
    } else {
      this.noteForm = this.fb.group({
        title: ['', Validators.required],
        text: ['', Validators.required],
        image: []
      });
    }
  }

  onSubmit(): void {
    if (this.noteForm.valid) {
    console.log(this.data)
    console.log(this.noteForm)
      const n = {
        noteId: this.data.note.noteId,
        topicId: this.data.note.topicId,
        title: this.noteForm.value.title,
        text: this.noteForm.value.text,
        image: this.noteForm.value.image,
        userId: 1,
        timestamp: new Date().toISOString()
      };
      this.dialogRef.close(n);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        // Update the form control with the base64 image data
        this.noteForm.patchValue({
          image: reader.result
        });
      };
    }
  }
}
