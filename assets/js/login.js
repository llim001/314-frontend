var config = JSON.parse(config);

$("#loginForm").submit(function(event)
{
  event.preventDefault();
  $.ajax({
    type: "POST",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/login",
    data:({
      username : $('#username').val(),
      password: $('#password').val()
    }),
    success: function(data, status, xhr)
    {
      if(xhr.status === 200 && data) // you should do your checking here
      {
        // var parsed_data = JSON.parse(data);
        var userObj = {
          username: data[0].username,
          role: data[0].role,
          email: data[0].email,
          phone: data[0].phone,
        }
        localStorage.setItem('userobj',JSON.stringify(userObj));
        console.log("Successfully logged in");
        window.location = "home.html"; //just to show that it went through
      }
    },
    error: function(data) {
      console.log(data)
      $('span.login-error').css({ visibility: 'visible' });
      if (data.status === 401) {
        $('span.login-error').html("The username or password entered is incorrect.");
      } else {
        $('span.login-error').html("An internal server error has occurred.");
      }
    }
  });
  return false;
})