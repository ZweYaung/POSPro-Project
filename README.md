# Student Management System

A modern point of sale web application built using Laravel, React, and Inertia.js. This project was developed to practice full-stack web development, including transaction processing, inventory management, real-time stock updates, and sales analytics.

---

## Features

### Features
- Transaction processing with shopping cart functionality
- Real-time inventory management and automated stock updates
- Product management (create, update, delete)
- Sales analytics dashboard with Chart.js visualizations
- Interactive dashboard for daily, monthly, and yearly sales tracking
- Role-based access control with server-side validation
- Profile management

---

## Tech Stack

- Frontend: HTML, CSS, JavaScript, React, Inertia.js, Tailwind CSS,
- Backend: Laravel (PHP)
- Database: MySQL
- Authentication: Laravel Auth
- Version Control: Git

## What I learnt
- Implementing transaction processing and shopping cart functionality
- Building real-time inventory management systems
- Creating interactive dashboards with Chart.js visualizations
- Using Inertia.js for seamless React-Laravel integration
- Structuring a full-stack Laravel application
- Managing state with React Hooks
- Handling complex CRUD operations

## Future Improvements
- Implement barcode scanning functionality
- Add email notifications for low stock alerts
- Add export functionality (PDF, Excel)
- Implement API endpoints for mobile app integration
- Add customer loyalty/rewards system
- Integrate with accounting software

---

## Installation

1. Clone the repository
```bash
git clone https://github.com/ZweYaung/POSPro-Project.git
```
2. Move into the project directory
```bash
cd POSPro-Project
```
3. Install PHP dependencies
```bash
composer install
npm install
```
4. Create a .env file
```bash
cp .env.example .env
```
5. Generate the application key
```bash
php artisan key:generate
```

6. Configure the database in the .env file
```bash
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

7. Run database migrations
```bash
php artisan migrate
```

8. Start the development server
```bash
php artisan serve
```


10. Build frontend assets
```bash
npm run dev
```

9. Open your browser and visit <br>
http://127.0.0.1:8000
