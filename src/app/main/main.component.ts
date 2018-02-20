import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

import 'rxjs/add/operator/switchMap';

import { IList } from '../shared/interfaces';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  list: IList = null;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore
  ) { }

  ngOnInit() {
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
}
