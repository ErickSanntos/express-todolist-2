let check = document.getElementsByClassName("fa-check");
let cross = document.getElementsByClassName("fa-x");
let trash = document.getElementsByClassName('fa-trash')


Array.from(check).forEach(function (element) {
  element.addEventListener('click', function () {
    const li = element.closest('li');
    const name = li.querySelector('.item').innerText;
    const completed = li.classList.contains('strikethrough'); // Check if the 'strikethrough' class is present

    fetch('todo', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'completed': !completed // Toggle the completed value
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        if (data) {
          const item = li.querySelector('.item');
          item.classList.toggle('strikethrough'); // Toggle the strikethrough class
        }
      });
  });
});

Array.from(cross).forEach(function(element) {
  element.addEventListener('click', function(){
    const li = element.closest('li').querySelector('.item')
    const name = element.closest('li').querySelector('.item').innerText
    fetch('todo', { // false
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      li.classList.remove('strikethrough')
    })
  });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const li = element.closest('li')
        const name = this.parentNode.parentNode.childNodes[1].innerText
        fetch('todo', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
          })
        }).then(function (response) {
          li.remove()
        })
      });
})
