console.log("🔄 content.js loaded on:", window.location.hostname);

/**
 * Autofills detected login fields with provided credentials
 */
function injectCredentials(username, password) {
  const usernameInput =
    document.querySelector('input[name*="user" i]') ||
    document.querySelector('input[name*="email" i]') ||
    document.querySelector('input[name*="login" i]') ||
    document.querySelector('input[placeholder*="user" i]') ||
    document.querySelector('input[placeholder*="email" i]') ||
    document.querySelector('input[placeholder*="login" i]') ||
    document.querySelector('input[type="text"]') ||
    document.querySelector('input[type="email"]');

  const passwordInput = document.querySelector('input[type="password"]');

  if (usernameInput) {
    usernameInput.value = username;
    usernameInput.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    console.log(" Username input not found.");
  }

  if (passwordInput) {
    passwordInput.value = password;
    passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    console.log("⚠️ Password input not found.");
  }

  console.log(" Username element:", usernameInput);
  console.log(" Password element:", passwordInput);
}

/**
 * Attempts to retrieve credentials for the current site and autofill
 */
chrome.storage.local.get("token", async ({ token }) => {
  if (!token) return;

  try {
    const response = await fetch("http://localhost:3000/api/user/passwords", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const passwords = await response.json();
      const hostnameRoot = window.location.hostname.replace("www.", "").replace(".com", "").toLowerCase();

      const match = passwords.find((p) =>
        hostnameRoot === p.website.toLowerCase().replace(/\s+/g, "").replace(/\.com$/, "")
      );

      if (match) {
        injectCredentials(match.username, match.password);
      } else {
        console.log(" No matching credentials for:", hostnameRoot);
      }
    }
  } catch (error) {
    console.error(" Error fetching passwords:", error);
  }
});

/**
 * Intercepts signup form submission to save credentials
 */
function sendSignupData(username, password) {
  chrome.storage.local.get(["token"], ({ token }) => {
    if (!token) return console.log("🔒 No token found in local storage.");

    const payload = {
      website: window.location.hostname,
      username,
      password,
    };

    fetch("http://localhost:3000/api/user/passwords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save credentials");
        return res.json();
      })
      .then((data) => console.log("✅ Credentials saved:", data))
      .catch((err) => console.error("❌ Save error:", err));
  });
}

window.addEventListener("submit", (event) => {
  const passwordField = document.querySelector('input[name="reg_passwd__"]');
  const emailField = document.querySelector('input[name="reg_email__"]');

  if (passwordField && emailField) {
    event.preventDefault(); // Intercept before form sends
    sendSignupData(emailField.value, passwordField.value);
  }
});

/**
 * Observes dynamic input creation for password strength injection
 */
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (
        node.nodeName === "INPUT" &&
        node.getAttribute("name") === "reg_passwd__"
      ) {
        console.log("🧪 Password field detected by MutationObserver");
        observer.disconnect();
        addPasswordStrengthFeature(node);
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

/**
 * Injects password strength visual and auto-generator
 */
function addPasswordStrengthFeature(passwordInput) {
  const strongPassword = generateStrongPassword();
  passwordInput.value = strongPassword;
  displayPasswordStrength(evaluatePasswordStrength(strongPassword));

  passwordInput.addEventListener("input", (e) => {
    const strength = evaluatePasswordStrength(e.target.value);
    displayPasswordStrength(strength);
  });

  function generateStrongPassword() {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const length = 16;
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  function evaluatePasswordStrength(password) {
    if (password.length < 8) return "weak";
    if (/^[a-zA-Z]+$/.test(password)) return "medium";
    if (
      password.length > 15 ||
      /(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(password)
    ) {
      return "strong";
    }
    return "medium";
  }

  function displayPasswordStrength(strength) {
    let display = document.getElementById("passwordStrengthDisplay");

    if (!display) {
      display = document.createElement("div");
      display.id = "passwordStrengthDisplay";
      passwordInput.parentNode.insertBefore(display, passwordInput.nextSibling);

      Object.assign(display.style, {
        padding: "5px",
        marginTop: "5px",
        fontSize: "14px",
        color: "#fff",
        borderRadius: "4px",
        textAlign: "center",
        maxWidth: "200px",
      });
    }

    display.textContent = `Strength: ${strength}`;
    display.className = `strength-${strength}`;
    display.style.backgroundColor = {
      weak: "#ff6666",
      medium: "#ffcc66",
      strong: "#66cc66",
    }[strength];
  }
}

/**
 * Listens for extension-triggered autofill requests
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "TRIGGER_AUTOFILL") {
    chrome.storage.local.get("token", async ({ token }) => {
      if (!token || window.location.hostname !== "www.facebook.com") return;

      try {
        const response = await fetch("http://localhost:3000/api/user/passwords", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const passwords = await response.json();
          const hostnameRoot = window.location.hostname
            .replace("www.", "")
            .replace(".com", "")
            .toLowerCase();

          const match = passwords.find((p) =>
            hostnameRoot === p.website.toLowerCase().replace(/\s+/g, "").replace(/\.com$/, "")
          );

          console.log("Site:", hostnameRoot);
          console.log("Stored websites:", passwords.map((p) => p.website));
          console.log(" Matched:", match);

          if (match) {
            injectCredentials(match.username, match.password);
            sendResponse({ success: true });
          }
        }
      } catch (err) {
        console.error("Autofill error:", err);
      }
    });

    return true; // Keep message channel open for async response
  }
});
