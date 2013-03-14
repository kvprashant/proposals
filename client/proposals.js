    Template.proposal.proposal = function() {
      var doc = Proposals.findOne({ _id : Session.get('proposal_id') });
      if (doc) {
        document.title = doc.title + " - Devthon Proposals";
        return Proposals.findOne({ _id : Session.get('proposal_id') });
      }
    }

    Template.comment.format = function() {
      return moment(this.timestamp).format("dddd, MMMM Do YYYY, h:mm a");
    }

    Template.comment.ago = function() {
      return moment(this.timestamp).fromNow();
    }

    Template.comment.owner = function() {
      return this.user == Meteor.userId();
    }

    Template.comment.events({
      'click button.delete': function(event) {
        event.preventDefault();
        Meteor.call("deleteComment", {
             'proposalId': Session.get('proposal_id'),
             'commentId': this.commentId,
             'user': this.user
          }, function(error, result) {
               console.log(error);
               console.log(result);
          });
      },
      'mouseenter .media.comment': function(event) {
        $(event.currentTarget).find('.delete').css('display', 'block');
      },
      'mouseleave .media.comment': function(event) {
        $(event.currentTarget).find('.delete').css('display', 'none');
      }
    });

    Template.commentNewForm.events({
      'click button#submitComment': function(event) {
        event.preventDefault();
        var timestamp = new Date();
        var comment = document.getElementById("comment").value;
        document.getElementById("comment").value = "";

        if (comment.length && Meteor.userId()) {
          Meteor.call ("createComment", {
              proposalId: this._id,
              commentId: new Meteor.Collection.ObjectID()._str,
              text: comment,
              timestamp: timestamp
            }, function(error, result){
          });
        }
      },
      'keydown textarea#comment': function(event) {
        if (event.keyCode == 13 ) {
          event.preventDefault();
          document.getElementById('submitComment').click();
        }
      }
    })
