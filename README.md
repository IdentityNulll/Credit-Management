# Nasiya — Qarzdorlar hisobi

A small web app for tracking customer debts (*nasiya*) in a shop. Uzbek interface with a
Latin ⇄ Cyrillic toggle.

- **front/** — React 18 + Vite
- **server/** — Express + Mongoose, backed by MongoDB Atlas

## Features

- List every debtor with amount, phone and date, newest first
- Total outstanding debt and debtor count at a glance
- Add / edit / delete a debt record
- **+** to increase a debt, **−** to record a payment, with a live before/after preview
- Quick-sum chips (+10k … +1M) so amounts can be entered without typing
- Server-side search by name or phone (debounced)
- Tap a phone number to open a pre-written SMS reminder in the correct alphabet
- Left border colours a row by age: green under 30 days, amber under 60, red beyond
- Language choice is remembered in `localStorage`

## Setup

```bash
npm install --prefix server && npm install --prefix front
```

Create `server/.env` from the example and fill in your connection string:

```bash
cp server/.env.example server/.env
```

```
PORT=5555
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/credit-whatever
CORS_ORIGIN=http://localhost:5173
```

## Seeding

Loads 25 sample grocery-shop records. **This wipes the `credits` collection first.**

```bash
npm run seed --prefix server
```

## Running

Two terminals:

```bash
npm run dev --prefix server
```

```bash
npm run dev --prefix front
```

Then open http://localhost:5173. In development Vite proxies `/api` to the server on
port 5555, so no API URL is hardcoded anywhere in the frontend.

## API

Base path `/api`.

| Method | Path                   | Purpose                                   |
| ------ | ---------------------- | ----------------------------------------- |
| GET    | `/health`              | Liveness check                            |
| GET    | `/credits?search=`     | List records + `total` and `count`        |
| GET    | `/credits/:id`         | One record                                |
| POST   | `/credits`             | Create                                    |
| PUT    | `/credits/:id`         | Update                                    |
| PATCH  | `/credits/:id/amount`  | Adjust by `{ delta }`, may be negative    |
| DELETE | `/credits/:id`         | Delete                                    |

`price` is stored as a **Number**. The API also accepts space-formatted strings
(`"1 500 000"`) and normalises them.

## Deploying

Build the frontend with the API host baked in:

```bash
VITE_API_URL=https://your-api-host/api npm run build --prefix front
```

Serve `front/dist` as a static site. Run the server with `npm start --prefix server`, and set
`PORT`, `MONGO_URI` and `CORS_ORIGIN` (your site's origin) in its environment.

Two things to check on the host:

- Atlas **Network Access** must allow the server's IP. It currently allows only the machine
  this was developed on, so a deployed server will hang on connect until you add its address.
- `CORS_ORIGIN` must list the deployed frontend origin, or the browser will block requests.

## Notes

`server/.env` is gitignored. It was committed in earlier history, so the password in that
history is still readable — rotate it in Atlas if this repository is public.
