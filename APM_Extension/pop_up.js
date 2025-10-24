// DOM Elements
const loginForm = document.getElementById("login-form");
const logoBox = document.getElementById("logged-in-logo");
const loginBtn = document.getElementById("login");
const passwordList = document.getElementById("password-list");
const logoutBtn = document.getElementById("logout");
const dashboard = document.getElementById("dashboard");

// Check login status on popup load
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("token", (result) => {
    if (result.token) {
      loginForm.style.display = "none";
      logoBox.style.display = "block";
      dashboard.style.display = "block";
      loadPasswords(result.token);
    } else {
      loginForm.style.display = "block";
      logoBox.style.display = "none";
      dashboard.style.display = "none";
    }
  });
});

// Handle login action
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Login failed: " + (data.message || "Unknown error"));
      return;
    }

    chrome.storage.local.set({ token: data.accessToken }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: "TRIGGER_AUTOFILL" });
      });
      alert("Login successful!");
      loginForm.style.display = "none";
      logoBox.style.display = "block";
      dashboard.style.display = "block";
      loadPasswords(data.accessToken);
    });
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please try again later.");
  }
});

// Fetch and render password entries for the user
async function loadPasswords(token) {
  try {
    const response = await fetch("http://localhost:3000/api/user/passwords", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const passwords = await response.json();
      passwordList.innerHTML = passwords
        .map((p) => `<li><strong>${p.website}</strong>: ${p.username}</li>`)
        .join("");
    } else {
      passwordList.innerHTML = "<li>Failed to fetch passwords.</li>";
    }
  } catch (err) {
    passwordList.innerHTML = "<li> Error loading passwords.</li>";
  }
}

// Handle logout
logoutBtn.addEventListener("click", () => {
  chrome.storage.local.remove("token", () => {
    loginForm.style.display = "block";
    logoBox.style.display = "none";
    dashboard.style.display = "none";
    passwordList.innerHTML = "";
  });
});
