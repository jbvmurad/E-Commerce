# Client ↔ Backend connections

The client uses the API Gateway URL from `VITE_API_BASE_URL`.

Default Docker/local value:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Connected client areas:

- Security API: register, login, logout, forgot/reset password, email confirmation, email change, password change
- Profile API: current profile, profile image/update, address list/create/update/delete
- AI API: anonymous customer chat and authorized seller chat with file attachments
- Security administration: users, roles and user-role assignments

Run the client from the `E-Commerce.Client` directory:

```powershell
docker-compose up --build
```

The client is available at `http://localhost:5173`. The backend API Gateway must be available at `http://localhost:5000` unless `VITE_API_BASE_URL` is overridden.

This client Docker setup uses the Vite development server. It does not require an `nginx` directory and does not create a host-side `dist` directory.
