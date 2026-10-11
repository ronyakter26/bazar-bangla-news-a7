# 🛒 বাজার দর | BazarDor

### Your Daily Market Price Tracker 🇧🇩

BazarDor is a Bangla-based market price tracking web application that helps users explore daily prices of essential products in Bangladesh. Users can browse products by category, compare price changes, and view detailed product information through a simple, user-friendly, and responsive interface.

## ✨ Key Features

- 📊 **Daily Market Prices:** View today's prices of essential market products.
- 📈 **Price Increase Tracking:** Explore products whose prices have increased today.
- 📉 **Price Decrease Tracking:** Find products whose prices have decreased today.
- 🗂️ **Product Categories:** Browse products by categories such as rice, lentils, oil, vegetables, fish, meat, and eggs.
- 🔎 **Product Details:** View detailed information about individual products.
- 🔐 **User Authentication:** Sign up and sign in using email and password.
- 🌐 **Social Login:** Authenticate using Google and GitHub.
- 👤 **User Profile:** Access account options and sign out.
- 📱 **Responsive Design:** Enjoy a user-friendly experience across desktop, tablet, and mobile devices.
- 🇧🇩 **Bangla Interface:** Explore market information with a Bengali-language interface and Bengali numerals.
- 🔄 **Price Comparison:** Compare current prices with previous prices to understand market trends.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **Next.js** | Building the user interface and web application |
| **Next.js App Router** | Handling page navigation and routing |
| **Tailwind CSS** | Styling and responsive design |
| **DaisyUI** | Reusable UI components and styling |
| **TypeScript** | Type-safe and maintainable code |
| **Better Auth** | User authentication and social login |
| **MongoDB** | Storing authentication data |
| **REST API** | Fetching product and market price data |
| **Vercel** | Deploying the application |

## 🚀 Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- A MongoDB database
- Google and GitHub OAuth credentials for social login

### Installation

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

**2. Navigate to the project directory**

```bash
cd YOUR_PROJECT_FOLDER
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create a `.env` file in the root directory and add your own credentials:

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_MONGODB_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Do not share or commit your `.env` file or any secret credentials to GitHub.

**5. Start the development server**

```bash
npm run dev
```

**6. Open the application**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

BazarDor uses Better Auth for user authentication and MongoDB for storing authentication data. Users can register and sign in using email and password or use Google and GitHub social login.

## 🌍 Deployment

The application can be deployed using Vercel.

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables.
3. Set up the production OAuth callback URLs for Google and GitHub.
4. Deploy the application.

## 👩‍💻 Author

**Rony Akter**

GitHub: [@ronyakter26](https://github.com/ronyakter26)

---

Made with ❤️ in Bangladesh.
