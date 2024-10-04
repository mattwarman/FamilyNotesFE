import {Component, OnInit} from '@angular/core';
import {Topic} from "../../models/topic.model";
import {Note} from "../../models/note.model";
import {Router} from '@angular/router';
import {FamilyNotesService} from "../../services/family-notes.service";
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule],``
})

export class TopicsComponent implements OnInit {
  deleteMessage= false;
  isUpdated = false;
  topics?: [];
  notes?: Note[];
  currentIndex = -1;
  message = '';
  currentTopic: Topic = {};

  constructor(private familyNotesService: FamilyNotesService, private router:Router) { }

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
              sharable: data[0].sharable
          };
                    this.topics = data;
                    console.log(data[1]);
//                 console.log(data[0].notes.title);
//                 console.log(data[0].notes.title);
//                 console.log(data[0].notes.text);
//                 console.log(data[0].notes.noteImage);
//                 console.log(data[0].notes.time);
//                 console.log(data[0].notes.userId);
//                 console.log(data[0].notes.topicId);
          },
          error: (e) => console.error(e)
        });
//           console.log('topics: ', data);
//           this.topics = data;
//           const topic = this.topics[1]?;
//           console.log(topic.topic);
//           console.log(topic.notes[0]);
//           console.log(topic.time);
//           this.notes = this.topics[0].notes;
//           console.log(this.notes.length)
//           console.log(this.topics[1].topic);
//           console.log(this.topics[0].notes);
//           console.log(this.topics[1].time);
//           this.currentTopic = this.topics[0];
//           console.log(this.currentTopic.topic);
//           console.log(this.currentTopic.notes);
//           console.log(this.currentTopic.time);
      }

      refreshList(): void {
        this.retrieveTopics();
        this.currentTopic = {};
        this.currentIndex = -1;
        this.notes = []
      }

      setActiveTopic(topic: Topic, index: number): void {
      console.log("topic " + topic.topic + " selected");
        this.notes = topic.notes as Note[];
        this.currentTopic = topic;
        this.currentIndex = index;
//         this.router.navigate['notes'];
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

      searchTitle(): void {
        // this.currentTopic = {};
        this.currentIndex = -1;

        this.familyNotesService.findTopicByUser(1).subscribe({
          next: (data) => {
            this.topics = data;
            console.log(data);
          },
          error: (e) => console.error(e)
        });
      }
    }
