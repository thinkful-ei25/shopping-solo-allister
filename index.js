// 1. Must be able to see current shopping list
// 2. Must be able to add items
// 3. Check and cross off completed items
// 4. Delete items


'use strict';

const STORE = {
	items: [
		{
			name: 'apples',
			checked: false
		},
		{
			name: 'oranges',
			checked: false
		},
		{
			name: 'milk',
			checked: true
		},
		{
			name: 'bread',
			checked: false
		}
	],
	hidden: false,
	searchTerm: null,
	searchMatches: []


};

function generateItemElement(item) {
	let itemIndex = STORE.items.indexOf(item);
	return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
	
	  <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
		</button>
		<button class="shopping-item-save js-item-save">
			<span class="button-label">save</span>
		</button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
	// takes in argument shoppingList
	console.log('Generating shopping list element');
	const items = shoppingList.map((item, index) => generateItemElement(item, index));

	return items.join('');
}

function renderShoppingList() {
	console.log('\'renderShoppingList\' ran');
	// Responsible for displaying shopping list in DOM
	// Places all shopping items in <ul class="shopping-list js-shopping-list"> 
	// Joing these together as one long string
	// insert <li> string inside of the the .js-shopping-list <ul> in the dom

	let items = STORE.items.slice();
	if (STORE.hidden) {
		items = items.filter(item => !item.checked);

	}
	if (STORE.searchTerm) {
		items = STORE.searchMatches;
		if (STORE.hidden) {
			items = items.filter(item => !item.checked);
		}
	}





	const shoppingListItemString = generateShoppingItemsString(items);

	//places shoppingListItemString into the Shopping List <ul>
	$('.js-shopping-list').html(shoppingListItemString);

}


function addItemShoppingList(newItem) {
	STORE.items.push({ name: newItem, checked: false });


}


function handleNewItems() {
	//responsible for handling when users add new items
	// Listen for when users submit new list item
	// Take in name of text input form and clear item input from form
	// Add item to STORE.items as a new object. Name = val() Checked: False
	// Re-Render the list with new STORE.items update.
	$('#js-shopping-list-form').submit(function (event) {
		event.preventDefault();
		const newItem = $('.js-shopping-list-entry').val();
		$('.js-shopping-list-entry').val('');
		addItemShoppingList(newItem);
		renderShoppingList();
	});

}

function getItemIndexFromElement(item) {
	const itemIndexString = $(item).closest('.js-item-index-element').attr('data-item-index')
	console.log(itemIndexString);
	console.log($(item).closest('.shopping-item-controls').prev().text());


	return parseInt(itemIndexString, 10);
}

function crossCheckedItems(itemIndex) {
	STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function handleCheckedItems() {
	//responsible for handling when users mark an item as checked
	//Listen for 'check' click
	//Retrieve item index in STORE.items from data attribute
	//Toggle checked property for item at index
	//Re-render

	$('.js-shopping-list').on('click', '.js-item-toggle', function (event) {
		const itemIndex = getItemIndexFromElement(event.currentTarget);
		crossCheckedItems(itemIndex);
		renderShoppingList();
		console.log(event.target);
	});
	console.log('\'handleCheckedItems\' ran');
}

function deleteItemFromSTORE(itemIndex) {
	STORE.items.splice(itemIndex, 1);
}

function handleDeletedItems() {
	// responsible for deleting items
	//Listen for "delete" click .shopping-item-delete
	//retrive the index of the item we want to delete from data attribute - used getItemIndexFromElement function
	//Remove from STORE.items object with splice - needs new function
	//Re-Render
	$('.js-shopping-list').on('click', '.js-item-delete', function (event) {
		const itemIndex = getItemIndexFromElement(event.currentTarget);
		deleteItemFromSTORE(itemIndex);
		renderShoppingList();

	});
	console.log('\'handleDeletedItems\' ran');
}

//function hideItems() {
//	if (STORE.hidden) {
//		STORE.filteredItems = STORE.items.slice().filter(item => !item.checked);
//		console.log(STORE.filteredItems);




function handleHideItems() {
	$('.hide-items').on('click', function () {
		STORE.hidden = !STORE.hidden;
		renderShoppingList();

		//index issue, incorrect functionality
	})
}




function search() {
	STORE.searchTerm = $('.js-search-box').val();
	console.log(STORE.searchTerm);
	STORE.searchMatches = [];
	for (let obj of STORE.items) {
		if (obj.name.includes(STORE.searchTerm)) {
			STORE.searchMatches.push(obj);
			console.log(STORE.searchMatches);
		}

	}


	console.log('');
}



function handleSearch() {
	$('.js-search-box').on('keyup', function () {
		search();
		renderShoppingList();

	});
}

function handleSearchButton() {
	$('.js-search-form').submit(function (event) {
		event.preventDefault();
	});
}





function handleEdit() {
	$('.js-shopping-list').on('click', '.js-shopping-item', function (event) {
		$(event.target).attr('contenteditable', 'true');
		handleEditSubmit()

	});

}

function handleEditSubmit() {
	$('.js-shopping-list').on('click', '.js-item-save', function (event) {
		const itemIndex = getItemIndexFromElement(event.target);
		const editedItem = $(event.target).closest('div').prev().text();
		console.log(editedItem);
		STORE.items[itemIndex].name = editedItem;

		renderShoppingList();

	})
};





function handleShoppingList() {
	// Calls all other functions to load when document ready
	renderShoppingList();
	handleNewItems();
	handleCheckedItems();
	handleDeletedItems();
	handleHideItems();
	handleSearch();
	handleEdit();
	handleSearchButton();
}

$(handleShoppingList);

