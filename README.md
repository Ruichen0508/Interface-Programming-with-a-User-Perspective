# Interface-Programming-with-a-User-Perspective

## 🍔 Project: Burger Order System (Online Menu and Ordering)

This repository contains the source code for a simple, responsive **Burger Order Page** web application. It simulates an online menu and checkout process, allowing users to select and customize their meal, manage the cart, and finalize the order with a unique pickup number.

The project emphasizes a user-centric approach by focusing on dynamic, real-time feedback and a clear, guided checkout flow, while maintaining a clean code structure verified by modern CI/CD practices.

## ✨ Core Functionality

| Feature | Description | User Experience Focus |
| :--- | :--- | :--- |
| **Custom Combos** | A modal guides the user through selecting size (Standard, Large, XL), side, and drink options. | **Dynamic Feedback:** Price updates instantly based on the chosen size modifier. |
| **Order Management** | Users can add, adjust quantities, or completely **Cancel** (clear) the entire order from the sidebar. | **Control and Safety:** Provides clear control over cart contents and a one-click reset option. |
| **Guided Checkout** | Users are prompted to select **"Eat Here"** or **"Take Away"** before final confirmation. | **Clear Path:** Forces a crucial operational decision before order finalization. |
| **Confirmation Page** | After payment, the user is redirected to a dedicated page displaying the total, order type, and a unique **Pickup Number** (3-digit code). | **Clarity and Assurance:** Provides necessary confirmation and the key piece of information for service (the pickup number). |
| **Menu Filtering** | Items are categorized and can be filtered by category (e.g., Beef, Vegan). | **Navigation:** Improves discoverability and reduces visual clutter. |

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6) | Vanilla implementation for core logic and DOM manipulation. |
| **Styling** | Custom CSS (Morandi Palette) | Muted, professional aesthetics focused on readability. |
| **CI/CD** | GitHub Actions | Automates code quality checks (Linting) on every push. |
| **Quality Control** | ESLint, Stylelint, HTMLHint | Enforcing coding standards across JS, CSS, and HTML. |

## 📂 Repository Structure

The project structure is organized for maintainability:

## 🚀 Getting Started

To get the Burger Order System running locally, follow these simple steps.

### Prerequisites

* A modern **Web Browser** (e.g., Chrome, Firefox, Safari).
* **Node.js** and **npm** (optional, but required for running local development tools and linting scripts).

### Installation and Setup

1.  **Clone the Repository:**
    ```bash
    git clone [Your Repository URL]
    cd burger-order-page
    ```

2.  **Install Dependencies (for linting and scripts):**
    ```bash
    npm install
    ```

3.  **Run the Application:**
    Open the primary application file directly in your web browser.
    ```bash
    # Simply open the file path:
    open index.html 
    # OR use a live server extension/utility for local development
    ```
    
---

## ⚙️ Development and Quality Control (CI/CD Details)

The project leverages automated tools to ensure code quality and consistency.

### Automated Checks

The `.github/workflows` directory contains configurations for GitHub Actions, which perform the following checks on every push or pull request:

| Tool | Files Checked | Purpose |
| :--- | :--- | :--- |
| **ESLint** | `.js` (JavaScript) | Enforces syntax, style, and best practices defined in `.eslintrc.json`. |
| **Stylelint** | `.css` (CSS) | Maintains consistent styling rules and catches errors defined in `.stylelintrc.json`. |
| **HTMLHint** | `.html` | Verifies HTML structure against common issues and best practices defined in `.htmlhintrc`. |

### Local Linting Scripts

You can manually run the checks locally using the scripts defined in `package.json`:

```bash
# Run all linters
npm run lint

# Run JavaScript linting only
npm run lint:js

# Run CSS linting only
npm run lint:css

# Run HTML linting only
npm run lint:html
