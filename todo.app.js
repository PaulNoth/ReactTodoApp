var TaskBox = React.createClass({
  onTaskChange: function(tasks) {
    window.localStorage.setItem("data", JSON.stringify(tasks));
  },

  getInitialState: function() {
    var tasks = JSON.parse(window.localStorage.getItem("data")) || [];
    return {tasks: tasks, showTasks: 'All'};
  },

  addTask: function(task) {
    var tasks = this.state.tasks;
    tasks.push(task);
    this.setState({tasks: tasks});
    this.onTaskChange(tasks);
  },

  markAsDone: function() {
    var tasks = this.state.tasks;
    this.setState({tasks: tasks});
    this.onTaskChange(tasks);
  },

  filterTasks: function(filter) {
    this.setState({showTasks: filter});
  },

  deleteCompleted: function(openedTasks) {
    this.setState({tasks: openedTasks});
    this.onTaskChange(openedTasks);
  },

  render: function() {
    return (
      <div className="todoList">
        <h1>My TODO list</h1>
        <br/>
        <TaskForm onAddTask={this.addTask}/>
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

    var filteredTasks = this.props.data.map(function(task) {
      if(showTasks === "Done" && task.done) {
        return (<Task markAsDone={markAsDone} task={task}/>);
      }
      if(showTasks === "Open" && !task.done) {
        return (<Task markAsDone={markAsDone} task={task}/>);
      }
      if(showTasks === "All") {
        return (<Task markAsDone={markAsDone} task={task}/>);
      }
    });

    return (
      <div className="taskList">
        <h2>Need to do:</h2>
        <FilterButton filterTasks={this.props.filterTasks} showTasks={this.props.showTasks} title="All"/>
        <FilterButton filterTasks={this.props.filterTasks} showTasks={this.props.showTasks} title="Open"/>
        <FilterButton filterTasks={this.props.filterTasks} showTasks={this.props.showTasks} title="Done"/>
        <DeleteButton onDelete={this.props.deleteCompleted} tasks={this.props.data} title="Delete completed"/>
        {filteredTasks}
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
    this.props.onAddTask({name: taskTitle, done: false});
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
    this.props.task.done = true;
    this.props.markAsDone();
  },

  render: function() {
    return (
      <div>
        <input type="checkbox" disabled={this.props.task.done} checked={this.props.task.done} onClick={this.finishTask}>{this.props.task.name}</input>
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
    var openedTasks = [];
    for(var i = 0; i < this.props.tasks.length; i++) {
      if(!this.props.tasks[i].done) {
        openedTasks.push(this.props.tasks[i]);
      }
    }
    this.props.onDelete(openedTasks);
  },

  render: function() {
    return (<button onClick={this.deleteCompleted}>{this.props.title}</button>);
  }
});

React.render(
  <TaskBox />,
  document.getElementById('content')
);
