# Project Title

A user authentication system with secure login and registration functionality. Users can sign up for an account, log in securely, and access protected routes only after successful authentication.

---

## Appendix

### A. System Architecture

The application follows a client–server architecture:

- **Frontend:** React handles user interaction, form validation, routing, and authentication state.
- **Backend:** Spring Boot exposes RESTful APIs for authentication and protected resources.
- **Communication:** The frontend communicates with the backend via HTTP/HTTPS using JSON.

---

### B. Authentication Flow

1. A user registers through the React frontend.
2. Registration data is sent to Spring Boot REST endpoints.
3. User credentials are securely stored after password hashing.
4. During login, credentials are validated by Spring Security.
5. Upon successful authentication, a JWT is generated and returned to the client.
6. The React application stores the token securely and includes it in subsequent API requests.
7. Spring Security validates the token before granting access to protected endpoints.

---

### C. Security Implementation

The system incorporates the following security measures:

- Spring Security for authentication and authorization  
- BCrypt password hashing  
- JWT (JSON Web Tokens) for stateless authentication  
- CORS configuration to allow controlled frontend access  
- Protected API endpoints requiring valid authentication tokens  

---

### D. Protected Routes

- Backend endpoints are secured using Spring Security configuration.
- React uses route guards (hooks or higher-order components) to restrict access to protected pages.
- Unauthorized users are redirected to the login page.

---

### E. Assumptions and Limitations

- The system uses stateless authentication with JWT.
- Token expiration requires users to re-authenticate unless refresh tokens are implemented.
- Secure token storage depends on implementation (e.g., HTTP-only cookies or in-memory storage).

---

### F. Future Enhancements

- Refresh token implementation  
- Role-based access control (RBAC)  
- Multi-factor authentication (MFA)  
- OAuth2 / social login support  
- Improved error handling and logging  

---

### G. Technologies Used

- **Backend:** Spring Boot, Spring Security, JWT, JPA  
- **Frontend:** React, React Router, Axios  
- **Database:** MySQL  
- **Build Tools:** Maven, npm  

---

## Authors

- [@wastedx7](https://www.github.com/wastedx7)

---

## Badges

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

---

## Screenshots

![App Screenshot](./Screenshot (9).png)

---

![App Screenshot](./Screenshot (8).png)

---

![App Screenshot](./Screenshot (7).png)

---

## Run Locally

### 1️⃣ Clone the Project

```bash
git clone https://github.com/wastedx7/Secure-User-Authentication.git
cd project-root
```

---

### 2️⃣ Backend Setup (Spring Boot)

Navigate to the backend directory:

```bash
cd backend
```

#### Configure the Database

Edit the configuration file:

```text
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/auth_db
spring.datasource.username=root
spring.datasource.password=yourpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Ensure:
- MySQL is running
- The database exists

#### Run the Spring Boot Application

Using Maven:

```bash
mvn spring-boot:run
```

Or using the Maven wrapper:

```bash
./mvnw spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

---

### 3️⃣ Frontend Setup (React + Vite)

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

### 4️⃣ Access the Application

- Register a new account
- Log in with valid credentials
- Access protected routes after successful authentication

---

### ✅ Notes

- Ensure the frontend API base URL points to `http://localhost:8080`
- CORS must be enabled in Spring Boot
- JWT tokens are required to access protected endpoints
