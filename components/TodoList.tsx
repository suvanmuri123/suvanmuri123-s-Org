
import React, { useState, useEffect, useRef } from 'react';
// Fix: cast anime to any to resolve call signature errors due to module resolution issues.
import anime from 'animejs';
import { Task } from '../types';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import { PlusIcon, TrashIcon, SparklesIcon } from './Icons';

interface TodoListProps {
  tasks: Task[];
  onAddTask: (text: string) => Promise<Task>;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const AiTaskInput: React.FC<{ onAddTask: (text: string) => Promise<Task> }> = ({ onAddTask }) => {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            await onAddTask(inputValue);
            setInputValue('');
        } catch (err) {
            setError('Failed to add task. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex items-center mb-6">
            <SparklesIcon className="absolute left-4 w-5 h-5 text-highlight"/>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a task with AI... (e.g., 'call mom tomorrow at 5pm')"
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 bg-secondary border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight text-text-primary shadow-inner"
            />
            <button type="submit" disabled={isLoading} className="absolute right-2 p-2 bg-highlight rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity">
                {isLoading ? <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div> : <PlusIcon className="w-5 h-5 text-white"/>}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </form>
    );
};


const TaskItem: React.FC<{ task: Task; onToggleTask: (id: number) => void; onDeleteTask: (id: number) => void; }> = ({ task, onToggleTask, onDeleteTask }) => {
    const itemRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        if (itemRef.current) {
            // Fix: cast anime to any to resolve call signature errors.
            (anime as any)({
                targets: itemRef.current,
                opacity: [0, 1],
                translateY: [-20, 0],
                duration: 400,
                easing: 'easeOutQuad',
            });
        }
    }, []);

    const handleDelete = () => {
        if (itemRef.current) {
            // Fix: cast anime to any to resolve call signature errors.
            (anime as any)({
                targets: itemRef.current,
                opacity: 0,
                translateX: [0, 50],
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0,
                duration: 300,
                easing: 'easeInQuad',
                complete: () => {
                    onDeleteTask(task.id);
                }
            });
        }
    };
    
    const handleToggle = () => {
        if(itemRef.current) {
            // Fix: cast anime to any to resolve call signature errors.
            (anime as any)({
                targets: itemRef.current,
                scale: [1, 1.02, 1],
                duration: 300,
                easing: 'easeInOutSine'
            });
        }
        onToggleTask(task.id);
    }

    const dueDateText = () => {
        if (!task.dueDate) return null;
        const dueDate = new Date(task.dueDate);
        if (isToday(dueDate)) return 'Today';
        if (isPast(dueDate) && !task.completed) return <span className="text-rose-500 font-semibold">{format(dueDate, 'MMM d')}</span>;
        const daysDiff = differenceInDays(dueDate, new Date());
        if(daysDiff === 1) return 'Tomorrow';
        return format(dueDate, 'MMM d');
    };

    return (
        <li ref={itemRef} className={`flex items-center p-4 my-2 rounded-lg transition-all duration-300 shadow ${task.completed ? 'bg-accent/50 opacity-60' : 'bg-secondary hover:shadow-md'}`}>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggle}
                className="form-checkbox h-5 w-5 text-highlight bg-accent border-gray-300 rounded focus:ring-highlight shrink-0"
            />
            <span className={`ml-4 flex-grow ${task.completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                {task.text}
            </span>
            {dueDateText() && (
                 <span className="text-sm text-text-secondary mr-4 px-2 py-1 bg-accent/60 rounded-md">{dueDateText()}</span>
            )}
            <button onClick={handleDelete} className="text-text-secondary hover:text-rose-500 transition-colors">
                <TrashIcon className="w-5 h-5"/>
            </button>
        </li>
    );
};

const TodoList: React.FC<TodoListProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
    const incompleteTasks = tasks.filter(t => !t.completed).sort((a,b) => (a.dueDate ? a.dueDate.getTime() : Infinity) - (b.dueDate ? b.dueDate.getTime() : Infinity));
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-text-primary">My Tasks</h2>
            <AiTaskInput onAddTask={onAddTask} />
            <h3 className="text-xl font-semibold mb-2 mt-4 text-text-secondary">To Do</h3>
            <ul>
                {incompleteTasks.length > 0 ? incompleteTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} />
                )) : <p className="text-text-secondary p-4 text-center">No pending tasks. Great job!</p>}
            </ul>
            <h3 className="text-xl font-semibold mb-2 mt-8 text-text-secondary">Completed</h3>
            <ul>
                {completedTasks.length > 0 ? completedTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} onDeleteTask={onDeleteTask} />
                )) : <p className="text-text-secondary p-4 text-center">No tasks completed yet.</p>}
            </ul>
        </div>
    );
};

export default TodoList;
