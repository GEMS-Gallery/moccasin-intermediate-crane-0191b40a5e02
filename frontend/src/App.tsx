import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { backend } from 'declarations/backend';
import { Package, Code, Globe } from '@mui/icons-material';
import ErrorMessage from './ErrorMessage';

type Task = {
  id: bigint;
  name: string;
  lead: string;
  dueDate: bigint;
  project: string;
  category: string;
  completed: boolean | null;
};

type CategoryTasks = {
  [key: string]: Task[];
};

const CategoryIcons: { [key: string]: React.ReactElement } = {
  GEMS: <Package />,
  'Web IDE': <Code />,
  OISY: <Globe />,
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<CategoryTasks>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await backend.getTasks();
      const tasksObject: CategoryTasks = {};
      result.forEach(([category, categoryTasks]) => {
        tasksObject[category] = categoryTasks.map(task => ({
          ...task,
          id: Number(task.id),
          dueDate: Number(task.dueDate),
        }));
      });
      setTasks(tasksObject);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      await backend.addTask(
        data.name,
        data.lead,
        BigInt(new Date(data.dueDate).getTime()),
        data.project,
        data.category
      );
      reset();
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const handleRemoveTask = async (taskId: number) => {
    setError(null);
    try {
      await backend.removeTask(BigInt(taskId));
      fetchTasks();
    } catch (error) {
      console.error('Error removing task:', error);
      setError('Failed to remove task. Please try again.');
    }
  };

  const handleMarkComplete = async (taskId: number) => {
    setError(null);
    try {
      await backend.markTaskComplete(BigInt(taskId));
      fetchTasks();
    } catch (error) {
      console.error('Error marking task as complete:', error);
      setError('Failed to mark task as complete. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Task List</h1>
      
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
        <input {...register('name')} placeholder="Task name" className="w-full p-2 border rounded" required />
        <input {...register('lead')} placeholder="Lead" className="w-full p-2 border rounded" required />
        <input {...register('dueDate')} type="date" className="w-full p-2 border rounded" required />
        <input {...register('project')} placeholder="Project" className="w-full p-2 border rounded" required />
        <select {...register('category')} className="w-full p-2 border rounded" required>
          <option value="">Select category</option>
          <option value="GEMS">GEMS</option>
          <option value="Web IDE">Web IDE</option>
          <option value="OISY">OISY</option>
        </select>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Task</button>
      </form>

      {loading ? (
        <div className="text-center">Loading tasks...</div>
      ) : (
        Object.entries(tasks).map(([category, categoryTasks]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              {CategoryIcons[category]}
              <span className="ml-2">{category}</span>
            </h2>
            <ul className="space-y-4">
              {categoryTasks.map((task) => (
                <li key={Number(task.id)} className="border p-4 rounded shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{task.name}</h3>
                      <p className="text-sm text-gray-600">Lead: {task.lead}</p>
                      <p className="text-sm text-gray-600">Due: {new Date(Number(task.dueDate)).toLocaleDateString()}</p>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">
                        {task.project}
                      </span>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleMarkComplete(Number(task.id))}
                        className={`px-2 py-1 rounded ${task.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                      >
                        {task.completed ? 'Completed' : 'Mark Complete'}
                      </button>
                      <button
                        onClick={() => handleRemoveTask(Number(task.id))}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
