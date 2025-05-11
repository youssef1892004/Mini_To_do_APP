import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Trash2, Plus, Calendar, Clock } from 'lucide-react';

// Define the Task type
interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

function App() {
  // State for tasks and new task input
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      return JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
    }
    return [];
  });
  
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === '') return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskText('');
  };

  // Toggle task completion status
  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  // Format date to display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-1">Mini To-Do</h1>
          <p className="text-indigo-100 flex items-center">
            <Calendar size={16} className="mr-1" />
            <span>July 2024</span>
          </p>
        </div>
        
        {/* Task Form */}
        <form onSubmit={addTask} className="p-4 border-b border-gray-200 flex">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 transition-colors flex items-center"
          >
            <Plus size={20} />
          </button>
        </form>
        
        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 font-medium text-sm ${
              filter === 'all' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2 font-medium text-sm ${
              filter === 'active' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2 font-medium text-sm ${
              filter === 'completed' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed
          </button>
        </div>
        
        {/* Task List */}
        <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No tasks found</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`p-4 flex items-start hover:bg-gray-50 transition-colors ${
                  task.completed ? 'bg-gray-50' : ''
                }`}
              >
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="mt-1 mr-3 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>
                
                <div className="flex-1">
                  <p className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {task.text}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center mt-1">
                    <Clock size={12} className="mr-1" />
                    {formatDate(task.createdAt)}
                  </p>
                </div>
                
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
          <p>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total</p>
          <p>{tasks.filter(t => t.completed).length} completed</p>
        </div>
      </div>
    </div>
  );
}

export default App;