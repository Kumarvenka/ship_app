

# 🚢 OneMarineX - Ship Management Web Application

A full-stack platform for **merchant navy crew members** to manage:
- 🚖 Cab bookings for port transport
- 📦 Onboard essential item delivery

Supports role-based access for:
- 👨‍✈️ Crew  
- 🚗 Drivers  
- 🧑‍🔧 Vendors  
- ⚙️ Admins

---

## 🔐 Features

### 👨‍✈️ Crew
- Book cabs and check request status
- Request onboard items
- Track item delivery progress

### 🚗 Driver
- View assigned cab requests
- Accept/Decline requests
- Update ride status

### 🧑‍🔧 Vendor
- View assigned item requests
- Accept/Reject and update delivery status

### ⚙️ Admin *(Planned/Partial)*
- View all cab and item requests
- (Optionally) Assign vendors or drivers

---

## 🛠️ Tech Stack

**Frontend**  
- React.js  
- Tailwind CSS  
- React Router

**Backend**  
- Node.js  
- Express.js  
- MongoDB (with Mongoose)

**Authentication**  
- JWT (Stored in localStorage)

---

## 📂 Project Structure

```

SHIP\_APP/
├── frontend/         # React frontend
├── backend/          # Express backend
└── .gitignore

````

---

## 🚀 Run Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
````

### Backend

```bash
cd backend
npm install
node server.js
```

> ⚠️ **Don’t forget to create a `.env` file in `backend/` with:**

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
```

---

![image](https://github.com/user-attachments/assets/102b3bfa-afbb-4617-83ab-dfb18021c6d6)
![image](https://github.com/user-attachments/assets/0da1882c-9b8e-4406-87e0-c5957c665619)
![image](https://github.com/user-attachments/assets/5fe9a79c-3d3f-4dc8-a1f4-f1631a5c9f13)
![image](https://github.com/user-attachments/assets/03bb50af-d0c0-467e-ad5e-3e3396073340)
![image](https://github.com/user-attachments/assets/f20fcd4f-41d9-48ff-9f46-e80c0394510a)
![image](https://github.com/user-attachments/assets/3ca8189a-8c19-42ba-8b02-46e473f469f2)
![image](https://github.com/user-attachments/assets/4dbde652-94bf-4da9-9f9d-0724a2c99835)
![image](https://github.com/user-attachments/assets/ec0341f7-5527-4b94-aa3b-d4e825451bfb)
![image](https://github.com/user-attachments/assets/424f6f2d-d41a-40b7-b1d2-1fcc7f452923)
![image](https://github.com/user-attachments/assets/34070175-2e22-4962-8894-b516dd69d8cf)










