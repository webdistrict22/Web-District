# Web District QA

These checks are designed for repeatable pre-deployment and post-deployment
verification. Public, protected, and admin smoke tests only read data unless an
optional email test is explicitly enabled.

## Frontend Checks

From the project root:

```powershell
cd client
npm.cmd run lint
npm.cmd run build
```

## Backend Smoke Tests

From the project root:

```powershell
cd server
npm.cmd run qa:public
npm.cmd run qa:protected
npm.cmd run qa:admin
npm.cmd run qa
```

The default API target is:

```text
http://localhost:5000/api
```

The local backend must be running and able to connect to MongoDB before local
smoke tests can pass.

To check the deployed Render API in PowerShell:

```powershell
$env:API_BASE_URL="https://web-district.onrender.com/api"
npm.cmd run qa:public
npm.cmd run qa:protected
```

If a managed Windows environment reports a certificate-chain error while
PowerShell can reach the API, use Node's system certificate store for that
terminal session:

```powershell
$env:NODE_OPTIONS="--use-system-ca"
```

## Optional Admin Checks

Admin checks skip successfully when credentials are absent.

```powershell
$env:QA_ADMIN_EMAIL=""
$env:QA_ADMIN_PASSWORD=""
$env:QA_SEND_TEST_EMAIL="false"
$env:QA_TEST_EMAIL=""
npm.cmd run qa:admin
```

The test-email endpoint is never called unless
`QA_SEND_TEST_EMAIL=true`. When enabled, `QA_TEST_EMAIL` is preferred, followed
by `OWNER_EMAIL`, followed by the backend's configured email fallback.

## Optional Write Checks

Write tests are disabled by default:

```powershell
$env:QA_RUN_WRITE_TESTS="false"
$env:QA_ALLOW_PRODUCTION_WRITES="false"
npm.cmd run qa:write
```

To run against a local or dedicated QA backend:

```powershell
$env:QA_RUN_WRITE_TESTS="true"
$env:QA_ADMIN_EMAIL="admin@example.com"
$env:QA_ADMIN_PASSWORD="your-admin-password"
npm.cmd run qa:write
```

Production writes are refused unless both flags are explicitly true:

```powershell
$env:API_BASE_URL="https://web-district.onrender.com/api"
$env:QA_RUN_WRITE_TESTS="true"
$env:QA_ALLOW_PRODUCTION_WRITES="true"
npm.cmd run qa:write
```

The write test creates a clearly marked QA client and website request. It
deletes the website request when possible. The application has no user-delete
endpoint, so the script reports the remaining QA client ID and email for manual
review. Appointment and contract writes remain manual tests.

## Environment Reference

```env
API_BASE_URL=https://web-district.onrender.com/api
QA_ADMIN_EMAIL=
QA_ADMIN_PASSWORD=
QA_SEND_TEST_EMAIL=false
QA_TEST_EMAIL=
QA_RUN_WRITE_TESTS=false
QA_ALLOW_PRODUCTION_WRITES=false
```

Never enable production writes casually. Signup and request flows may trigger
the application's normal notification emails.

Use [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) for the complete pre-deploy and
post-deploy manual verification sequence.
