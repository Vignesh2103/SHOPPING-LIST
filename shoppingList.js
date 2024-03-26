const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearAllBtn = document.getElementById("clear");
const filter = document.getElementById("filter");
const formBtn = document.getElementById("form-btn");
let isEditMode = false;

//Add A Item
const addItemToList = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;
  if (newItem === "") {
    alert("Please add an item");
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");
    removeItemFromDOM(itemToEdit);
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit-mode");
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkItemExists(newItem)) {
      alert("That item already exists!");
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();
};

//Add Item to DOM
const addItemToDOM = (item) => {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item));
  const button = createButton("remove-item btn-link text-red");
  li.appendChild(button);
  itemList.appendChild(li);
  console.log(li);
};

//createButton
const createButton = (classes) => {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
};

//createIcon
const createIcon = (classes) => {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
};

//Add Item to Local Storage
const addItemToStorage = (item) => {
  const itemFromStorage = getItemFromStorage();

  itemFromStorage.push(item);

  localStorage.setItem("items", JSON.stringify(itemFromStorage));
};

//check item Already Exist in LocalStorage
const checkItemExists = (item) => {
  const itemFromStorage = getItemFromStorage();
  return itemFromStorage.includes(item);
};

const getItemFromStorage = () => {
  let itemFromStorage;
  if (localStorage.getItem("items") === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem("items"));
  }
  return itemFromStorage;
};

//display Items form local storage
document.addEventListener("DOMContentLoaded", () => {
  const itemFromStorage = getItemFromStorage();
  itemFromStorage.forEach((item) => addItemToDOM(item));
});

//remove Item
const removeItem = (e) => {
  if (e.target.parentElement.classList.contains("remove-item")) {
    removeItemFromDOM(e.target.parentElement.parentElement);
    removeItemFromStorage(e.target.parentElement.parentElement.textContent);
    checkUI();
  } else {
    setItemToEdit(e.target);
  }
};

//remove Item from DOM
const removeItemFromDOM = (item) => {
  item.remove();
};

//Remove Item Form Local Storage
const removeItemFromStorage = (item) => {
  let itemFromStorage = getItemFromStorage();

  itemFromStorage = itemFromStorage.filter((i) => i !== item);

  localStorage.setItem("items", JSON.stringify(itemFromStorage));
};

//set Item To Edit Field
const setItemToEdit = (editItem) => {
  console.log(editItem);
  //set isEditMode to true
  isEditMode = true;

  //set item to edit
  itemList
    .querySelectorAll("li")
    .forEach((i) => i.classList.remove("edit-mode"));

  //set edit item
  editItem.classList.add("edit-mode");

  //set form btn inner text
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';

  //set form btn color
  formBtn.style.backgroundColor = "#228B22";

  //set input value
  itemInput.value = editItem.textContent;
};

//Remove All Item
const removeAllItem = () => {
  if (confirm("Are you sure you want to delete all items?")) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }
  }
  //Remove All Items from Local Storage
  removeAllItemsFromStorage();
  checkUI();
};

// Remove All Items from Local Storage
const removeAllItemsFromStorage = () => {
  localStorage.removeItem("items");
};

// check UI
const checkUI = () => {
  itemInput.value = "";
  const items = itemList.querySelectorAll("li");
  const clearAllBtn = document.getElementById("clear");
  const filterItem = document.getElementById("filter");
  if (items.length === 0) {
    clearAllBtn.style.display = "none";
    filterItem.style.display = "none";
  } else {
    clearAllBtn.style.display = "block";
    filterItem.style.display = "block";
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = "#333";
  isEditMode = false;
};

//filterItems
const filterItem = (e) => {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    if (itemName.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

checkUI();

//EventListener methods
itemForm.addEventListener("submit", addItemToList);
itemList.addEventListener("click", removeItem);
clearAllBtn.addEventListener("click", removeAllItem);
filter.addEventListener("input", filterItem);
