import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { IList } from '../shared/interfaces';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.sass']
})
export class ListsComponent implements OnInit {
  listName = '';

  private listsCollection: AngularFirestoreCollection<IList>;
  lists: Observable<IList[]>;

  constructor(
    private db: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit() {
    this.listsCollection = this.db.collection<IList>('lists', ref => ref.orderBy('name'));

    this.lists = this.listsCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as IList;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
  }

  addList() {
    this.listsCollection.add({
      name: this.listName,
      count: 0,
      completed: 0
    }).then(() => {
      this.listName = '';
    });
  }
}
