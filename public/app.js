// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    if (i % 2 != 0) {
      $("#articles").append("<div class='panel panel-default'><div class='panel-heading'> <h3 class='panel-title' data-id='" + data[i]._id + "' >" + data[i].title  + "</h3></div><div class='panel-body'><p><a href='"+ data[i].link +"' target='_blank'>Click here for article</a></p></div></div>");
    } else {
      $("#articles2").append("<div class='panel panel-default'><div class='panel-heading'> <h3 class='panel-title' data-id='" + data[i]._id + "' >" + data[i].title  + "</h3> </div> <div class='panel-body'><p> <a href='" + data[i].link +  "' target='_blank'>Click here for article</a></p></div></div>");
    } 
  }
});

// Whenever someone clicks a p tag
$(document).on("click", "h3", function() {
  // Empty the notes from the note section
  $("#notesTitle").empty();
  $(".notes").empty();
   $(".modal-footer").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notesTitle").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $(".notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $(".notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $(".modal-footer").append("<button data-id='" + data._id + "' id='savenote' class='btn btn-primary' data-dismiss='modal'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
      $('#myModal').modal('show') 
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});