import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicsComponent } from './components/topics/topics.component';
import { NotesComponent } from './components/notes/notes.component';

const routes: Routes = [
  { path: 'topics', component: TopicsComponent },
  { path: 'notes', component: NotesComponent },
  { path: 'notes/:id', component: NotesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

