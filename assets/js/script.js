var config = JSON.parse(config);

$(document).ready( function () {
  loadSessionIfAvailable();
  getPrescriptions();
  verifyRoles();
});

function loadSessionIfAvailable() {
  var userObj =JSON.parse((localStorage.getItem("userobj")));
  console.log(userObj);
  if (userObj !== null) {
    console.log("not empty")
    $('span#username').html(userObj.username);
    $('span#role').html(userObj.role);
    $('span#email').html(userObj.email);
    $('span#phone').html(userObj.phone);
  } else {
    console.log("empty user");
    alert("Please login! change this to restrict even viewing for frontend")
    window.location.href = "index.html";
  }

}

function getPrescriptions() {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/prescription",
    data:({
      username : JSON.parse((localStorage.getItem("userobj"))).username
    }),
    success: function(data, status, xhr)
    {
      var tableName = document.getElementById("prescriptionDisplay");
      var noOfRows = tableName.rows.length;
      for (let i = 0; i < noOfRows; i++) {
        tableName.removeChild(tableName.childNodes[0]);
      }

      for (let i = 0; i < data.length; i++) {
        var prescriptionObj = {
          token: data[i].token,
          doctorUsername: data[i].doctor_username,
          medicine: data[i].medicine,
          dosage: data[i].dosage,
          dateIssued: data[i].date_issued,
          dateDispensed: data[i].date_dispense,
        }

        var newTableRow = document.createElement("tr");

        for (let j in data[i]) {
          var newTableD = document.createElement("td"); // <td> node
          //console.log(typeof(data[i][j]));
          var prescriptionDataNode = document.createTextNode(data[i][j]); // prescription Data node
          newTableD.appendChild(prescriptionDataNode);
          newTableRow.appendChild(newTableD);
        }

        document.getElementById("prescriptionDisplay").appendChild(newTableRow);
      }
    }
  });
  return false;

}

function searchPrescriptionsByToken(inputToken) {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/searchPrescriptionByToken",
    data:({
      username : JSON.parse((localStorage.getItem("userobj"))).username,
      token : inputToken
    }),
    success: function(data, status, xhr)
    {
      var tableName = document.getElementById("prescriptionDisplay");
      var noOfRows = tableName.rows.length;
      for (let i = 0; i < noOfRows; i++) {
        tableName.removeChild(tableName.childNodes[0]);
      }

      for (let i = 0; i < data.length; i++) {
        var prescriptionObj = {
          token: data[i].token,
          doctorUsername: data[i].doctor_username,
          medicine: data[i].medicine,
          dosage: data[i].dosage,
          dateIssued: data[i].date_issued,
        }

        var newTableRow = document.createElement("tr");

        for (let j in data[i]) {
          var newTableD = document.createElement("td"); // <td> node
          //console.log(typeof(data[i][j]));
          var prescriptionDataNode = document.createTextNode(data[i][j]); // prescription Data node
          newTableD.appendChild(prescriptionDataNode);
          newTableRow.appendChild(newTableD);
        }

        document.getElementById("prescriptionDisplay").appendChild(newTableRow);
      }
    }
  });
  return false;

}


function verifyRoles() {
    var i, tabcontent, tablinks;
    var userObj =JSON.parse((localStorage.getItem("userobj")));
    if(userObj.role == "Patient") {
        tabcontent = ["prescription-section"];
        tabid = ["patientPrescriptionPage"];
    }

    else if(userObj.role == "Admin") {
        tabcontent = ["users-section", "adminAddUser-section"];
        tabid = ["adminViewUserPage", "adminAddUserPage"];
    }

    else if(userObj.role == "Doctor") {
        tabcontent = ["patients-section","doctorAddPrescription-section", "doctorUpdatePrescription-section"];
        tabid = ["doctorViewPatientPage","doctorAddPrescriptionPage", "doctorUpdatePrescriptionPage"];
    }

    else if(userObj.role == "Pharmacist") {
        tabcontent = ["pharmacistViewPrescription-section"];
        tabid = ["pharmacistViewPrescriptionPage"];
    }
  
    for (i = 0; i < tabcontent.length; i++) {
        console.log(tabcontent[i]);
        document.getElementsByClassName(tabcontent[i])[0].style.display = "none";
    }

    tablinks = document.getElementsByClassName("links");
    for (i = 0; i < tablinks.length; i++) {
        console.log(tablinks[i]);
        tablinks[i].style.display = "none"; 
    }

    for (i = 0; i < tabid.length; i++) {
        document.getElementById(tabid[i]).style.display = "flex";
    }

}

function changeTab(section) {
  verifyRoles();
  console.log(section);
  document.getElementsByClassName(section)[0].style.display = "block";
  document.getElementsByClassName(section)[0].style.visibility = "visible";
  document.getElementsByClassName("defaultpage")[0].style.display = "inline";
}


function getUsers() {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/list",
    success: function(data, status, xhr)
    {
      var tableName = document.getElementById("usersDisplay");
      var noOfRows = tableName.rows.length;
      for (let i = 0; i < noOfRows; i++) {
        tableName.removeChild(tableName.childNodes[0]);
      }

      for (let i = 0; i < data.length; i++) {
        var usersObj = {
          username: data[i].username,
          password: data[i].password,
          role: data[i].role,
          doemailsage: data[i].email,
          phone: data[i].phone,
        }

        var newTableRow = document.createElement("tr");

        for (let j in data[i]) {
          var newTableD = document.createElement("td"); // <td> node
          var usersDataNode = document.createTextNode(data[i][j]); // users Data node
          newTableD.appendChild(usersDataNode);
          newTableRow.appendChild(newTableD);
        }

        var newTableD2 = document.createElement("td");
        var btn = document.createElement('input');
        btn.type = "button";
        btn.className = "btn" + i;
        btn.value = "Click to Edit";
        btn.onclick = (function() {userEditBtn(i);});
        newTableD2.appendChild(btn);
        newTableRow.appendChild(newTableD2);

        document.getElementById("usersDisplay").appendChild(newTableRow);
      }
    }
  });
  return false;

}


function userEditBtn(rowID) {
  var tableName = document.getElementById("usersDisplay");
  var noOfRows = tableName.rows.length;
  document.getElementById("updateUserForm").style.display="block";
  document.getElementById("updateUserForm").style.visibility="visible";
  //console.log(rowID);
  //console.log(tableName.rows[rowID].cells[2]);
  document.getElementById("currentUsername").innerHTML = tableName.rows[rowID].cells[0].innerHTML;
  document.getElementById("currentPassword").innerHTML = tableName.rows[rowID].cells[1].innerHTML;
  document.getElementById("currentRole").innerHTML = tableName.rows[rowID].cells[2].innerHTML;
  document.getElementById("currentEmail").innerHTML = tableName.rows[rowID].cells[3].innerHTML;
  document.getElementById("currentPhone").innerHTML = tableName.rows[rowID].cells[4].innerHTML;
}


// Update User button
function updateUserBtn() {
  if (document.getElementById("updatePasswordInput").value != "") {
    var pass = document.getElementById("updatePasswordInput").value;
  }
  else {
    var pass = document.getElementById("currentPassword").innerHTML;
  }

  if (document.getElementById("updateEmailInput").value != "") {
    var email = document.getElementById("updateEmailInput").value;
  }
  else {
    var email = document.getElementById("currentEmail").innerHTML;
  }

  if (document.getElementById("updatePhoneInput").value != "") {
    var phone = document.getElementById("updatePhoneInput").value;
  }
  else {
    var phone = document.getElementById("currentPhone").innerHTML;
  }

  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/adminUpdateUserInfo",
    data:({
      username : document.getElementById('currentUsername').innerHTML,
      cpassword : document.getElementById("currentPassword").innerHTML,
      cemail : document.getElementById("currentEmail").innerHTML,
      cphone : document.getElementById("currentPhone").innerHTML,
      npassword : pass,
      nemail : email,
      nphone : phone,
    }),
    success: function(data, status, xhr)
    {
      doctorViewPrescription(document.getElementById('doctorTokenInput').value);
      document.getElementById("updateUserForm").style.display = "none";
      document.getElementById("updateUserForm").style.visibility = "hidden";
      document.getElementById('updatePasswordInput').value = "";
      document.getElementById('updateEmailInput').value = "";
      document.getElementById('updatePhoneInput').value = "";
      getUsers();
    }
  });
  return false;
}


function searchUsersByRole(inputRole) {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/searchUsersByRole",
    data:({
      username : JSON.parse((localStorage.getItem("userobj"))).username,
      role : inputRole,
    }),
    success: function(data, status, xhr)
    {
      var tableName = document.getElementById("usersDisplay");
      var noOfRows = tableName.rows.length;
      for (let i = 0; i < noOfRows; i++) {
        tableName.removeChild(tableName.childNodes[0]);
      }

      for (let i = 0; i < data.length; i++) {
        var usersObj = {
          username: data[i].username,
          password: data[i].password,
          role: data[i].role,
          doemailsage: data[i].email,
          phone: data[i].phone,
        }

        var newTableRow = document.createElement("tr");

        for (let j in data[i]) {
          var newTableD = document.createElement("td"); // <td> node
          var usersDataNode = document.createTextNode(data[i][j]); // users Data node
          newTableD.appendChild(usersDataNode);
          newTableRow.appendChild(newTableD);
        }

        var newTableD2 = document.createElement("td");
        var btn = document.createElement('input');
        btn.type = "button";
        btn.className = "btn" + i;
        btn.value = "Click to Edit";
        btn.onclick = (function() {userEditBtn(i);});
        newTableD2.appendChild(btn);
        newTableRow.appendChild(newTableD2);

        document.getElementById("usersDisplay").appendChild(newTableRow);
      }
    }
  });
  return false;

}


function getPatientPrescription() {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/patientPrescription",
    data:({
      doctorusername : JSON.parse((localStorage.getItem("userobj"))).username,
    }),
    success: function(data, status, xhr)
    {
      var tableName = document.getElementById("patientPrescriptionDisplay");
      var noOfRows = tableName.rows.length;
      for (let i = 0; i < noOfRows; i++) {
        tableName.removeChild(tableName.childNodes[0]);
      }

      for (let i = 0; i < data.length; i++) {
        var ppObj = {
          token: data[i].token,
          doctor_username: data[i].doctor_username,
          medicine: data[i].medicine,
          dosage: data[i].dosage,
          date: data[i].date,
        }

        var newTableRow = document.createElement("tr");

        for (let j in data[i]) {
          var newTableD = document.createElement("td"); // <td> node
          var usersDataNode = document.createTextNode(data[i][j]); // patient prescription Data node
          newTableD.appendChild(usersDataNode);
          newTableRow.appendChild(newTableD);
        }

        document.getElementById("patientPrescriptionDisplay").appendChild(newTableRow);
      }
    }
  });
  return false;

}


function searchPatientPrescriptionByID($patientusernameInput) {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/searchPatientPrescription",
    data:({
      doctorusername : JSON.parse((localStorage.getItem("userobj"))).username,
      patientusername : $patientusernameInput,
    }),
    success: function(data, status, xhr)
    {
      var tableName = document.getElementById("patientPrescriptionDisplay");
      var noOfRows = tableName.rows.length;
      for (let i = 0; i < noOfRows; i++) {
        tableName.removeChild(tableName.childNodes[0]);
      }

      for (let i = 0; i < data.length; i++) {
        var ppObj = {
          token: data[i].token,
          doctor_username: data[i].doctor_username,
          medicine: data[i].medicine,
          dosage: data[i].dosage,
          date: data[i].date,
        }

        var newTableRow = document.createElement("tr");

        for (let j in data[i]) {
          var newTableD = document.createElement("td"); // <td> node
          var patientsDataNode = document.createTextNode(data[i][j]); // patient prescription Data node
          newTableD.appendChild(patientsDataNode);
          newTableRow.appendChild(newTableD);
        }

        document.getElementById("patientPrescriptionDisplay").appendChild(newTableRow);
      }
    }
  });
  return false;

}


// Insert Medicine and Dosage to table
function insertMedcineAndDosage($medicine, $dosage) {
  var newTableRow = document.createElement("tr");
  var newTableD = document.createElement("td");
  var medicineDataNode = document.createTextNode($medicine);
  newTableD.appendChild(medicineDataNode);
  var newTableD2 = document.createElement("td");
  var dosageDataNode = document.createTextNode($dosage);
  newTableD2.appendChild(dosageDataNode);
  var newTableD3 = document.createElement("td");
  var checkbx = document.createElement('input');
  checkbx.setAttribute('type', 'checkbox');
  checkbx.setAttribute('id', 'checkbxForRemove');
  newTableD3.appendChild(checkbx);
  newTableRow.appendChild(newTableD);
  newTableRow.appendChild(newTableD2);
  newTableRow.appendChild(newTableD3);
  document.getElementById("previewPrescriptionDisplay").appendChild(newTableRow);
}


function prescribe() {
  var gotdup = false;
  const medicineAndDosageArr = [];
  var previewTable = document.getElementById('previewPrescriptionDisplay');

  //gets rows of table
  var rowLength = previewTable.rows.length;

  for (i = 0; i < rowLength; i++){
    for (j = i+1; j < rowLength; j++) {
      if (previewTable.rows[i].cells[0].innerHTML == previewTable.rows[j].cells[0].innerHTML)
      {
        console.log("There's duplicates in the table");
        document.getElementById('outputLB').innerHTML = "There's duplicates in the table";
        gotdup = true;
        break;
      }
    }
  }

  if (gotdup == false) {
    //loops through rows    
    for (i = 0; i < rowLength; i++){

      //gets all items of current row  
      var currentRowItems = previewTable.rows.item(i).cells;

      //gets amount of cells of current row
      var noOfItems = currentRowItems.length - 1;

      //loops through each cell in current row
      for(var j = 0; j < noOfItems; j++){

        // get your each item info here

        var itemVal = currentRowItems.item(j).innerHTML;
        medicineAndDosageArr.push(itemVal);
      }
    }

    // Generate token
    const d = new Date();
    var day = d.getDate().toString();
    var month = d.getMonth().toString();
    var year = d.getYear().toString();
    var hr = d.getHours().toString();
    var min = d.getMinutes().toString();
    var sec = d.getSeconds().toString();
    var generatedToken = "Token_" + day + month + year + "_" + hr + min + sec;
    console.log(generatedToken);
    i = 0;
    var pname = document.getElementById('prescribeMDpidInput').value;
    console.log(pname);
    do {
      console.log(medicineAndDosageArr[i]);
      console.log(medicineAndDosageArr[i+1]);

      $.ajax({
        type: "GET",
        crossDomain:true,
        dataType:"json",
        url: "http://" + config.hostname + "/index.php/user/addPatientPrescription",
        data:({
          token : generatedToken,
          doctorusername : JSON.parse((localStorage.getItem("userobj"))).username,
          patientusername : pname,
          medicine : medicineAndDosageArr[i],
          dosage : medicineAndDosageArr[i+1]
        }),
        success: function(data, status, xhr)
        {
          console.log("add prescription successful")
        }
      });

      i = i+2;
    } while(i != medicineAndDosageArr.length);


    document.getElementById('outputLB').innerHTML = 'Prescription have been inserted into DB!';

    getPatientEmail(pname, generatedToken);

  }
  return false;
}
  



  

// Get Patient Email
function getPatientEmail($patientUsername, $tokenInput) {
  emailOutput = "";
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/getPatientEmail",
    data:({
      patientusername : $patientUsername,
    }),
    success: function(data, status, xhr)
    {
      emailOutput = data[0].email;
      sendEmail(emailOutput, $tokenInput, $patientUsername);
    }
  });
  return emailOutput;
}

// Send Email
function sendEmail($emailInput, $tokenInput, $patientusernameInput) {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/sendEmail",
    data:({
      email : $emailInput,
      token : $tokenInput,
      patientusername : $patientusernameInput,
    }),
    success: function(data, status, xhr)
    {
      console.log("Prescription Token sent successful")
    }
  });
  return false;
}


function addUser() {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/adminAddUser",
    data:({
      username : document.getElementById('addUserUN').value,
      password : document.getElementById('addUserPW').value,
      role : document.getElementById('addUserRole').value,
      email : document.getElementById('addUserEmail').value,
      phone : document.getElementById('addUserPhone').value
    }),
    success: function(data, status, xhr)
    {
      console.log("Add User successful");
      document.getElementById("addUserUN").value = "";
      document.getElementById("addUserPW").value = "";
      document.getElementById("addUserEmail").value = "";
      document.getElementById("addUserPhone").value = "";
    }
  });

  document.getElementById('addUserOutputLB').innerHTML = 'User have been inserted into DB!';
  return false;
}


function pharmacistViewPrescription() {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/pharmacistViewPrescription",
    data:({
      token : document.getElementById('pharmacistTokenInput').value,
    }),
    success: function(data, status, xhr)
    {
      var tableName = document.getElementById("pharmacistPrescriptionDisplay");
      var noOfRows = tableName.rows.length;
      for (let i = 0; i < noOfRows; i++) {
        tableName.removeChild(tableName.childNodes[0]);
      }

      for (let i = 0; i < data.length; i++) {
        var ppObj = {
          token: data[i].token,
          doctor_username: data[i].doctor_username,
          medicine: data[i].medicine,
          dosage: data[i].dosage,
          date: data[i].date,
        }

        var newTableRow = document.createElement("tr");

        for (let j in data[i]) {
          var newTableD = document.createElement("td"); // <td> node
          var prescriptionDataNode = document.createTextNode(data[i][j]); // patient prescription Data node
          newTableD.appendChild(prescriptionDataNode);
          newTableRow.appendChild(newTableD);
        }

        document.getElementById("pharmacistPrescriptionDisplay").appendChild(newTableRow);

      }
      document.getElementById("checkoutOutputLB").innerHTML = "";

      document.getElementById("checkoutBtn").style.display="block";
      document.getElementById("checkoutBtn").style.visibility="visible";

      document.getElementById("checkoutOutputLB").style.display="block";
      document.getElementById("checkoutOutputLB").style.visibility="visible";
    }
  });
  return false;
}

function updatePrescriptionStatus() {
  var tableName = document.getElementById("pharmacistPrescriptionDisplay");
  //console.log(tableName.rows[0].cells[5].innerHTML);
  if (tableName.rows[0].cells[5].innerHTML == "null") {
    $.ajax({
      type: "GET",
      crossDomain:true,
      dataType:"json",
      url: "http://" + config.hostname + "/index.php/user/pharmacistUpdatePrescriptionStatus",
      data:({
        token : document.getElementById("pharmacistTokenInput").value,
      }),
      success: function(data, status, xhr)
      {
          //document.getElementById("checkoutOutputLB").innerHTML = "Checkout Successful";
		  pharmacistViewPrescription();
      }
    });
  }

  else {
    document.getElementById("checkoutOutputLB").innerHTML = "Checkout Not Successful : Prescription have already been checkout!";
  }
  
  return false;
}

function addUserCheckTextField() {
  if ((document.getElementById("addUserUN").value == "") || (document.getElementById("addUserPW").value == "") || (document.getElementById("addUserEmail").value == "") || (document.getElementById("addUserPhone").value == "")) {
    document.getElementById('addUserOutputLB').innerHTML = 'Textbox cannot be empty!';
  }
  else {
    addUser();
  }
}


function deleteChecked() {
  arrRowChecked = [];
  var tableName = document.getElementById("previewPrescriptionDisplay");
  var noOfRows = tableName.rows.length;

  for (let i = 0; i < noOfRows; i++) {
    $('tr:has(input[type="checkbox"]:checked)').remove();
  }
}


function doctorViewPrescription(tokenID) {
  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/doctorViewPrescription",
    data:({
      docusername : JSON.parse((localStorage.getItem("userobj"))).username,
      token : tokenID,
    }),
    success: function(data, status, xhr)
    {
      var tableName = document.getElementById("doctorUpdatePrescriptionDisplay");
      var noOfRows = tableName.rows.length;
      for (let i = 0; i < noOfRows; i++) {
        tableName.removeChild(tableName.childNodes[0]);
      }

      for (let i = 0; i < data.length; i++) {
        var ppObj = {
          token: data[i].token,
          doctor_username: data[i].doctor_username,
          medicine: data[i].medicine,
          dosage: data[i].dosage,
          date: data[i].date,
          status: data[i].status,
        }

        var newTableRow = document.createElement("tr");

        for (let j in data[i]) {
          var newTableD = document.createElement("td"); // <td> node
          var prescriptionDataNode = document.createTextNode(data[i][j]); // patient prescription Data node
          newTableD.appendChild(prescriptionDataNode);
          newTableRow.appendChild(newTableD);
        }

        var newTableD2 = document.createElement("td");
        var btn = document.createElement('input');
        btn.type = "button";
        btn.className = "btn" + i;
        btn.value = "Click to Edit";
        btn.onclick = (function() {prescriptionEditBtn(i);});
        newTableD2.appendChild(btn);
        newTableRow.appendChild(newTableD2);

        document.getElementById("doctorUpdatePrescriptionDisplay").appendChild(newTableRow);
      }

      for (let i = 0; i < tableName.rows.length; i++) {
        if (tableName.rows[i].cells[5].innerHTML == "0") {
          tableName.rows[i].cells[5].innerHTML = "Medicine Not Collected";
        }
        else {
          tableName.rows[i].cells[6].firstChild.style.visibility = "hidden";
          tableName.rows[i].cells[5].innerHTML = "Medicine Collected";
        }
      }
    }
  });
  return false;
}


function prescriptionEditBtn(rowID) {
  var tableName = document.getElementById("doctorUpdatePrescriptionDisplay");
  var noOfRows = tableName.rows.length;
  document.getElementById("updatePrescriptionForm").style.display="block";
  document.getElementById("updatePrescriptionForm").style.visibility="visible";
  //console.log(rowID);
  console.log(tableName.rows[rowID].cells[2]);
  document.getElementById("currentMedicineName").innerHTML = tableName.rows[rowID].cells[2].innerHTML;
  document.getElementById("currentDosageValue").innerHTML = tableName.rows[rowID].cells[3].innerHTML;
}

function updatePrescriptionBtn() {
  if (document.getElementById("updateMedicineInput").value != "") {
    var med = document.getElementById("updateMedicineInput").value;
  }
  else {
    var med = document.getElementById("currentMedicineName").innerHTML;
  }

  if (document.getElementById("updateDosageInput").value != "") {
    var dos = document.getElementById("updateDosageInput").value;
  }
  else {
    var dos = document.getElementById("currentDosageValue").innerHTML;
  }

  $.ajax({
    type: "GET",
    crossDomain:true,
    dataType:"json",
    url: "http://" + config.hostname + "/index.php/user/doctorUpdatePrescription",
    data:({
      token : document.getElementById('doctorTokenInput').value,
      medicine : document.getElementById("currentMedicineName").innerHTML,
      dosage : document.getElementById("currentDosageValue").innerHTML,
      newmed : med,
      newdos : dos,
    }),
    success: function(data, status, xhr)
    {
      doctorViewPrescription(document.getElementById('doctorTokenInput').value);
      document.getElementById("updatePrescriptionForm").style.display = "none";
      document.getElementById("updatePrescriptionForm").style.visibility = "hidden";
      document.getElementById('updateMedicineInput').value = "";
      document.getElementById('updateDosageInput').value = "";

    }
  });
  return false;
}