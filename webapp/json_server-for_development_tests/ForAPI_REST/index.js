const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3010;

server.use(middlewares);
server.use(router);

console.log(process.env);

server.listen(port, () => {
  console.log(`server started on port ${port}`);
});
