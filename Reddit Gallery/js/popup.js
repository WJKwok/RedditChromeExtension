var reddits = ["Art"];
var exists = localStorage.getItem('redditList');
if(exists) {
    reddits = JSON.parse(exists);
}

function saveList() {
  localStorage.setItem('redditList', JSON.stringify(reddits));   // store it as string
  reddits = JSON.parse( localStorage.getItem('redditList'));     //  convert it to object
}

$('#tags').tagsinput({
  confirmKeys: [13, 32]
});

$.each(reddits, function(index, value) { //prefill from array
  $('#tags').tagsinput('add', value);
  console.log(index, value);
});

$('input').on('itemAdded', function(event) { //when tag added, save it to array
  //var sub = String(event.item);
  //sub = sub.replace(/\s/g, '');
  reddits.push(event.item);
  console.log(reddits);
  saveList();
});

$('input').on('itemRemoved', function(event) { //when axed out, remove from array and save
  reddits.splice(reddits.indexOf(event.item), 1); //this is how you remove an array in javacript -.-||
  console.log(reddits);
  saveList();
});
