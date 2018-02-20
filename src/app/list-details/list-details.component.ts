import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';

import { IList, ITodoItem } from '../shared/interfaces';
import { ObservableProperty } from '../shared/observable-property/observable-property';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.sass']
})
export class ListDetailsComponent implements OnInit {
  @Input() list: IList;
  @ObservableProperty('list')
  public list$ = new Subject<IList>();

  filter: string;
  @ObservableProperty('filter')
  public filter$ = new Subject<string>();

  status: string;
  @ObservableProperty('status')
  public status$ = new Subject<string>();

  newTitle: string;
  todoItemsCollection: AngularFirestoreCollection<ITodoItem>;
  todoItems: Array<ITodoItem> = [];
  haveTodos = true;

  constructor(private db: AngularFirestore) {
    this.filter = '';
    this.status = '';
  }

  ngOnInit() {
    const combined = Observable
      .combineLatest(
        [
          this.list$.startWith(null),
          this.filter$.startWith(''),
          this.status$.startWith('')
        ],
        (list, filter, status) => ({ list, filter, status }),
      );

    combined
      .debounceTime(300)
      .subscribe(({ list, filter, status }) => {
        if (list) {
          this.todoItemsCollection = this.db.collection<ITodoItem>('todos', ref => {
            let query = ref.where('listId', '==', list.id);

            if (filter) {
              query = query.where('title', '==', filter);
            }

            if (status) {
              query = query.where('completed', '==', status === 'completed' ? true : false);
            }

            return query;
          });

          this.todoItemsCollection.snapshotChanges().map(changes => {
            return changes.map(a => {
              const data = a.payload.doc.data() as ITodoItem;
              const id = a.payload.doc.id;
              return { id, ...data };
            });
          }).subscribe(items => this.todoItems = items);
        }
      });
  }

  addTodo() {
    this.todoItemsCollection.add({
      title: this.newTitle,
      completed: false,
      listId: this.list.id
    }).then(() => {
      const list = this.db.doc<IList>(`lists/${this.list.id}`);

      list.ref.get().then(item => {
        const data = item.data();

        list.update({
          count: data.count + 1,
        });
      });

      this.newTitle = '';
    });
  }

  editTodo(item) {
    item.editing = true;
  }

  toggleCompletion(todo) {
    const completed = !todo.completed;

    this.db
      .doc<ITodoItem>(`todos/${todo.id}`)
      .update({ completed })
      .then(() => {
        const list = this.db.doc<IList>(`lists/${this.list.id}`);

        list.ref.get().then(item => {
          const data = item.data();

          list.update({
            completed: completed ? data.completed + 1 : data.completed - 1
          });
        });
      });
  }

  removeTodo(todo) {
    const todoItem = this.db.doc<ITodoItem>(`todos/${todo.id}`);

    todoItem.ref.get().then(item => {
      const data = item.data();

      todoItem.delete().then(() => {
        const list = this.db.doc<IList>(`lists/${this.list.id}`);

        list.ref.get().then(listItem => {
          const listData = listItem.data();

          list.update({
            count: listData.count - 1,
            completed: data.completed ? listData.completed - 1 : +listData.completed
          });
        });
      });
    });
  }

  updateTodo(todo: ITodoItem, editedTitle: string) {
    const doc: AngularFirestoreDocument<ITodoItem> = this.db.doc<ITodoItem>(`todos/${todo.id}`);
    editedTitle = editedTitle.trim();
    todo.editing = false;

    if (editedTitle.length === 0) {
      return doc.delete();
    }

    doc.update({ title: editedTitle });
  }

  cancelEditing(todo: ITodoItem) {
    todo.editing = false;
  }
}
