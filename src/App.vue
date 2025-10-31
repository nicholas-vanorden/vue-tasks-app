<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios';
  import TaskForm from './components/TaskForm.vue';
  import TaskList from './components/TaskList.vue'
  import type { Task, TaskFilter } from './types'
  import FilterButton from './components/FilterButton.vue';

  const tasksAppKey = 'vue-tasks-app';

  const message = ref("Tasks App");
  const tasks = ref<Task[]>([]);
  const filter = ref<TaskFilter>("all");
  const error = ref<string | null>(null);

  const totalDone = computed(() => tasks.value.reduce((total, task) => task.done ? total + 1 : total, 0));

  const filteredTasks = computed(() => {
    switch(filter.value) {
      case "all":
        return tasks.value;
      case "todo":
        return tasks.value.filter(t => !t.done);
      case "done":
        return tasks.value.filter(t => t.done);
      default:
        return tasks.value;
    }
  });

  onMounted(async () => {
    try {
      const response = await axios.get<Task[]>(
        '/tasks?appKey=vue-tasks-app'
      );
      tasks.value = response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.message;
      } else {
        error.value = 'An unexpected error occurred.';
      }
      console.error('Error fetching tasks:', err);
    }
  });

  async function addTask(newTask: string) {
    const task: Task = {
      id: '',
      title: newTask,
      done: false,
      appKey: tasksAppKey
    };

    try {
      const response = await axios.post<Task>('/tasks', task);
      const addedTask = response.data;
      tasks.value.push(addedTask);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  }

  function toggleDone(id: string) {
    const task = tasks.value.find(t => t.id === id);
    if (task) {
      task.done = !task.done;
      try {
        axios.put(`/tasks/${id}`, task);
      } catch (err) {
        task.done = !task.done;
        console.error('Error updating task:', err);
      }
    }
  }

  function removeTask(id: string) {
    const index = tasks.value.findIndex(t => t.id === id);
    if (index !== -1) {
      try {
        axios.delete(`/tasks/${id}`);
        tasks.value.splice(index, 1);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  }

  function setFilter(value: TaskFilter) {
    filter.value = value;
  }
</script>

<template>
  <main>
    <h1>{{ message }}</h1>
    <TaskForm @add-task="addTask" />
    <h3 v-if="!tasks.length">Add a task to get started.</h3>
    <h3 v-else>{{ totalDone }} / {{ tasks.length }} tasks completed.</h3>
    <div v-if="tasks.length" class="button-container">
      <FilterButton :currentFilter="filter" filter="all" @set-filter="setFilter" />
      <FilterButton :currentFilter="filter" filter="todo" @set-filter="setFilter" />
      <FilterButton :currentFilter="filter" filter="done" @set-filter="setFilter" />
    </div>
    <h4 v-if="error">Error: {{ error }}</h4>
    <TaskList :tasks="filteredTasks" @toggle-done="toggleDone" @remove-task="removeTask" />
  </main>
</template>

<style>
main {
  max-width: 800px;
  margin: 1rem auto;
}

.button-container {
  display: flex;
  justify-content: end;
  gap: 0.5rem;
}
</style>