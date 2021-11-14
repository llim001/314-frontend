//WORKING
function RequestLogout() {
    DeleteSession();
    window.location.href = "index.html";
}

function DeleteSession() {
    localStorage.clear();
}