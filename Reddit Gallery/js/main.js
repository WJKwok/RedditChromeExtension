function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// if links exist, reformat, make them clickable and return
function linksCleanUp(comment) {
  var regExp = /\[(.*?)\]\(([^\)]+)\)/g;
  var cleanComment = comment;
  while ((matches = regExp.exec(comment)) != null) {
    var replace = `<a href="${matches[2]}">${matches[1]}</a>`;
    cleanComment = cleanComment.replace(matches[0], replace);
  }
  return cleanComment
}

function getTopComment(permalink) {
	var fullLink = "https://www.reddit.com" + permalink + ".json?sort=top";
  var jsondata = $.getJSON(fullLink, function foo(result) {
  	var rawComment;
    var rawSelfText;

     //if selftext is not empty
    if (result[0].data.children[0].data.selftext.length > 0) {
      rawSelfText = result[0].data.children[0].data.selftext
      var cleanSelfText = linksCleanUp(rawSelfText);
      $("#text").append('<h5>' + cleanSelfText + '</h5>');
    }

    //if stickied comment exists, skip
    if (result[1].data.children[0].data.stickied) {
    	rawComment = result[1].data.children[1].data.body;
    } else {
    	rawComment = result[1].data.children[0].data.body;
    }

    var cleanComment = linksCleanUp(rawComment);
    $("#text").append('<p>' + cleanComment + '</p>');

  });
}

function fetchPost(sub) {
	var subreddit = "https://www.reddit.com/r/"+ sub +"/hot.json"
	$.getJSON(subreddit, function (result) {
		var x = Math.floor((Math.random() * 10));
  	var post = result.data.children[x].data;

    //Skip if post is created by moderator
    if ((post.distinguished == "moderator") || (post.crosspost_parent_list) || (post.stickied)) {
    	fetchPost(sub);
    } else {
			var urlCanDisplay = checkURL(post.url);
			var headerLink = "https://www.reddit.com"+ post.permalink;
    	$("#text").append('<h4><a href="' + headerLink + '">' + post.title + ` (r/${sub})` + '</a></h4>');
      getTopComment(post.permalink);
			if (urlCanDisplay) {
				$("#art").append('<img id="img" src="' + post.url + '"/>');
			} else {
        try {
        	$("#art").append('<video id="img" controls autoplay loop><source src="' + post.preview.reddit_video_preview.fallback_url + '"></video>');
        } catch(err) {
          try {
            $("#art").append('<video id="img" controls autoplay loop><source src="' + post.media.reddit_video.fallback_url + '"></video>');
          } catch(err) {
            console.log("No video media, here's a link");
            $("#art").append('<p id="link"><a href="' + post.url + '">' + post.url + '</a></p>');
          }
        }
      }
    }
	})
  .fail(function() { // if sub that user has added does not exist
    alert('The subreddit "' + sub + '" does not exist. You might have misspelled it. We have removed it from your list.');
    reddits.splice(reddits.indexOf(sub), 1);
    saveList();
    fetchPost("Art");
  });
}

function run() {
  var testLink = "https://www.reddit.com/.json";
  $.getJSON(testLink, function () {
  })
  .done(function() {
    // in case list is empty, add default "art"
    if (reddits.length < 1) {
      reddits.push("Art");
      saveList();
      fetchPost("Art");
    } else { // use user's list if exists
      var item = reddits[Math.floor(Math.random()*reddits.length)];
      fetchPost(item);
    }
  })
  .fail(function() { // Check if internet working
    $("#internetFail").append('<p>Oh no, amigo! There\'s no internet :(</p>');
  })
}

run()
