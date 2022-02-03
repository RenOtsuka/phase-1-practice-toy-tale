let addToy = false;

document.addEventListener("DOMContentLoaded", () => {

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    }else{
      toyFormContainer.style.display = "none";
    }
  });

  getToys();

  const form = toyFormContainer.querySelector('.add-toy-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let toyName = Array.from(document.getElementsByClassName('input-text'))[0].value;
    let toyImg = Array.from(document.getElementsByClassName('input-text'))[1].value;
    addNewToy(toyName, toyImg);
    toyName = '';
    toyImg = '';
  });

});


function getToys(){
  fetch(`http://localhost:3000/toys`)
  .then(resp => resp.json())
  .then(obj => loadToys(obj));
}

function loadToys(toyObj){
  const toyCollection = document.getElementById('toy-collection');
  toyCollection.textContent = '';

  for(let key in toyObj){
    let toy = createToy(toyObj[key]);
    toyCollection.appendChild(toy);
  }
}

function createToy(toyObj){
  const divToyCard = document.createElement('div');
  divToyCard.className = 'card';
  divToyCard.textContent = '';

  const toyName = document.createElement('h2');
  toyName.textContent = toyObj.name;

  const toyImg = document.createElement('img');
  toyImg.setAttribute('src', toyObj.image);
  toyImg.className = 'toy-avatar';

  const toyLikes = document.createElement('p');
  toyLikes.textContent = `${toyObj.likes} Like(s)`;

  const toyLikeBtn = document.createElement('button');
  toyLikeBtn.className = 'like-btn';
  toyLikeBtn.id = toyObj.id;
  toyLikeBtn.innerText = `Like ❤️`;

  divToyCard.appendChild(toyName);
  divToyCard.appendChild(toyImg);
  divToyCard.appendChild(toyLikes);
  divToyCard.appendChild(toyLikeBtn);

  toyLikeBtn.addEventListener('click', () => updateLikes(toyObj));


  return divToyCard;
}

function addNewToy(toyName, toyImg){
  fetch(`http://localhost:3000/toys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: toyName,
      image: toyImg,
      likes: 0,
    })
  })
  .then(resp => resp.json())
  .then(() => getToys());
}

function updateLikes(toyObj){
  let newLikes = ++toyObj.likes;

  fetch(`http://localhost:3000/toys/${toyObj.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      likes: newLikes,
    })
  })
  .then(resp => resp.json())
  .then(() => getToys());
}
