// dialogs/topic-dialog/topic-dialog.component.ts
import { Component, Inject } from '@angular/core';
import {Topic} from "../../models/topic.model";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-topic-dialog',
  templateUrl: './topic-dialog.component.html'
})
export class TopicDialogComponent {
  topicForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TopicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { topic: Topic },
    private fb: FormBuilder
  ) {
    console.log(data);
    console.log(data.topic.sharable);
    this.topicForm = this.fb.group({
      topic: [data.topic.topic ? data.topic.topic : '', Validators.required],
      sharable: [data.topic.sharable ? data.topic.sharable : false],
    });
  }

  onSubmit(): void {
    if (this.topicForm.valid) {
      const topic = {
        topicId: this.data.topic ? this.data.topic.topicId : Math.random(),
        userId: 1,  // Hardcoded for now, adjust based on your needs
        topic: this.topicForm.value.topic,
        sharable: this.topicForm.value.isSharable,
        time: new Date().toISOString()
      };
      this.dialogRef.close(topic);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
