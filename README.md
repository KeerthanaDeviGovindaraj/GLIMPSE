Glimpse AI - Sports Commentary Platform

Team Members

Rushitaben P. Vachhani - @rushita-vachhani
Gayatri - @sawantgayatri19
Keerthana - @KeerthanaDeviGovindaraj
Purva - @bpurva05
Project Overview Glimpse AI is an innovative sports commentary platform that leverages artificial intelligence to generate commentary for multiple sports in various languages. The platform targets streaming platforms, broadcasters, and sports applications looking to enhance their viewing experience with instant, accurate AI-powered analysis.

Purpose

Provide AI-powered sports commentary for games
Support multiple languages (English, Spanish, and more)
Deliver advanced analytics and insights for sports fans
Offer seamless user authentication and profile management
Features

User Authentication: Secure login/signup with @northeastern.edu email validation
Responsive Design: Fully responsive across desktop, tablet, and mobile devices
AI-Powered Analysis: Advanced machine learning for instant sports insights
Multi-Sport Support: Coverage for Baseball, Football, and Soccer
Commentary Generation: AI-powered commentary for sports events
Interactive UI: Dynamic carousel, accordion FAQ, and toast notifications
Bootstrap Components Used

Login Page (index.html)

Form - .needs-validation for client-side validation
Input Groups - .input-group with icons (@)
Form Controls - .form-control for text inputs
Buttons - .btn-primary for submit actions
Invalid Feedback - .invalid-feedback for error messages
Form Labels- .form-label for accessibility
Grid System - .row, .col-* for layout
Landing Page (landing.html) 8. Navbar - .navbar-expand-lg with collapse functionality 9. Navbar Toggler - .navbar-toggler for mobile menu 10. Cards - .card for stat displays 11. Badges - .badge for sports categories 12. Tooltips - data-bs-toggle="tooltip" for additional info 13. Carousel - .carousel for feature showcase 14. Carousel Indicators - Navigation dots 15. Carousel Controls - Previous/Next buttons 16. Accordion - .accordion for FAQ section 17. Toast - .toast for success notifications 18. List Group - .list-group for contact information

Total: 18 Bootstrap Components

File Structure

glimpse-ai/
├── index.html           # Login page (Keertha)
├── signup.html          # Registration page (referenced in auth.js)
├── landing.html         # Main landing page (Purva)
├── styles.css           # Login/signup page styles (Gayatri)
├── landing_style.css    # Landing page styles (Rushita)
├── auth.js              # Authentication logic & validation (Gayatri)
├── landing.js           # Landing page interactions (Rushita)
├── assets/              # Images for carousel
│   ├── AI_Interpretation.png
│   ├── Multi_Language_Support.png
│   └── Advanced_Analytics.png
└── README.md            # Project documentation
Testing Credentials Since this uses localStorage for demo purposes:

First, register a new account on signup.html
Use yourname@northeastern.edu format
Password must be 8+ characters
Then login with those credentials on index.html
Technologies Used

HTML5 - Semantic markup
CSS3 - Custom styling with variables, animations
JavaScript (ES6+) - Form validation, authentication logic
Bootstrap 5.3 - Responsive framework and components
Font Awesome 6.4 - Icons
Design Features

Netflix-inspired dark theme
Custom CSS variables for consistent theming
Animated background elements (stadium lights, field lines)
Smooth transitions and hover effects
Accessible form validation with ARIA labels
Mobile-first responsive design
Browser Compatibility

Chrome 90+
Firefox 88+
Safari 14+
Edge 90+
Known Limitations

Uses localStorage for demo authentication (not production-ready)
Requires @northeastern.edu email domain
No backend server implementation
No actual AI commentary generation (frontend mockup)
Future Enhancements

Backend API integration
Database for user management
Real AI commentary generation
Voice commentary support
Mobile app (iOS/Android)
Additional language support
GitHub Repository 🔗 https://github.com/rushita-vachhani/6150-group_Assignment.git

Contributions All team members contributed equally to this project. Individual contributions can be verified through GitHub commit history:

Team Member Contributions

Gayatri:

Developed styles.css (login/signup page styling)
Implemented auth.js (authentication logic, form validation, localStorage management)
Created password toggle functionality
Implemented user registration and login workflows
Keerthana:

Developed index.html (login page structure)
Implemented form markup with Bootstrap components
Added accessibility features (ARIA labels, semantic HTML)
Integrated form validation elements
Purva :

Developed landing.html (main landing page structure)
Implemented navbar, hero section, and feature carousel
Created FAQ accordion and contact form
Added footer and overall page layout
Rushita:

Developed landing_style.css (landing page custom styling)
Implemented landing.js (interactive features)
Created tooltip initialization and carousel functionality
Developed contact form validation for landing page
Integration & Collaboration The team followed Git best practices with individual branches merged into the main branch after review. Each member's work was integrated to create a cohesive, fully functional web application.

License This project is created for educational purposes as part of INFO6150 Web Design/User Experience Engineering coursework at Northeastern University.


Course: INFO6150 17654 - Web Design/User Experience Engineering
Assignment: Group Assignment 5 - Login and Landing Page Development
Date: 11 October 2025
Institution: Northeastern University
