    Template.trackset.count = function() {
      return !!Proposals.findOne();
    }

    Template.trackset.tracks = function() {
      return Proposals.find();
    }

    Template.trackbox.events({
      'click a': function(event) {
        if (event.currentTarget.getAttribute("class") == "thumbnail selected") {
          Session.set("selected", "");
          event.currentTarget.setAttribute("class", "thumbnail");
        } else {
          Session.set("selected", this._id);
          event.currentTarget.setAttribute("class", "thumbnail selected");
        }
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
          owner: this.userId
        }, function(error, result) {
             if (error) {
               switch (error.error) {
               case 403:
                 $(evt.target).removeClass("join_no").removeClass("join_yes");
                 break;
               default:
                 $(evt.target).removeClass("join_no").addClass("join_yes");
                 $(evt.target).click();
                 break;
               }
               return;
             }
           });
       }
    });

    Template.trackset.verticals = function() {
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
