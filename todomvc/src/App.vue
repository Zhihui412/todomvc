<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        autofocus
        placeholder="What needs to be done?"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main" v-show="todos.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="remaining === 0"
        @change="toggleAll"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          class="todo"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo === editedTodo }"
        >
          <div class="view">
            <input class="toggle" @click="completed(todo)" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)" >{{ todo.content }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            v-if="todo === editedTodo"
            class="edit"
            type="text"
            v-model="todo.content"
            @vnode-mounted="({ el }) => el.focus()"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.escape="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        <span>{{ remaining === 1 ? "item" : "items" }} left</span>
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }"
            >Active</a
          >
        </li>
        <li>
          <a
            href="#/completed"
            :class="{ selected: visibility === 'completed' }"
            >Completed</a
          >
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted()"
        v-show="todos.length > remaining"
      >
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed),
};

export default {
  // app initial state
  data: () => ({
    todos: [],
    editedTodo: null,
    visibility: "all",
  }),



  mounted() {
    window.addEventListener("hashchange", this.onHashChange);
    this.onHashChange();
    this.axios.get("/retrieve").then((res) => {
      console.log(res);
      this.todos = res.data;
    });
  },

  computed: {
    filteredTodos() {
      return filters[this.visibility](this.todos);
    },
    remaining() {
      return filters.active(this.todos).length;
    },
  },


  methods: {
    toggleAll(e) {
      this.todos.forEach((todo) => (todo.completed = e.target.checked));
    },

    addTodo(e) {
      const value = e.target.value.trim();
      if (!value) {
        return;
      }
      this.axios
        .post("/insert", {
          content: value,
          completed: 0,
        })
        .then((res) => {
          console.log(res);
        });
      this.todos.push({
        content: value,
        completed: 0
      })
      e.target.value = "";
    },

    removeTodo(todo) {
      this.axios
        .post("/delete", {
          id: todo.id,
        })
        .then((res) => {
          console.log(res);
        });
 
      this.todos.splice(this.todos.indexOf(todo), 1);
    },

    completed(todo) {
      this.axios.post("/update",{
        id: todo.id,
        completed: todo.completed
      })
      .then((res) => {
        console.log(res);
      })
    },
    
    editTodo(todo) {
      this.beforeEditCache = todo.content;
      this.editedTodo = todo;
    },

    doneEdit(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.content = todo.content.trim();
      this.axios.post('/edit',{
        id: todo.id,
        content: todo.content,
        completed: todo.completed
      })
      .then((res) => {
        console.log(res);
      })

      if (!todo.content) {
        this.removeTodo(todo);
      }
    },

    cancelEdit(todo) {
      this.editedTodo = null;
      todo.content = this.beforeEditCache;
    },

    removeCompleted() {
      this.todos = filters.active(this.todos);
      this.axios.post('/deleteCompleted')
      .thrn((res) => {
        console.log(res);
      })      
    },

    onHashChange() {
      var visibility = window.location.hash.replace(/#\/?/, "");
      if (filters[visibility]) {
        this.visibility = visibility;
      } else {
        window.location.hash = "";
        this.visibility = "all";
      }
    },
  },
};
</script>



<style>
@import "https://unpkg.com/todomvc-app-css@2.4.1/index.css";
</style>