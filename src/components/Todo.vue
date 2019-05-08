<style lang="less">

</style>

<template>
  <div>
    <section class="todoapp" v-cloak>
			<header class="header">
				<h1>todos</h1>
				<input class="new-todo" autofocus autocomplete="off" placeholder="What needs to be done?" v-model="newTodo" @keyup.enter="addTodo">
			</header>
			<section class="main" v-show="todos.length">
				<input id="toggle-all" class="toggle-all" type="checkbox" v-model="allDone">
				<label for="toggle-all">Mark all as complete</label>
				<ul class="todo-list">
					<li class="todo" v-for="todo in filteredTodos" :key="todo.id" :class="{completed: todo.completed, editing: todo == editedTodo}" @click="setStatus(todo)">
						<div class="view">
							<input class="toggle" type="checkbox" v-model="todo.completed">
							<label @dblclick="editTodo(todo)">{{todo.title}}</label>
							<button class="destroy" @click.stop="removeTodo(todo)"></button>
						</div>
						<input class="edit" type="text" v-model="todo.title" v-todo-focus="todo == editedTodo" @blur="doneEdit(todo)" @keyup.enter="doneEdit(todo)" @keyup.esc="cancelEdit(todo)">
					</li>
				</ul>
			</section>
			<footer class="footer" v-show="todos.length">
				<span class="todo-count">
					<strong v-text="remaining"></strong> {{pluralize('item', remaining)}} left
				</span>
				<ul class="filters">
					<li @click="visibility = 'all'"><a href="javascript:void(0)" :class="{selected: visibility == 'all'}">All</a></li>
					<li @click="visibility = 'active'"><a href="javascript:void(0)" :class="{selected: visibility == 'active'}">Active</a></li>
					<li @click="visibility = 'completed'"><a href="javascript:void(0)" :class="{selected: visibility == 'completed'}">Completed</a></li>
				</ul>
				<button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
					Clear completed
				</button>
			</footer>
		</section>
		<footer class="info">
			<p>Double-click to edit a todo</p>
			<p>Written by <a href="http://evanyou.me">Evan You</a></p>
			<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
		</footer>
  </div>
</template>

<script>

var filters = {
	all: function (todos) {
		return todos;
	},
	active: function (todos) {
		return todos.filter(function (todo) {
			return !todo.completed;
		});
	},
	completed: function (todos) {
		return todos.filter(function (todo) {
			return todo.completed;
		});
	}
};

var STORAGE_KEY = 'todos-vuejs';
var todoStorage = {
	fetch: function () {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
	},
	save: function (todos) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
	}
};

export default {
	directives: {
		'todo-focus': function (el, binding) {
			if (binding.value) {
				el.focus();
			}
		}
	},
  data() {
    return {
			todos: [],
			newTodo: '',
			editedTodo: null,
			visibility: 'all'
    }
	},
	computed: {
		filteredTodos: function () {
			return filters[this.visibility](this.todos);
		},
		remaining: function () {
			return filters.active(this.todos).length;
		},
		allDone: {
			get: function () {
				return this.remaining === 0;
			},
			set: function (b) {
				this.setAllDone(b);
			}
		}
	},
	mounted() {
		this.listTodo();
	},
  methods: {
		listTodo: function() {
			R.todo.getList().then(resp => {
				if(resp.ok) {
					this.todos = resp.body;
				}
			})
		},
    pluralize: function (word, count) {
			return word + (count === 1 ? '' : 's');
		},

		addTodo: function () {
			var value = this.newTodo && this.newTodo.trim();
			if (!value) {
				return;
			}
			this.todos.push({ title: value });

			R.todo.add({title: value}).then(resp => {
        if(resp.ok) {
          this.todos = resp.body;
          this.newTodo = '';
        }
      })
		},

		setStatus(todo) {
			R.todo.setStatus({id: todo.id, completed: !todo.completed}).then(resp => {
				if(resp.ok) {
					this.todos = resp.body;
				}
			})
		},

		removeTodo: function (todo) {
			R.todo.remove(todo.id).then(resp => {
        if(resp.ok) {
          this.todos = resp.body;
        }
      })
		},

		editTodo: function (todo) {
			this.beforeEditCache = todo.title;
			this.editedTodo = todo;
		},

		doneEdit: function (todo) {
			if (!this.editedTodo) {
				return;
			}
			this.editedTodo = null;
			todo.title = todo.title.trim();
			if (!todo.title) {
				this.removeTodo(todo);
			}
		},

		cancelEdit: function (todo) {
			this.editedTodo = null;
			todo.title = this.beforeEditCache;
		},

		removeCompleted: function () {
			R.todo.removeCompleted().then(resp => {
				if(resp.ok) {
					this.todos = resp.body;
				}
			})
		},

		setAllDone(b) {
			R.todo.allDone({flag: b}).then(resp => {
				if(resp.ok) {
					this.todos = resp.body;
				}
			})
		}
  }
}
</script>


