import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { useMessage } from './hooks/useMessage';
import { useJobs } from './hooks/useJobs';
import LoginForm from './Components/auth/LoginForm';
import RegisterForm from './Components/auth/RegisterForm';
import Header from './Components/layout/Header';
import MessageAlert from './Components/layout/MessageAlert';
import JobForm from './Components/jobs/JobForm';
import JobList from './Components/jobs/JobList';
import ScheduleSection from './Components/schedule/ScheduleSection';
import './styles/index.css';


function App() {
  const [showRegister, setShowRegister] = useState(false);
  const { user, token, login, logout, setUser } = useAuth();
  const { message, showMessage } = useMessage();
  const { jobs, loading, addJob, deleteJob, toggleJobDone } = useJobs(user, token, showMessage);

  // Show auth forms if not logged in
  if (!user) {
    return (
      <AuthProvider value={{ user, token, login, logout }}>
        {showRegister ? (
          <RegisterForm 
            onLogin={login} 
            onSwitchToLogin={() => setShowRegister(false)} 
          />
        ) : (
          <LoginForm 
            onLogin={login} 
            onSwitchToRegister={() => setShowRegister(true)} 
          />
        )}
      </AuthProvider>
    );
  }

  // Main app for authenticated users
  return (
    <AuthProvider value={{ user, token, login, logout }}>
      <div className="app">
        <Header user={user} onLogout={logout} />
        <MessageAlert message={message} />
        
        <div className="main-content">
          <JobForm onAddJob={addJob} loading={loading} />
          <JobList 
            jobs={jobs}
            onToggleDone={toggleJobDone}
            onDelete={deleteJob}
            loading={loading}
          />
        </div>

        <ScheduleSection 
          jobs={jobs}
          user={user}
          setUser={setUser}
          token={token}
          showMessage={showMessage}
          loading={loading}
        />
      </div>
    </AuthProvider>
  );
}

export default App;