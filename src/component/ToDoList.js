import React from "react";
function uniqueId(len) {
    let length = len || 6;
    let charCodes = [];
    let string = '';
  
    for (let i = 0; i < 10; i++) {
      charCodes.push(48 + i);
      charCodes.push(97 + i);
    }
    for (let i = 0; i < 16; i++) {
      charCodes.push(107 + i);
    }
  
    for (let i = 0; i < length; i++) {
      let charIndex = Math.floor(Math.random() * charCodes.length);
      string = string + String.fromCharCode(charCodes[charIndex]);
    }
  
    return string;
  }
class AddTask extends React.Component {
  
    constructor() {
      super();
      this.refs = React.createRef();
      this.state = {
        newTask: {}
      };
    }
    handleSubmit=(e)=> {
      if (this.refs.taskName.value === '') {
        alert('Please enter a task');
      }
      else {
        this.setState({
          newTask: {
            content: this.refs.taskName.value,
            completed: false,
            id: uniqueId()
          }
        }, function () {
          this.props.addTask(this.state.newTask);
          this.refs.taskName.value = '';
        });
      }
      e.preventDefault();
    }
    render() {
      return (
        <form onSubmit={()=>this.handleSubmit(this)} className="task-form">
          <div className="task-input">
            <h1>Create New Task</h1>
            <input type="text" ref="taskName" placeholder="Enter note here..." />
          </div>
          <button className="task-add-button" type="submit" value="Submit"> Add New Task
          </button>
        </form>
      );
    }
  }
  class TaskItem extends React.Component {
    removeTask(id) {
      this.props.onRemove(id);
    }
    checkTask(id) {
      this.props.onCheck(id);
    }
    render() {
      return (
        <li>
          <input
            id={this.props.task.id}
            type="checkbox"
            checked={this.props.task.completed}
            onChange={this.checkTask.bind(this, this.props.task.id)} />
          <label
            htmlFor={this.props.task.id}>
            {this.props.task.content}
            <span
              className="task-strike">
            </span>
          </label>
          <button
            className="task-item-remove"
            onClick={this.removeTask.bind(this, this.props.task.id)}>
            <svg viewBox="0 0 512 512" width="20">
              <path d="m424 64h-88v-16c0-26.467-21.533-48-48-48h-64c-26.467 0-48 21.533-48 48v16h-88c-22.056 0-40 17.944-40 40v56c0 8.836 7.164 16 16 16h8.744l13.823 290.283c1.221 25.636 22.281 45.717 47.945 45.717h242.976c25.665 0 46.725-20.081 47.945-45.717l13.823-290.283h8.744c8.836 0 16-7.164 16-16v-56c0-22.056-17.944-40-40-40zm-216-16c0-8.822 7.178-16 16-16h64c8.822 0 16 7.178 16 16v16h-96zm-128 56c0-4.411 3.589-8 8-8h336c4.411 0 8 3.589 8 8v40c-4.931 0-331.567 0-352 0zm313.469 360.761c-.407 8.545-7.427 15.239-15.981 15.239h-242.976c-8.555 0-15.575-6.694-15.981-15.239l-13.751-288.761h302.44z" />
              <path d="m256 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m336 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/><path d="m176 448c8.836 0 16-7.164 16-16v-208c0-8.836-7.164-16-16-16s-16 7.164-16 16v208c0 8.836 7.163 16 16 16z"/>
            </svg>
          </button>
        </li>
      );
  
    }
  }
  class TaskList extends React.Component {
    render() {
      let taskItems = this.props.tasks.map(task => {
        return (
          <TaskItem
            task={task}
            key={task.id}
            onRemove={this.props.removeTask.bind(this)}
            onCheck={this.props.checkTask.bind(this)}
            tags={this.props.tags} />
        )
      });
  
      return (
        <ul className="task-list">
          {taskItems}
        </ul>
      )
    }
  }
  
  class TaskControls extends React.Component {
    render() {
      let filters = this.props.filters;
      filters = filters.map(filter => {
        return (
          <button
            key={filter.id}
            onClick={this.props.setFilter.bind(this, filter)}
            className={this.props.activeFilter === filter.name ? 'btn-active' : ''}>
            {filter.label || filter.name}
          </button>
        );
      });
  
      return (
        <div className="task-controls">
          {filters}
        </div>
      )
    }
  }
  class ToDoList extends React.Component {
      constructor() {
          super();
          this.state = {
              tasks: []
          }
      }
      componentWillMount() {
          let initial = [
              {
                  id: uniqueId(),
                  content: "Make to do list",
                  completed: true,
                  tag: false
              }
          ];
          if (localStorage && localStorage.getItem('tasks')) {
              this.setState({
                  tasks: JSON.parse(localStorage.getItem('tasks'))
              });
          }
          else {
              this.setState({tasks: initial})
          }
          this.setState({
              activeList: 'all',
              activeTag: 'all',
              initial: initial,
              filters: [
                  {   
                      id: uniqueId(),
                      name: 'all',
                      label: 'All TASK',
                      method: function (item) {
                          return item;
                      }
                  },
                  {   
                    id: uniqueId(),
                    name: 'COMPLETED',
                    label: 'COMPLETED',
                    method: function (item) {
                        return item.completed === true;
                    }
                },
                  {   
                      id: uniqueId(),
                      name: 'PENDING',
                      label: 'PENDING',
                      method: function (item) {
                          return item.completed === false;
                      }
                  }
              ]
          })
          
      }
      handleAddTask(task) {
          let tasks = this.state.tasks;
          tasks.unshift(task);
          this.setState({tasks: tasks});
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }
  
      handleRemoveTask(id) {
          let tasks = this.state.tasks;
          let target = tasks.findIndex(index => index.id === id);
          tasks.splice(target, 1);
          this.setState({tasks: tasks});
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }
  
      handleCheckTask(id) {
          let tasks = this.state.tasks;
          let target = tasks.findIndex(index => index.id === id);
          tasks[target].completed = tasks[target].completed === true ? false : true;
          this.setState({tasks: tasks});
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      setFilter(filter) {
          let activeFilter = filter.name;
          this.setState({activeFilter: activeFilter});
      }
      reset() {
          let tasks =  this.state.initial;
          this.setState({tasks: tasks});
          localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      getTotalCompleted=()=> {
          let tasks = this.state.tasks;
          let completed = tasks.filter(item => item.completed === true);
          return completed.length;
      }
  
      getTotalTasks=()=> {
          return this.state.tasks.length;
      }
  
      getActiveList() {
          let filter = this.state.activeFilter;
          let tag = this.state.activeTag;
          let tasks = this.state.tasks;
          for (let i = 0, len = this.state.filters.length; i < len; i++) {
              const element = this.state.filters[i];
              if (filter === element.name) {
                  tasks = tasks.filter(function (item) {
                      return element.method(item);
                  });
              }
          }
          if (tag === 'all') {
              return tasks;
          }
          else {
              return tasks.filter(item => item.tag === tag);
          }
      }
      render() {
          return (
              <div className="app">
                   <TaskControls
                      completed={()=>this.getTotalCompleted(this)}
                      filters={this.state.filters}
                      total={()=>this.getTotalTasks(this)}
                      activeFilter={this.state.activeFilter}
                      setFilter={this.setFilter.bind(this)}
                      />
                  <TaskList 
                      tasks={this.getActiveList.call(this)}
                      removeTask={this.handleRemoveTask.bind(this)}
                      checkTask={this.handleCheckTask.bind(this)}
                      tags={this.state.tags} />
                  <AddTask addTask={this.handleAddTask.bind(this)} />
              </div>
          );
      }
  }
  export default ToDoList;
