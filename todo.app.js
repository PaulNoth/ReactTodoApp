var TaskBox = React.createClass({
  onTaskChange: function(tasks) {
    window.localStorage.setItem("data", JSON.stringify(tasks));
  },

  getInitialState: function() {
    var tasks = JSON.parse(window.localStorage.getItem("data")) || [];
    return {tasks: tasks, showTasks: 'All', lastId: 0};
  },

  addTask: function(task) {
    var tasks = this.state.tasks;
    tasks.push(task);
    this.setState({tasks: tasks, lastId: task.id});
    this.onTaskChange(tasks);
  },

  markAsDone: function(id) {
    for(var i = 0; i < this.state.tasks.length; i++) {
        if(this.state.tasks[i].id === id) {
            this.state.tasks[i].done = true;
        }
    }
    this.setState({tasks: this.state.tasks});
    this.onTaskChange(this.state.tasks);
  },

  filterTasks: function(filter) {
    this.setState({showTasks: filter});
  },

  deleteCompleted: function() {
      for(var i = 0; i < this.state.tasks.length; i++) {
          if(this.state.tasks[i].done) {
              this.state.tasks[i].deleted = true;
          }
      }
      this.setState({tasks: this.state.tasks});
      this.onTaskChange(this.state.tasks);
  },

  render: function() {
    return (
      <div className="todoList">
        <h1>My TODO list</h1>
        <br/>
        <TaskForm lastId={this.state.lastId} onAddTask={this.addTask}/>
        <br />
        <TaskList deleteCompleted={this.deleteCompleted} filterTasks={this.filterTasks}
                  markAsDone={this.markAsDone} data={this.state.tasks} showTasks={this.state.showTasks}/>
      </div>
    );
  }
});

var TaskList = React.createClass({
  render: function() {
    var showTasks = this.props.showTasks;
    var markAsDone = this.props.markAsDone;

      var filteredTasks = _.filter(this.props.data, "deleted", false);
      if(showTasks === "Open") {
          filteredTasks = _.filter(filteredTasks, "done", false);
      } else if(showTasks === "Done") {
          filteredTasks = _.filter(filteredTasks, "done", true);
      }

      var taskComponents = filteredTasks.map(item => (<Task markAsDone={markAsDone} task={item}/>));

    return (
      <div className="taskList">
        <h2>Need to do:</h2>
        <FilterButton filterTasks={this.props.filterTasks} showTasks={this.props.showTasks} title="All"/>
        <FilterButton filterTasks={this.props.filterTasks} showTasks={this.props.showTasks} title="Open"/>
        <FilterButton filterTasks={this.props.filterTasks} showTasks={this.props.showTasks} title="Done"/>
        <DeleteButton onDelete={this.props.deleteCompleted} tasks={this.props.data} title="Delete completed"/>
        {taskComponents}
      </div>
    );
  }
});

var TaskForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var taskTitle = React.findDOMNode(this.refs.taskTitle).value.trim();
    if(!taskTitle) {
      return;
    }
      this.props.onAddTask({id: this.props.lastId + 1, name: taskTitle, done: false, deleted: false});
    React.findDOMNode(this.refs.taskTitle).value = '';
  },

  render: function() {
    return (
      <div className="todoList">
        <form className="taskForm" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="What I need to do..." ref="taskTitle"/>
          <input type="submit" value="Add Task"></input>
        </form>
      </div>
    );
  }
});


var Task = React.createClass({
  finishTask: function() {
    //this.props.task.done = true;
    this.props.markAsDone(this.props.task.id);
  },

  render: function() {
    return (
      <div>
        <input type="checkbox" disabled={this.props.task.done} checked={this.props.task.done}
               onClick={this.finishTask}>{this.props.task.name}</input>
        <br/>
      </div>
    )
  }
});

var FilterButton = React.createClass({
  handleButtonClick: function() {
    this.props.filterTasks(this.props.title);
  },

  render: function() {
    return (<button onClick={this.handleButtonClick}>{this.props.title}</button>);
  }
});

var DeleteButton = React.createClass({
  deleteCompleted: function() {
      this.props.onDelete();
  },

  render: function() {
    return (<button onClick={this.deleteCompleted}>{this.props.title}</button>);
  }
});

React.render(
  <TaskBox />,
  document.getElementById('content')
);
