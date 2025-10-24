import { FaEllipsisH, FaEye,FaEyeSlash } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { ProSidebar, Menu, MenuItem, SidebarHeader, SidebarContent } from "react-pro-sidebar";
import "./MainPage.css";




const Dashboard = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);

  // which one are we modifiying 
const [editing, setEditing] = useState(null);


const [editForm, setEditForm] = useState({
  website: "",
  username: "",
  password: "",
});

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  //tracking
const [openMenuId, setOpenMenuId] = useState(null);
 
const toggleRowMenu = (id) => {
  setOpenMenuId(prev => (prev === id ? null : id));
};

 
const [visiblePasswords, setVisiblePasswords] = useState([]);
const togglePasswordVisibility = (id) => {
  setVisiblePasswords((prev) =>
    prev.includes(id)
      ? prev.filter(pid => pid !== id)
      : [...prev, id]
  );
};
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  //strong password
  const generateStrongPassword = (length = 16) => {
    const charset =
      "abcdefghijklmnopqrstuvwxyz" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      "0123456789" +
      "!@#$%^&*()_+[]{}|;:,.<>?";
    let pw = "";
    for (let i = 0; i < length; i++) {
      const randIndex = Math.floor(Math.random() * charset.length);
      pw += charset[randIndex];
    }
    setNewAccount(prev => ({ ...prev, password: pw }));
  };
  const [newAccount, setNewAccount] = useState({ website: "", username:"",password: "" });
  const [user, setUser] = useState(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    return savedUserInfo ? JSON.parse(savedUserInfo) : {};
  });

  const animationStyles = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!accessToken) {
      navigate("/login");
    } else if (userInfo) {
      setUser(userInfo); 
    }

    const fetchPasswords = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      try {
        const response = await fetch(`${API_URL}api/user/passwords`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAccounts(data); 
        } else {
   
          console.error("Failed to fetch passwords.");
          navigate("/login"); 
        }
      } catch (error) {
        console.error("Error fetching passwords:", error);
      }
    };

    fetchPasswords();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };


  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleString("en-US", { hour12: false }); 
  };

  const saveNewAccount = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const API_URL = process.env.REACT_APP_API_URL;
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}"); 
    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }

    try {
      const postResponse = await fetch(`${API_URL}api/user/passwords`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          
          website: newAccount.website,
          username: newAccount.username,
          password: newAccount.password,
        }),
        
      });

      if (!postResponse.ok) {
        throw new Error("Failed to save the new account");
      }

  
      await fetchAccounts();


      setNewAccount({ website: "", username: "", password: "" });
  
    } catch (error) {
      console.error("Error saving the new account:", error);
    }
  };


  const fetchAccounts = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const API_URL = process.env.REACT_APP_API_URL;

    if (!accessToken) {
      console.log("No access token found");
      return;
    }

    try {
      const response = await fetch(`${API_URL}api/user/passwords`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(data); 
      } else {
        console.error("Failed to fetch accounts.");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const deleteAccount = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    const API_URL = process.env.REACT_APP_API_URL;

    if (!accessToken) {
      console.error("Access token is missing");
      return;
    }

    try {
      const response = await fetch(`${API_URL}api/user/passwords/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the account.");
      }

 
      fetchAccounts();
      //refreshing 
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  return (
     <div
       className="dashboard-container"
   onClick={() => setOpenMenuId(null)}
     >
      {showAddModal && (
  <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
    <div className="add-modal" onClick={e => e.stopPropagation()}>
      <button
        className="modal-close"
        onClick={() => setShowAddModal(false)}
      >
        ×
      </button>

      <h3>Add Credential</h3>

      <div className="form-group">
        <label htmlFor="new-site">Website</label>
        <input
          id="new-site"
          type="text"
          placeholder="e.g. Instagram"
          value={newAccount.website}
          onChange={e =>
            setNewAccount(f => ({ ...f, website: e.target.value }))
          }
        />
      </div>

      <div className="form-group">
        <label htmlFor="new-user">Username</label>
        <input
          id="new-user"
          type="text"
          placeholder="Your username"
          value={newAccount.username}
          onChange={e =>
            setNewAccount(f => ({ ...f, username: e.target.value }))
          }
        />
      </div>
    
      <div className="form-group">
    <label htmlFor="new-pass">Password</label>
    <div className="password-input-wrapper">
      <input
        id="new-pass"
        type={showNewPassword ? "text" : "password"}
        placeholder="Your password"
        value={newAccount.password}
        onChange={e =>
          setNewAccount(f => ({ ...f, password: e.target.value }))
        }
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() => setShowNewPassword(v => !v)}
      >
        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  </div>

    


      <button
  type="button"
  className="generate-btn"
  onClick={() => generateStrongPassword(16)}
>
  Generate Strong Password
</button>


      <button
        className="save-btn"
        onClick={async () => {
          await saveNewAccount();
          setShowAddModal(false);
        }}
      >
        Add Password
      </button>
    </div>
  </div>
)}


     
      <div className="dashboard-box">
      <animated.div style={animationStyles}>
  <h2 className="dashboard-title">Welcome, {user.name}!</h2>
</animated.div>

        <nav className="navbar">
        <button
  onClick={() => setShowAddModal(true)}
  className="add-account-button"
>
  Add New Account
</button>

         <button
  onClick={() => setConfirmSignOut(true)}
  className="logout-button"
>
  Sign Out
</button>

        </nav>
        <div className="content">
          <h2 className="mypasswords">My Passwords</h2>
      
          <div className="accounts-table">

          <div className="rows-clipper">
            <div className="account-row header">
              <div>Platform</div>
              <div>Username</div>
              <div>Password</div>
              <div>Date Saved</div>
              <div>Action</div>
            </div>
              </div>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <div className="account-row" key={account.id}>
                 <div className="account-website">
  <img
    src={`https://cdn.simpleicons.org/${account.website.toLowerCase()}`}
    alt={account.website}
    className="platform-icon"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "/icons/default.ico";  // fallback icon in public/icons
    }}
  />
  {account.website}
</div>
                  <div className="account-username">{account.username}</div>
                  <div className="account-password">
  <button
  type="button"
    className="view-button"
    onClick={() => togglePasswordVisibility(account.id)}
  >
    {visiblePasswords.includes(account.id)
      ? account.password
      : "View"}
  </button>
</div>
<div className="account-created">
  {formatDate(account.created_at)}
</div>

<div className="account-action" style={{ position: "relative" }}>
  {/* Ellipsis trigger */}
  <button
                type="button"
                 className="ellipsis-button"
                onClick={e => {
                  e.stopPropagation();
                  toggleRowMenu(account.id);
                }}
            >
  <FaEllipsisH />
 </button>

  {/* Dropdown menu */}
  {openMenuId === account.id && (
    <div className="row-menu" 
    onClick={e => e.stopPropagation()}>
      <button
        type="button"
        className="row-menu-item"
        onClick={() => {
         
          setEditForm({
            website: account.website,
            username: account.username,
            password: account.password,
          });
          // 2. Remember which ID we’re editing:
          setEditing(account.id);
          // 3. Close the dropdown menu:
          setOpenMenuId(null);
        }}
      >
        Edit
      </button>
      <button
     type="button"
     className="row-menu-item delete-item"
    onClick={() => {
       // instead of deleting immediately, open the confirm dialog
      setConfirmDeleteId(account.id);
        setOpenMenuId(null);
      }}
    >
     Delete
  </button>
    </div>
  )}
</div>

                </div>
              ))
            ) : (
              <p className="no-accounts">No accounts found.</p>
            )}
          </div>
        </div>
      </div>
      {confirmDeleteId !== null && (
  <div
    className="modal-backdrop"
    onClick={() => setConfirmDeleteId(null)}
  >
    <div
      className="confirm-modal"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="confirm-close"
        onClick={() => setConfirmDeleteId(null)}
      >
        ×
      </button>
      <h3>Delete Credential</h3>
      <p>Are you sure you want to delete this password?</p>
      <div className="confirm-actions">
        <button
          className="confirm-yes"
          onClick={async () => {
            // grab the ID now, before we clear it
            const idToDelete = confirmDeleteId;
            // await the deletion call
            await deleteAccount(idToDelete);
            // then close the modal
            setConfirmDeleteId(null);
          }}
        >
          Yes
        </button>
        <button
          className="confirm-no"
          onClick={() => setConfirmDeleteId(null)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}

{editing !== null && (
 <div className="modal-backdrop" onClick={() => setEditing(null)}>
  <div className="add-modal" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setEditing(null)}>×</button>
      <h3>Edit Credential</h3>

      <div className="form-group">
        <label htmlFor="edit-site">Website</label>
        <input
          id="edit-site"
          value={editForm.website}
          onChange={e => setEditForm(f => ({ ...f, website: e.target.value }))}
        />
      </div>

       <div className="form-group">
         <label htmlFor="edit-user">Username</label>
        <input
          id="edit-user"
          value={editForm.username}
          onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))}
         />
      </div>

      <div className="form-group">
  <label htmlFor="edit-pass">Password</label>
  <div className="password-input-wrapper">
    <input
      id="edit-pass"
      type={showNewPassword ? "text" : "password"}
      value={editForm.password}
      onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))}
    />
    <button
      type="button"
      className="password-toggle-btn"
      onClick={() => setShowNewPassword(v => !v)}
    >
      {showNewPassword ? <FaEyeSlash/> : <FaEye/>}
    </button>
  </div>
</div>


<button
  className="save-btn"
  onClick={async () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}api/user/passwords/${editing}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: user.userId,
          website: editForm.website,
          username: editForm.username,
          password: editForm.password,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to update the account: " + errorText);
      }

      const refreshed = await fetch(`${API_URL}api/user/passwords`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!refreshed.ok) {
        const errorText = await refreshed.text();
        throw new Error("Failed to refresh accounts: " + errorText);
      }

      const newData = await refreshed.json();
      setAccounts(newData);
      setEditing(null);
      setShowNewPassword(false);
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Something went wrong while saving changes.\n\n" + error.message);
    }
  }}
>
  Save Changes
</button>




      <button
  className="generate-btn"
  onClick={() => setEditing(null)}
>
  Cancel
</button>

     </div>
   </div>
 )}
{confirmSignOut && (
  <div
    className="modal-backdrop"
    onClick={() => setConfirmSignOut(false)}
  >
    <div
      className="confirm-modal"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="confirm-close"
        onClick={() => setConfirmSignOut(false)}
      >
        ×
      </button>
      <h3>Sign Out</h3>
      <p>Are you sure you want to sign out?</p>
      <div className="confirm-actions">
        <button
          className="confirm-yes"
          onClick={() => {
            setConfirmSignOut(false);
            handleLogout();
          }}
        >
          Yes
        </button>
        <button
          className="confirm-no"
          onClick={() => setConfirmSignOut(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    
    
  );
};
export default Dashboard;
