import {Time} from "@angular/common";
import {Note} from "./note.model";

export class Topic {
  topicId?: any;
  userId?: any;
  topic?: string;
  isSharable?: boolean
  notes?: Note[];
  time?: Time;
}
