// Node server which will handle socket io connections
const io = require('socket.io')(8000)

const users = {}

io.on('connection', socket =>{
    // if any new user joins, let other users connected to the server know
    socket.on('new-user-joined', name =>{
        users[socket.id] = name
        socket.broadcast.emit("user-joined", name) // will tell others that this user has joined the chat
    })

    // if someone sends a message, broadcast it to others
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    })

    // if someone leaves the chat, let others know
    socket.on('disconnect', message =>{ // disconnect is a built-in event
        socket.broadcast.emit('leave', users[socket.id])
        delete users[socket.id]
    })
})