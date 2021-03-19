$(document).ready(function(){
   var email;
   $("#emailForm").submit(function(){
      var myEmail = $("#myEmail").val();
      var myName = $("#myName").val();
      var myPhone = $("#myPhone").val();
      alert("Thank you for contacting ResilienceFitness.net");
      
     $.post("/email",{email: myEmail, name: myName, phone: myPhone}, function(data){
         alert("Thank you for contacting ResilienceFitness.net");
       
     });
   });
});