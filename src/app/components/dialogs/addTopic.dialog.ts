import {Component, OnInit} from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

/**
 * @title Add Topic
 */
@Component({
  selector: 'addTopic.dialog',
  templateUrl: './addTopic.dialog.html',
  standalone: true,
  imports: [MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
})
export class AddTopicDialog implements OnInit {
//   topic: string;

  constructor(@Inject(DIALOG_DATA) public data: DialogData){}

    ngOnInit(): void {}

  open(dialog: MatDialog): void {
//     const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
//       data: {name: this.name, animal: this.animal},
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed');
//       this.topic = result;
//     });
//   console.log("topic: " + this.topic);
//   }
 const dialogRef = dialog.open(AddTopicComponent);
//  return dialogRef.afterClosed();
//   onNoClick(): void {
//     this.dialog.close();
  }
}

