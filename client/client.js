    Accounts.ui.config({
      requestPermissions: {
        facebook: ['user_likes'],
        github: ['user', 'repo']
      }
    })

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
          this.setList('/'); // TODO to go to previous page
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
        Router.setList('/'); // TODO to go to previous page
      } 
    });

    Meteor.startup(function () {
      Backbone.history.start({pushState: true});
    });


    Template.footer.copyright = function() {
      return "Copyright © 2013 <a href='http://devthon.org' target='_blank'>Devthon</a>.";
    }

    Template.trackset.tracks = function() {
      return [
         { 
             "name" : "Web Hacks", 
             "description" : "Hacks around web frameworks on Python (Django, web2py, etc), \
                              PHP (Codeigniter, Yii, Drupal, etc), Javascript (Node.js, meteorjs, etc) \
                              or any other framework you can think of!",
             "link" : "web"
         },
         {
             "name" : "Mobile Hacks",
             "description" : "Project ideas and hacks using mobile operating systems like \
                              Android and iOS or mobile development frameworks like Phonegap, Sencha, Kivy, etc",
             "link": "mobile"
         },
         {
             "name" : "Hardware hacks",
             "description" : "Get involved in awesome hardware hacks using Leap Motion, \
                              Arduino, Raspberry Pi or any hardware. You can get your own hardware too!",
             "link" : "hardware"
         }
       ]
    }

    Template.proposalNewForm.boxWidth = "span9";

    Template.proposalNewForm.events({
      'click #submitProposal': function(event) {
        event.preventDefault();
        $('.alert').alert('close');
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
        Router.setList('/'); // TODO to go to previous page
      },
      'focus input': function(evt) {
        $(evt.target).parents('.control-group').removeClass('error');
      },
      'focus textarea': function(evt) {
        $(evt.target).parents('.control-group').removeClass('error');
      }
    });

    Template.trackbox.events({
      'click a': function(event) {
        console.log(this.link);
      }
    });

    Template.proposals.hacks = function() {
      return Proposals.find();
    }

    Template.proposals.events({
      'click #proposalRemove': function(evt) {
        console.log('deleted');
      },
      'click #vote': function(evt) {
        console.log('upvote');
      },
      'click .join_yes': function(evt) {
        Meteor.call("joinProposal", {
          proposalId: this._id,
        }, function(error, result) {
             if (error) {
               switch (error.error) {
               case 409:
                 $(evt.target).removeClass("join_yes").addClass("join_no");
                 $(evt.target).click();
                 break;
               };
             }
           });
       },
      'click .join_no': function(evt) {
        Meteor.call("unjoinProposal", {
          proposalId: this._id,
        }, function(error, result) {
             if (error) {
               $(evt.target).removeClass("join_no").addClass("join_yes");
               $(evt.target).click();
               return;
             }
           });
       }
    });

    Template.proposal.proposal = function() {
      var id = Session.get('proposal_id');
      return Proposals.findOne({ _id : id });
    }

    Template.proposals.count = function() {
      return !!Proposals.findOne();
    }

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

