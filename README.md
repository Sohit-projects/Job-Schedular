# Job Scheduling App

A modern web application for managing and scheduling jobs with an intuitive interface. Built with React and deployed on Render for seamless job management and tracking.

## 🚀 Live Demo

[View Live Application](https://job-schedular-2.onrender.com/) - Deployed on Render

## 📋 Features

- **Create Jobs**: Add new jobs with title, description, priority, and due dates
- **Job Management**: View, and delete existing jobs
- **Priority System**: Organize jobs by priority levels (High, Medium, Low)
- **Status Tracking**: Track job progress with status updates (Pending, In Progress, Completed)
- **Due Date Management**: Set and monitor job deadlines
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Instant updates when jobs are modified
- **Search & Filter**: Find jobs quickly with search and filter options

## 🛠️ Technologies Used

- **Frontend:** React.js, HTML5, CSS3, JavaScript (ES6+)
- **Styling:** CSS Modules / Styled Components
- **State Management:** React Hooks (useState, useEffect)
- **Icons:** React Icons / Font Awesome
- **Deployment:** Render
- **Build Tool:** Create React App
- **Version Control:** Git & GitHub

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (version 14.0 or higher)
- npm or yarn package manager
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/job-scheduling-app.git
```

2. Navigate to the project directory
```bash
cd job-scheduling-app
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm start
```

5. Open your browser and visit `http://localhost:3000`

## 📁 Project Structure

```
job-schedular-app/
├── README.md
├── package-lock.json
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
└── frontend/
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.cjs
    ├── tailwind.config.js
    ├── vite.config.js
    │
    ├── public/
    │   └── vite.svg
    │
    └── src/
        ├── App.jsx
        ├── main.jsx
        │
        ├── assets/
        │   └── react.svg
        │
        ├── Components/
        │   ├── auth/
        │   │   ├── LoginForm.jsx
        │   │   └── RegisterForm.jsx
        │   │
        │   ├── common/
        │   │   ├── Button.jsx
        │   │   └── LoadingSpinner.jsx
        │   │
        │   ├── jobs/
        │   │   ├── JobForm.jsx
        │   │   ├── JobItem.jsx
        │   │   └── JobList.jsx
        │   │
        │   ├── layout/
        │   │   ├── Header.jsx
        │   │   └── MessageAlert.jsx
        │   │
        │   └── schedule/
        │       ├── EarningsSummary.jsx
        │       ├── ScheduleSection.jsx
        │       └── ScheduledJob.jsx
        │
        ├── context/
        │   └── AuthContext.jsx
        │
        ├── hooks/
        │   ├── useAuth.js
        │   ├── useJobs.js
        │   └── useMessage.js
        │
        ├── services/
        │   └── api.js
        │
        ├── styles/
        │   ├── components/
        │   ├── global.css
        │   ├── index.css
        │   └── utilities.css
        │
        └── utils/
```


## 🚀 Deployment on Render

This application is deployed on [Render](https://render.com/) with automatic deployments from the main branch.

### Deploy Your Own Version

1. Fork this repository
2. Create a new account on [Render](https://render.com/)
3. Connect your GitHub account to Render
4. Create a new "Static Site" service
5. Connect your forked repository
6. Set build command: `npm run build`
7. Set publish directory: `build`
8. Deploy!

The app will automatically redeploy when you push changes to your main branch.

## 💡 Usage

1. **Adding a Job**: Click the "Add New Job" button and fill in the job details
2. **Editing a Job**: Click the edit icon on any job card to modify its details
3. **Updating Status**: Use the status dropdown to change job progress
4. **Deleting Jobs**: Click the delete icon to remove completed or cancelled jobs


## 📸 Screenshots

![Job Dashboard](path/to/dashboard-screenshot.png)
*Main dashboard showing job overview*

![Add Job Form](path/to/add-job-screenshot.png)
*Create new job interface*

![Job Details](path/to/job-details-screenshot.png)
*Individual job card with details*

## 🔧 Future Enhancements

- [ ] User authentication and profiles
- [ ] Email notifications for due dates
- [ ] Calendar integration
- [ ] Team collaboration features
- [ ] Job categories and tags
- [ ] Data export functionality
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sohit**
- GitHub: [@Sohit-projects](https://github.com/Sohit-projects)


## 🙏 Acknowledgments

- Thanks to the React community for excellent documentation
- Icons provided by React Icons
- Inspiration from modern task management applications
- Render for reliable hosting platform

---

⭐ Star this repository if you found it helpful!
