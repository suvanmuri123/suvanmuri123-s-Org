

import React, { useState, useRef, useEffect } from 'react';
// Fix: cast anime to any to resolve call signature errors due to module resolution issues.
import anime from 'animejs';
import { KaryaSuchiLogo } from './Icons.tsx';
import SakuraBackground from './SakuraBackground.tsx';

interface LoginProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot';

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any)({
            targets: containerRef.current,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1200,
            easing: 'easeOutExpo'
        });
    }
  }, []);

  const switchMode = (newMode: AuthMode) => {
    if (formContainerRef.current) {
        // Fix: cast anime to any to resolve call signature errors.
        (anime as any)({
            targets: formContainerRef.current,
            opacity: 0,
            translateY: -10,
            duration: 250,
            easing: 'easeInQuad',
            complete: () => {
                setMode(newMode);
                setError('');
                setSuccess('');
                setPassword('');
                setConfirmPassword('');
                // Fix: cast anime to any to resolve call signature errors.
                (anime as any)({
                    targets: formContainerRef.current,
                    opacity: [0, 1],
                    translateY: [10, 0],
                    duration: 250,
                    easing: 'easeOutQuad',
                });
            }
        });
    }
  };

  const handleLogin = () => {
    const savedUser = localStorage.getItem('karyaSuchiUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.email === email && user.password === password) {
            // Fix: cast anime to any to resolve call signature errors.
            (anime as any)({
                targets: containerRef.current,
                opacity: 0,
                translateY: -20,
                duration: 500,
                easing: 'easeInExpo',
                complete: onLoginSuccess
              });
        } else {
            setError('Invalid email or password.');
        }
    } else {
        setError('No account found. Please sign up.');
    }
  };

  const handleSignup = () => {
    if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
    }
    if (localStorage.getItem('karyaSuchiUser')) {
        setError('An account already exists. Only one account is supported in this demo.');
        return;
    }
    const newUser = { email, password };
    localStorage.setItem('karyaSuchiUser', JSON.stringify(newUser));
    setSuccess('Account created successfully! Please log in.');
    switchMode('login');
  };
  
  const handleForgot = () => {
     const savedUser = localStorage.getItem('karyaSuchiUser');
     if (savedUser && JSON.parse(savedUser).email === email) {
        setSuccess('A password reset link has been sent to your email (simulation).');
        setError('');
     } else {
        setError('No account found with that email address.');
        setSuccess('');
     }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (mode === 'login') handleLogin();
    else if (mode === 'signup') handleSignup();
    else if (mode === 'forgot') handleForgot();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Fix: cast anime to any to resolve call signature errors.
      (anime as any)({ targets: e.target, borderColor: '#DE3163', duration: 300 });
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Fix: cast anime to any to resolve call signature errors.
      (anime as any)({ targets: e.target, borderColor: '#FADADD', duration: 300 });
  };

  const renderFormContent = () => {
    switch (mode) {
        case 'signup':
            return {
                title: 'Create Account',
                subtitle: 'Get started with KaryaSuchi',
                buttonText: 'Sign Up',
                fields: (
                    <>
                        <InputField id="email" type="email" value={email} onChange={setEmail} label="Email Address" onFocus={handleFocus} onBlur={handleBlur} />
                        <InputField id="password" type="password" value={password} onChange={setPassword} label="Password" onFocus={handleFocus} onBlur={handleBlur} />
                        <InputField id="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword} label="Confirm Password" onFocus={handleFocus} onBlur={handleBlur} />
                    </>
                ),
                footer: <p className="text-sm text-center">Already have an account? <button onClick={() => switchMode('login')} className="font-medium text-highlight hover:underline">Log In</button></p>
            };
        case 'forgot':
            return {
                title: 'Reset Password',
                subtitle: 'Enter your email to get a reset link',
                buttonText: 'Send Reset Link',
                fields: <InputField id="email" type="email" value={email} onChange={setEmail} label="Email Address" onFocus={handleFocus} onBlur={handleBlur} />,
                footer: <p className="text-sm text-center">Remembered your password? <button onClick={() => switchMode('login')} className="font-medium text-highlight hover:underline">Log In</button></p>
            };
        case 'login':
        default:
            return {
                title: 'Welcome Back',
                subtitle: 'Log in to continue to KaryaSuchi',
                buttonText: 'Log In',
                fields: (
                     <>
                        <InputField id="email" type="email" value={email} onChange={setEmail} label="Email Address" onFocus={handleFocus} onBlur={handleBlur} />
                        <InputField id="password" type="password" value={password} onChange={setPassword} label="Password" onFocus={handleFocus} onBlur={handleBlur} />
                     </>
                ),
                footer: (
                    <div className="text-sm text-center flex justify-between">
                        <button onClick={() => switchMode('forgot')} className="font-medium text-highlight hover:underline">Forgot?</button>
                        <button onClick={() => switchMode('signup')} className="font-medium text-highlight hover:underline">Sign Up</button>
                    </div>
                )
            };
    }
  };
  
  const { title, subtitle, buttonText, fields, footer } = renderFormContent();

  return (
    <>
        <SakuraBackground />
        <div className="relative z-10 flex items-center justify-center h-screen bg-primary/80 backdrop-blur-sm">
            <div ref={containerRef} className="w-full max-w-sm p-8 space-y-6 bg-secondary/80 rounded-2xl shadow-2xl">
                <div className="flex flex-col items-center">
                    <KaryaSuchiLogo className="w-16 h-16 text-highlight" />
                    <h1 className="text-3xl font-bold text-text-primary mt-2">{title}</h1>
                    <p className="text-text-secondary">{subtitle}</p>
                </div>
                <div ref={formContainerRef}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {fields}
                        {error && <p className="text-sm text-rose-500 text-center">{error}</p>}
                        {success && <p className="text-sm text-green-500 text-center">{success}</p>}
                        <button type="submit" className="w-full px-4 py-3 font-bold text-white bg-highlight rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg">
                            {buttonText}
                        </button>
                    </form>
                    <div className="mt-6">
                        {footer}
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

const InputField: React.FC<{id: string, type: string, value: string, onChange: (val: string) => void, label: string, onFocus: (e: React.FocusEvent<HTMLInputElement>) => void, onBlur: (e: React.FocusEvent<HTMLInputElement>) => void}> = 
({id, type, value, onChange, label, onFocus, onBlur}) => (
    <div>
        <label htmlFor={id} className="text-sm font-medium text-text-primary">{label}</label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            required
            className="w-full px-4 py-2 mt-2 bg-secondary border-2 border-accent rounded-lg focus:outline-none text-text-primary shadow-inner"
        />
    </div>
);

export default Login;