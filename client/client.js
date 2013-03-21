    var settings = {
      maxTitle : 45,
      maxSummary : 200
    }

    var PAGE_ID = "page_id";

    var ProposalsRouter = Backbone.Router.extend({
      routes: {
        "" : "main", 
        "proposal/new" : "proposalNew",
        "proposal/:id" : "proposalView"
      },
      main: function() {
        Session.set('page_id', 'main');
      },
      proposalNew: function() {
        if(Meteor.userId() == null) {
          //need to go to previous page yo!
          this.setList('/'); 
        } else {
          Session.set('page_id', 'proposalNew');
        }
      },
      proposalView: function(id) {
        Session.set('proposal_id', id);
        Session.set('page_id', 'proposalView');
      },
      setList: function (id) {
        this.navigate(id, true);
      }
    });

    Router = new ProposalsRouter;

    Meteor.autorun(function () { 
      if (Meteor.userId()) {
        return;
      } else {
        Router.setList(Backbone.history.fragment); 
      } 
    });

    Meteor.startup(function () {
      Backbone.history.start({pushState: true});
    });


    Template.footer.copyright = function() {
      return "Copyright © 2013 <a href='http://devthon.org' target='_blank'>Devthon</a>.";
    }

    Template.proposalNewForm.rendered = function() {
      _.each(document.getElementsByClassName('counter'), function(element) {
        element.style.display = "none";
      })
    }

    Template.proposalNewForm.titleCount = function() {
      return settings.maxTitle;
    }

    Template.proposalNewForm.summaryCount = function() {
      return settings.maxSummary;
    }

    Template.proposalNewForm.boxWidth = "span9";

    Template.proposalNewForm.events({
      'blur #title': function() {
        document.getElementById('titleCountHolder').style.display = "none";
      },
      'focus #title': function() {
        document.getElementById('titleCountHolder').style.display = "block";
      },
      'blur #description': function() {
        document.getElementById('summaryCountHolder').style.display = "none";
      },
      'focus #description': function() {
        document.getElementById('summaryCountHolder').style.display = "block";
      },
      'keyup #title': function(event) {
        var counter = settings.maxTitle - event.currentTarget.value.length;

        if (counter <= 8) {
          document.getElementById('titleCountHolder').style.color = "orange";
        }

        if (counter <= 0) {
          document.getElementById('titleCountHolder').style.color = "red";
        }

        if (counter > 5) {
          document.getElementById('titleCountHolder').style.color = "black";
        }

        document.getElementById('titleCount').textContent = counter;
      },
      'keyup #description': function(event) {
        var counter = settings.maxSummary - event.currentTarget.value.length;

        if (counter <= 25) {
          document.getElementById('summaryCountHolder').style.color = "orange";
        }

        if (counter <= 0) {
          document.getElementById('summaryCountHolder').style.color = "red";
        }

        if (counter > 25) {
          document.getElementById('summaryCountHolder').style.color = "black";
        }

        document.getElementById('summaryCount').textContent = counter;
      },
      'click #submitProposal': function(event) {
        event.preventDefault();

        var errors = false;
        $('.alert').alert('close');

        if (document.getElementById("title").value.length > 50) {
          errors = true;
          $('.control-group-title').addClass('error')
                                   .find('.help-inline')
                                   .text("Too many characters here. Keep it simple silly!");
        }

        if (document.getElementById("description").value.length > 200) {
          errors = true;
          $('.control-group-description').addClass('error')
                                   .find('.help-inline')
                                   .text("Too many characters here. Keep it simple silly!");
        }

        if (errors) {
          showAlert("error", "Uh-oh!", "Let's clear those errors shall we?");
          return false;
        }

        var tracks = {"option1" : "web", "option2" : "mobile", "option3" : "hardware" };
        var choice = $('input[type=radio]:checked').val();

        var title = document.getElementById('title').value;
        var track = tracks[choice];
        var description = document.getElementById('description').value;
        var requirements = document.getElementById('requirements').value;
        var userId = Meteor.userId();
        var user = Meteor.user().profile.name;

        if (title.length && description.length && 
            !!track && userId.length && user.length) { // check parameters
          Meteor.call("createProposal", {
            title: title,
            track: track,
            description: description,
            requirements: requirements,
            userId: userId,
            name: user
          }, function(error, html) { // handle them all
               if (error) {
                 switch(error.error) {
                 case 400:
                   showAlert("error", "Uh-oh!", "Looks like you haven't entered the title or the description.");
                   break;
                 case 401:
                   showAlert("error", "Uh-oh!", error.reason);
                   Meteor.logout();
                   Router.setList('/');
                   break;
                 case 413:
                   showAlert("error", "Uh-oh!", error.reason);
                 }
               } else {
                 Router.setList('proposal/done');
                 Session.set('page_id', 'proposalFilled');
               }
          });
        } else {
          if (!title.length) {
            $('.control-group-title').addClass('error');
          }
          if (!description.length) {
            $('.control-group-description').addClass('error');
          }
          if (!track) {
            $('.control-group-tracks').addClass('error');
          }
          showAlert("error", "Oops!", "Hack proposals require Title, Description and Hack Track.");
        }

      },
      'click #cancelSubmitProposal': function(event) {
        Router.setList(Backbone.history.fragment);
      },
      'focus, click input': function(evt) {
        $(evt.target).parents('.control-group').removeClass('error').find('.help-inline').text("");
      },
      'focus textarea': function(evt) {
        $(evt.target).parents('.control-group').removeClass('error').find('.help-inline').text("");
      }
    });

    Template.setup.created = function() {
      if (!(window._gaq != null)) {
        window._gaq = [];
        _gaq.push(['_setAccount', 'UA-38480319-2']);
        _gaq.push(['_trackPageview']);
        return (function() {
          var ga, gajs, s;
          ga = document.createElement('script');
          ga.type = 'text/javascript';
          ga.async = true;
          gajs = '.google-analytics.com/ga.js';
          ga.src = document.location.protocol === 'https:' ? 'https://ssl' + gajs : 'https://www' + gajs;
          s = document.getElementsByTagName('script')[0];
          return s.parentNode.insertBefore(ga, s);
        })();
      }
    };

    function showAlert(type, title, message) {
         $(".alert-container").html('<div class="alert fade alert-' + type + '"> \
                                       <button type="button" class="close" \
                                               data-dismiss="alert">&times;</button>\
                                       <strong>' + title + '</strong> ' + message + '</div>');
         $(".alert").addClass("in");
    }
