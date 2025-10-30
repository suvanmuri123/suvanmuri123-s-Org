import React, { useState, useEffect, useCallback, useRef } from 'react';
import anime from 'animejs';
import { Task, Mood, AnalyticsData, View, MoodValue } from './types';
import { parseTaskFromText } from './services/geminiService';
import TodoList from './components/TodoList';
import Analytics from './components/Analytics';
import FocusTimer from './components/FocusTimer';
import Notes from './components/Notes';
import Loader from './components/Loader';
import Login from './components/Login';
import SakuraBackground from './components/SakuraBackground';
import { CalendarIcon, ChartBarIcon, ClockIcon, DocumentTextIcon, KaryaSuchiLogo, LogoutIcon } from './components/Icons';
import { parseISO, format } from 'date-fns';

const FOCUS_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('karyaSuchi_tasks');
    return savedTasks ? JSON.parse(savedTasks).map((t: Task) => ({...t, dueDate: t.dueDate ? parseISO(t.dueDate) : null})) : [];
  });
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>(() => {
    const savedData = localStorage.getItem('karyaSuchi_analyticsData');
    return savedData ? JSON.parse(savedData) : [];
  });
  
  const [moods, setMoods] = useState<Mood[]>(() => {
      const savedMoods = localStorage.getItem('karyaSuchi_moods');
      return savedMoods ? JSON.parse(savedMoods) : [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('karyaSuchiSession') === 'true');
  const [activeView, setActiveView] = useState<View>(View.Tasks);
  
  // Timer State Lifted Up
  const [timeRemaining, setTimeRemaining] = useState(FOCUS_DURATION);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [mochiCount, setMochiCount] = useState(1);
  const timerRef = useRef<number | null>(null);
  const mochiIntervalRef = useRef<number | null>(null);

  const mainContentRef = useRef<HTMLElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5500);

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (isAuthenticated) {
        localStorage.setItem('karyaSuchi_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
        localStorage.setItem('karyaSuchi_analyticsData', JSON.stringify(analyticsData));
    }
  }, [analyticsData, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
        localStorage.setItem('karyaSuchi_moods', JSON.stringify(moods));
    }
  }, [moods, isAuthenticated]);

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    if (appContainerRef.current) {
        anime({
            targets: appContainerRef.current,
            opacity: [0, 1],
            duration: 800,
            easing: 'easeInOutQuad'
        });
    }

    if (mainContentRef.current) {
      anime({
        targets: mainContentRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutCubic',
      });
    }
  }, [activeView, isLoading, isAuthenticated]);
  
  // Timer Logic moved to App component
   useEffect(() => {
        if (isTimerActive && timeRemaining > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
            
            mochiIntervalRef.current = window.setInterval(() => {
                setMochiCount(prevCount => prevCount + 1);
            }, 10000);

        } else if (timeRemaining === 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mochiIntervalRef.current) clearInterval(mochiIntervalRef.current);
            setIsTimerActive(false);

            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(isBreak ? "Break's over! Get back to it!" : "Time for a break! You've earned it.");
            }
            
            if (isBreak) {
                setIsBreak(false);
                setTimeRemaining(FOCUS_DURATION);
            } else {
                setIsBreak(true);
                setTimeRemaining(BREAK_DURATION);
            }
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mochiIntervalRef.current) clearInterval(mochiIntervalRef.current);
        };
    }, [isTimerActive, timeRemaining, isBreak]);
  
  const toggleTimer = () => {
      setIsTimerActive(!isTimerActive);
  };

  const resetTimer = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mochiIntervalRef.current) clearInterval(mochiIntervalRef.current);
      setIsTimerActive(false);
      setIsBreak(false);
      setTimeRemaining(FOCUS_DURATION);
      setMochiCount(1);
  };
  
  const updateAnalytics = useCallback(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const completedToday = tasks.filter(t => t.completed && t.completionDate === todayStr).length;

    setAnalyticsData(prevData => {
      const todayDataIndex = prevData.findIndex(d => d.date === todayStr);
      if (todayDataIndex > -1) {
        const newData = [...prevData];
        newData[todayDataIndex].completed = completedToday;
        return newData;
      } else {
        return [...prevData, { date: todayStr, completed: completedToday }];
      }
    });
  }, [tasks]);

  const addTask = async (text: string): Promise<Task> => {
    const parsedTask = await parseTaskFromText(text);
    const newTask: Task = {
      id: Date.now(),
      text: parsedTask.title,
      completed: false,
      dueDate: parsedTask.dueDate ? parseISO(parsedTask.dueDate) : null,
      completionDate: null,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  };
  
  const toggleTask = (id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed, completionDate: !task.completed ? format(new Date(), 'yyyy-MM-dd') : null } : task
      )
    );
  };
  
  useEffect(() => {
    updateAnalytics();
  }, [tasks, updateAnalytics]);

  const deleteTask = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };
  
  const addMood = (mood: MoodValue) => {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const newMood: Mood = { date: todayStr, mood };
      setMoods(prevMoods => {
          const filteredMoods = prevMoods.filter(m => m.date !== todayStr);
          return [...filteredMoods, newMood];
      });
  };
  
  const handleLogin = () => {
    localStorage.setItem('karyaSuchiSession', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('karyaSuchiSession');
    setIsAuthenticated(false);
  };

  const NavItem = ({ view, icon, label }: { view: View; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start w-full p-3 my-1 rounded-lg transition-colors duration-200 ${
        activeView === view ? 'bg-highlight text-white' : 'hover:bg-accent'
      }`}
    >
      {icon}
      <span className="mt-1 sm:mt-0 sm:ml-3 text-xs sm:text-sm font-medium">{label}</span>
    </button>
  );

  const renderView = () => {
    switch (activeView) {
      case View.Tasks:
        return <TodoList tasks={tasks} onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} />;
      case View.Analytics:
        return <Analytics data={analyticsData} moods={moods}/>;
      case View.FocusTimer:
        return <FocusTimer 
                    timeRemaining={timeRemaining}
                    isActive={isTimerActive}
                    isBreak={isBreak}
                    mochiCount={mochiCount}
                    toggleTimer={toggleTimer}
                    resetTimer={resetTimer}
                    totalDuration={isBreak ? BREAK_DURATION : FOCUS_DURATION}
                />;
      case View.Notes:
        return <Notes onAddMood={addMood} lastMood={moods.find(m => m.date === format(new Date(), 'yyyy-MM-dd'))}/>;
      default:
        return <TodoList tasks={tasks} onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} />;
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  
  if (!isAuthenticated) {
      return <Login onLoginSuccess={handleLogin} />;
  }

  return (
    <>
      <SakuraBackground />
      <div ref={appContainerRef} className="relative z-10 flex flex-col sm:flex-row h-screen font-sans bg-primary/90 backdrop-blur-sm opacity-0">
        <nav className="w-full sm:w-20 lg:w-56 bg-secondary/80 p-2 sm:p-4 flex sm:flex-col justify-around sm:justify-start order-last sm:order-first shrink-0 shadow-lg">
          <div className="flex-grow">
            <div className="hidden sm:flex flex-col items-center mb-8">
                <KaryaSuchiLogo className="w-10 h-10 text-highlight shrink-0"/>
                <h1 className="text-2xl font-bold text-text-primary mt-2 hidden lg:block">KaryaSuchi</h1>
                <p className="text-xs text-text-secondary mt-1 hidden lg:block text-center">Tasks made easy, life made clear</p>
            </div>
            <NavItem view={View.Tasks} icon={<CalendarIcon className="w-6 h-6 shrink-0"/>} label="Tasks" />
            <NavItem view={View.Analytics} icon={<ChartBarIcon className="w-6 h-6 shrink-0"/>} label="Analytics" />
            <NavItem view={View.FocusTimer} icon={<ClockIcon className="w-6 h-6 shrink-0"/>} label="Focus Timer" />
            <NavItem view={View.Notes} icon={<DocumentTextIcon className="w-6 h-6 shrink-0"/>} label="Reflection" />
          </div>
          <div className="sm:mt-auto">
             <button
                onClick={handleLogout}
                className="flex flex-col sm:flex-row items-center justify-center sm:justify-start w-full p-3 my-1 rounded-lg transition-colors duration-200 hover:bg-accent"
              >
                <LogoutIcon className="w-6 h-6 shrink-0 text-text-secondary"/>
                <span className="mt-1 sm:mt-0 sm:ml-3 text-xs sm:text-sm font-medium text-text-secondary">Logout</span>
              </button>
          </div>
        </nav>
        <main ref={mainContentRef} className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </>
  );
};

export default App;