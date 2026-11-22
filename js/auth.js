(function () {
  var accounts = {
    admin: { username: "admin", password: "5782644", name: "Administrator", role: "admin" },
    staff: { username: "staff", password: "st004", name: "Staff Member", role: "staff" },
    customer: { username: "customer", password: "ct007", name: "Customer", role: "customer" }
  };

  function currentUser() {
    try { return JSON.parse(sessionStorage.getItem("glassMartUser") || "null"); }
    catch (_) { return null; }
  }

  function signOut() {
    sessionStorage.removeItem("glassMartUser");
    window.location.replace("../index.html");
  }

  window.GlassMartAuth = {
    currentUser,
    signOut,
    requireRole: function (allowedRole) {
      const user = currentUser();
      if (!user) {
        const inWorkspace = /\/(admin|staff|customer)\//.test(window.location.pathname);
        window.location.replace(inWorkspace ? "../index.html" : "index.html");
        return null;
      }
      if (user.role !== allowedRole) {
        window.location.replace("../" + user.role + "/dashboard.html");
        return null;
      }
      return user;
    }
  };

  
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    if (!form) return;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        const error = document.getElementById("loginError");

        error.textContent = "";

        const { data, error: loginError } =
            await db.auth.signInWithPassword({
                email,
                password
            });

        if (loginError) {
            error.textContent = "Invalid email or password.";
            return;
        }

        const { data: profile, error: profileError } =
            await db
                .from("profiles")
                .select("full_name, role")
                .eq("id", data.user.id)
                .single();

        if (profileError) {
            await db.auth.signOut();
            error.textContent = "Unable to load your account.";
            return;
        }

        const destinations = {
            admin: "admin/dashboard.html",
            staff: "staff/dashboard.html",
            customer: "customer/dashboard.html"
        };

        window.location.href = destinations[profile.role];
    });
});

})();
