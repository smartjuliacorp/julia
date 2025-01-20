# Julia - Financial Insights App

Weekly personalized insights of financial wisdom

---

## **Setup**

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v16 or later)
- [TrueLayer Developer Account](https://console.truelayer.com/)
- A registered TrueLayer sandbox application

---

### **1. Clone the Repository**
```bash
git clone https://github.com/your-username/julia.git
cd julia
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory and configure the following:
```plaintext
CLIENT_ID=your-sandbox-client-id
CLIENT_SECRET=your-sandbox-client-secret
REDIRECT_URI=http://localhost:3000/callback
AUTH_API=auth.truelayer-sandbox.com
DATA_API=api.truelayer.com
PROVIDERS=uk-ob-all
PORT=3000
DB_USER=<mongodb_user>
DB_PASSWORD=<mongodb_password>
```

---

## **Usage**

### **1. Start the Development Server**
For development with live reload:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will run at `http://localhost:3000`.

---

### **2. Authentication Flow**
- Visit `http://localhost:3000/connect` to initiate the OAuth 2.0 authentication process.
- Log in using a TrueLayer sandbox account.
- Upon successful authentication, the callback endpoint (`/callback`) will exchange the authorization code for an access token.

---

### **3. Fetch Account Data**
After authentication:
- Visit `http://localhost:3000/accounts` to fetch account data securely.

---

## **Scripts**

| Command         | Description                              |
|------------------|------------------------------------------|
| `npm start`     | Runs the application in production mode. |
| `npm run dev`   | Starts the app in development mode.      |
| `npm run build` | Compiles the TypeScript code.            |

---

## **License**

This project is licensed under the [MIT License](LICENSE).
