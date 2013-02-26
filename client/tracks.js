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

