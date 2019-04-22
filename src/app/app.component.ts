import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Arya Grid';

  columns = [
    {
      key: 'id',
      label: 'ID',
      type: 'number',
      width: 1,
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string',
      width: 3,
    },
    {
      key: 'age',
      label: 'Age',
      type: 'number',
      width: 1,
    }
  ];

  data = Array(10000).fill(1).map((ele, index) => ({
    id: index + 1,
    name: 'Name ' + (index + 1),
    age: parseInt(Math.random() * 100 + ''),
  }));
}
