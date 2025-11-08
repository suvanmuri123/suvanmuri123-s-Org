

import React, { useState, useEffect, useCallback, useRef } from 'react';
// Fix: cast anime to any to resolve call signature errors due to module resolution issues.
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

const NAV_ITEMS = [
    { view: View.Tasks, icon: CalendarIcon, label: "Tasks" },
    { view: View.Analytics, icon: ChartBarIcon, label: "Analytics" },
    { view: View.FocusTimer, icon: ClockIcon, label: "Focus Timer" },
    { view: View.Notes, icon: DocumentTextIcon, label: "Reflection" }
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('karyaSuchi_tasks');
    // Fix: Changed type of `t` to `any` because `JSON.parse` returns an object with `dueDate` as a string, not a Date object.
    return savedTasks ? JSON.parse(savedTasks).map((t: any) => ({...t, dueDate: t.dueDate ? parseISO(t.dueDate) : null})) : [];
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
  
  const navRef = useRef<HTMLElement>(null);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sliderRef = useRef<HTMLDivElement>(null);


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
  
  const handleViewChange = (view: View) => {
    if (mainContentRef.current) {
      (anime as any)({
        targets: mainContentRef.current,
        opacity: [1, 0],
        translateY: [0, 10],
        duration: 200,
        easing: 'easeInQuad',
        complete: () => {
          setActiveView(view);
          (anime as any)({
            targets: mainContentRef.current,
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 300,
            easing: 'easeOutQuad',
          });
        }
      });
    } else {
        setActiveView(view);
    }
  };
  
  // Animate slider on active view change
  useEffect(() => {
      const activeIndex = NAV_ITEMS.findIndex(item => item.view === activeView);
      const activeNavItem = navItemRefs.current[activeIndex];
      const navElement = navRef.current;

      if (activeNavItem && navElement && sliderRef.current) {
          const isMobile = window.innerWidth < 640;
          if (isMobile) {
              const { offsetLeft, offsetWidth } = activeNavItem;
              sliderRef.current.style.width = `${offsetWidth}px`;
              sliderRef.current.style.height = '100%';
              sliderRef.current.style.top = '0';
              (anime as any).remove(sliderRef.current);
              (anime as any)({
                  targets: sliderRef.current,
                  left: offsetLeft,
                  easing: 'spring(1, 80, 17, 0)',
                  duration: 600
              });
          } else {
              const { offsetTop, offsetHeight } = activeNavItem;
              sliderRef.current.style.height = `${offsetHeight}px`;
              sliderRef.current.style.width = 'calc(100% - 8px)';
              sliderRef.current.style.left = '4px';
              (anime as any).remove(sliderRef.current);
              (anime as any)({
                  targets: sliderRef.current,
                  top: offsetTop,
                  easing: 'spring(1, 80, 17, 0)',
                  duration: 600
              });
          }
      }
  }, [activeView, isAuthenticated]); // Re-run on auth change to position correctly

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    if (appContainerRef.current) {
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any)({
            targets: appContainerRef.current,
            opacity: [0, 1],
            duration: 800,
            easing: 'easeInOutQuad'
        });
    }

    if (mainContentRef.current) {
      // Fix: cast anime to any to resolve call signature errors.
      (anime as any)({
        targets: mainContentRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: 'easeOutCubic',
      });
    }
  }, [isLoading, isAuthenticated]);
  
  // Timer Logic moved to App component
   useEffect(() => {
        if (isTimerActive && timeRemaining > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
            
            mochiIntervalRef.current = window.setInterval(() => {
                setMochiCount(prevCount => prevCount + 1);
            }, 10000);
        } else if (isTimerActive && timeRemaining === 0) {
            // Timer finished
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(isBreak ? 'Break is over!' : 'Focus session complete!', {
                    body: isBreak ? 'Time to get back to work.' : 'Time for a short break.',
                });
            }
            setIsBreak(!isBreak);
            setTimeRemaining(isBreak ? FOCUS_DURATION : BREAK_DURATION);
            setIsTimerActive(false); // Stop the timer automatically
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mochiIntervalRef.current) clearInterval(mochiIntervalRef.current);
        };
    }, [isTimerActive, timeRemaining, isBreak]);

    const resetTimer = useCallback(() => {
        setIsTimerActive(false);
        setIsBreak(false);
        setTimeRemaining(FOCUS_DURATION);
        setMochiCount(1);
    }, []);

    const toggleTimer = useCallback(() => {
        setIsTimerActive(prev => !prev);
    }, []);

    const updateAnalytics = useCallback(() => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        setAnalyticsData(prevData => {
            const todayDataIndex = prevData.findIndex(d => d.date === todayStr);
            const completedToday = tasks.filter(t => t.completed && t.completionDate === todayStr).length;

            if (todayDataIndex > -1) {
                const newData = [...prevData];
                newData[todayDataIndex] = { ...newData[todayDataIndex], completed: completedToday };
                return newData;
            } else {
                return [...prevData, { date: todayStr, completed: completedToday }];
            }
        });
    }, [tasks]);

    const handleAddTask = async (text: string): Promise<Task> => {
        const { title, dueDate } = await parseTaskFromText(text);
        const newTask: Task = {
            id: Date.now(),
            text: title,
            completed: false,
            dueDate: dueDate ? parseISO(dueDate) : null,
            completionDate: null
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
        return newTask;
    };

    const handleToggleTask = (id: number) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed, completionDate: !task.completed ? format(new Date(), 'yyyy-MM-dd') : null } : task
            )
        );
        setTimeout(updateAnalytics, 100); // delay to allow state to update
    };

    const handleDeleteTask = (id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        setTimeout(updateAnalytics, 100);
    };
    
    const handleAddMood = (mood: MoodValue) => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        setMoods(prevMoods => {
            const todayMoodIndex = prevMoods.findIndex(m => m.date === todayStr);
            if (todayMoodIndex > -1) {
                const newMoods = [...prevMoods];
                newMoods[todayMoodIndex] = { ...newMoods[todayMoodIndex], mood };
                return newMoods;
            } else {
                return [...prevMoods, { date: todayStr, mood }];
            }
        });
    };
    
    const handleLoginSuccess = () => {
      localStorage.setItem('karyaSuchiSession', 'true');
      setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('karyaSuchiSession');
        setIsAuthenticated(false);
        setActiveView(View.Tasks); // Reset view
    };

    if (isLoading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    
    const lastMoodToday = moods.find(m => m.date === format(new Date(), 'yyyy-MM-dd'));

    const renderView = () => {
        switch (activeView) {
            case View.Tasks:
                return <TodoList tasks={tasks} onAddTask={handleAddTask} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />;
            case View.Analytics:
                return <Analytics data={analyticsData} moods={moods} />;
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
                return <Notes onAddMood={handleAddMood} lastMood={lastMoodToday} />;
            default:
                return null;
        }
    };

    return (
        <div ref={appContainerRef} className="opacity-0">
            <SakuraBackground />
            <div className="relative z-10 flex flex-col sm:flex-row h-screen max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* --- Sidebar / Top Nav --- */}
                <header className="sm:w-64 shrink-0 mb-4 sm:mb-0 sm:mr-8">
                    <div className="flex sm:flex-col justify-between items-center h-full">
                        <div className="flex items-center space-x-3">
                            <KaryaSuchiLogo className="w-10 h-10 text-highlight" />
                            <h1 className="text-2xl font-bold hidden md:block">KaryaSuchi</h1>
                        </div>

                        {/* --- Navigation --- */}
                        <nav ref={navRef} className="relative bg-secondary/60 backdrop-blur-sm p-1 rounded-lg shadow-inner sm:w-full sm:mt-12">
                             <div ref={sliderRef} className="nav-slider"></div>
                            <div className="flex sm:flex-col gap-1 sm:gap-2 relative z-10">
                                {NAV_ITEMS.map((item, index) => (
                                    <button
                                        key={item.view}
                                        // Fix: The ref callback for a functional component should not return a value. Using a block statement `() => {}` instead of an expression `() => ...` ensures an implicit `undefined` return, satisfying the `(instance: T | null) => void` type.
                                        ref={el => { navItemRefs.current[index] = el; }}
                                        onClick={() => handleViewChange(item.view)}
                                        className={`flex items-center w-full text-left p-3 rounded-md transition-colors duration-200 ${activeView === item.view ? 'text-white' : 'text-text-secondary hover:bg-accent'}`}
                                        aria-current={activeView === item.view ? 'page' : undefined}
                                    >
                                        <item.icon className="w-6 h-6 shrink-0" />
                                        <span className="ml-3 hidden sm:inline">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </nav>

                        <div className="sm:mt-auto">
                           <button onClick={handleLogout} className="flex items-center p-3 rounded-md text-text-secondary hover:bg-accent transition-colors">
                               <LogoutIcon className="w-6 h-6"/>
                               <span className="ml-3 hidden sm:inline">Logout</span>
                           </button>
                        </div>
                    </div>
                </header>

                {/* --- Main Content --- */}
                <main ref={mainContentRef} className="flex-1 bg-secondary/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg overflow-y-auto">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;