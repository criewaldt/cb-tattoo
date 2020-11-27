$( document ).ready(function() {
      $.get("/tats", function(data, status){
  
      data.color.forEach(function (item, index) {
        var myTats = document.getElementById("myTats");
        var portfolio = document.createElement("div");
          portfolio.setAttribute("class", "col-lg-4 col-md-6 portfolio-item filter-color");
        var image = document.createElement("img");
          image.setAttribute("src", "tattoos/color/"+item);
          image.setAttribute("class", "img-fluid");
        myTats.appendChild(portfolio);
        portfolio.appendChild(image);
      });
      
      data.bw.forEach(function (item, index) {
        var myTats = document.getElementById("myTats");
        var portfolio = document.createElement("div");
          portfolio.setAttribute("class", "col-lg-4 col-md-6 portfolio-item filter-bw");
        var image = document.createElement("img");
          image.setAttribute("src", "tattoos/bw/"+item);
          image.setAttribute("class", "img-fluid");
        myTats.appendChild(portfolio);
        portfolio.appendChild(image);
      });
      
    });


});

