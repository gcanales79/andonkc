$(document).ready(function() {
    // Getting references to our form and inputs
    var loginForm = $("form.login");
    var usuarioInput = $("input#usuario-input");
    var passwordInput = $("input#password-input");
  
    // When the form is submitted, we validate there's an email and password entered
    loginForm.on("submit", function(event) {
      event.preventDefault();
      var userData = {
        usuario: usuarioInput.val().trim(),
        password: passwordInput.val().trim()
      };
  
      if (!userData.usuario || !userData.password) {
        return;
      }
  
      // If we have an email and password we run the loginUser function and clear the form
      loginUser(userData.usuario, userData.password);
      usuarioInput.val("");
      passwordInput.val("");
    });
  
    // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
    function loginUser(usuario, password) {
      $.post("/api/login", {
        usuario: usuario,
        password: password
      }).then(function(data) {
        console.log(data)
        localStorage.setItem("token",data.token)
        localStorage.setItem("role",data.role)
        // If there's an error, log the error
      })
    }
  
  });