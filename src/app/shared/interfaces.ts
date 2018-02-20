export interface IList {
  id?: string;
  name: string;
  count: number;
  completed: number;
}

export interface ITodoItem {
  id?: string;
  title: string;
  completed: boolean;
  listId: string;
  editing?: boolean;
}
