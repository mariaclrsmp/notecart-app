let lists = [];

export function getLists() {
  return lists;
}

export function setLists(newLists) {
  lists = newLists;
}

export function addList(list) {
  lists.push(list);
  return list;
}

export function updateList(id, updatedData) {
  const index = lists.findIndex(l => l.id === id);
  if (index === -1) return null;
  
  lists[index] = { ...lists[index], ...updatedData };
  return lists[index];
}

export function deleteList(id) {
  const index = lists.findIndex(l => l.id === id);
  if (index === -1) return null;
  
  const deletedList = lists[index];
  lists.splice(index, 1);
  return deletedList;
}

export function findListById(id) {
  return lists.find(l => l.id === id);
}
