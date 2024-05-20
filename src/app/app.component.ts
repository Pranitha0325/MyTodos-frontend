import { Component, Injector, OnInit, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppComponentBase } from '@shared/app-component-base';
import { LayoutStoreService } from '@shared/layout/layout-store.service';
import { Todo } from './models/todo.model';

@Component({
  templateUrl: './app.component.html'
})
export class AppComponent extends AppComponentBase implements OnInit {
  sidebarExpanded: boolean;
  todos: Todo[] = [];

  private apiUrl = 'https://localhost:44311/api/ToDo';  // Base API URL

  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService,
    private http: HttpClient
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.fetchTodos();

    // Other initialization code
    // this.renderer.addClass(document.body, 'sidebar-mini');
    // SignalRAspNetCoreHelper.initSignalR();
    // abp.event.on('abp.notifications.received', (userNotification) => {
    //   abp.notifications.showUiNotifyForUserNotification(userNotification);
    //   Push.create('AbpZeroTemplate', {
    //     body: userNotification.notification.data.message,
    //     icon: abp.appPath + 'assets/app-logo-small.png',
    //     timeout: 6000,
    //     onClick: function () {
    //       window.focus();
    //       this.close();
    //     }
    //   });
    // });
    // this._layoutStore.sidebarExpanded.subscribe((value) => {
    //   this.sidebarExpanded = value;
    // });
  }

  fetchTodos(): void {
    this.http.get<any>(this.apiUrl).subscribe(
      (response) => {
        this.todos = response.result;
        console.log('Updated Todos:', this.todos);
      },
      (error) => {
        console.error('Error fetching todos:', error);
      }
    );
  }

  toggleSidebar(): void {
    this._layoutStore.setSidebarExpanded(!this.sidebarExpanded);
  }

  onSubmit(todoValue: string): void {
    const newTodo = { Title: todoValue, createdDate: new Date(), isCompleted: false };

    this.http.post(this.apiUrl, newTodo).subscribe(
      () => {
        console.log('Todo added successfully');
        this.fetchTodos();  // Fetch the updated list of todos after adding a new one
      },
      (error) => {
        console.error('Error adding todo:', error);
      }
    );
  }

  toggleCompleted(todo: Todo): void {
    todo.isCompleted = !todo.isCompleted;
console.log(todo.id, "todocheckedid")
    this.http.put(`${this.apiUrl}/${todo.id}`, todo).subscribe(
      () => {
        console.log('Todo updated successfully');
      },
      (error) => {
        console.error('Error updating todo:', error);
        // Revert the change if there's an error
        todo.isCompleted = !todo.isCompleted;
      }
    );
  }

  deleteTodo(todoId: string): void {
    this.http.delete(`${this.apiUrl}/${todoId}`).subscribe(
      () => {
        console.log('Todo deleted successfully');
        // Remove the deleted todo from the todos array
        this.todos = this.todos.filter(t => t.id !== todoId);
      },
      (error) => {
        console.error('Error deleting todo:', error);
      }
    );
  }
}
