const users =[]

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });


  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

addUser({
  id: 22,
  username: "Andrew  ",
  room: "South Philly",
});
addUser({
  id: 225,
  username: "sdfes  ",
  room: "South Philly",
});

addUser({
  id: 2258,
  username: "Andrew  ",
  room: "South",
});

console.log(users);

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};



const getUser = (id) => {
   const finder =  users.find(user => {if(user.id === id)return user })
   return finder 
}


const getUserInRoom = (room) => {
    room = room.trim().toLowerCase();
    const getroom =  users.filter(user => user.room === room)
    return getroom
}
console.log(getUserInRoom("south Philly"));

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}