import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/switchMap';

import { IList } from '../shared/interfaces';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  list: IList = null;
  listName = '';

  private listsCollection: AngularFirestoreCollection<IList>;
  lists: Observable<IList[]>;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore
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

    this.route.paramMap
      .subscribe(params => {
        const id = params.get('id');

        if (id) {
          this.db.doc<IList>(`lists/${id}`).snapshotChanges().subscribe(changes => {
            const data = changes.payload.data() as IList;
            const docId = changes.payload.id;
            this.list = { id: docId, ...data };
          });
        } else {
          this.list = null;
        }
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
