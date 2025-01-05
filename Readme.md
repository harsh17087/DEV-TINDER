## Table of Contents

- Introduction
- Routes
- Query Parameters
- Dynamic Parameters
- Middleware and Handlers
- Server
- Notes

## Routes

### GET /user

This route handles GET requests to `/user` and responds with a JSON object containing user information.

```javascript
app.get("/user", (req, res) => {
  res.send({ name: "John", age: 30 });
});
```

### USE /test

This route matches all HTTP methods for requests to `/test` and responds with a message.

```javascript
app.use("/test", (req, res) => {
  res.send("Responding from test route");
});
```

### USE /home

This route matches all HTTP methods for requests to `/home` and responds with a message.

```javascript
app.use("/home", (req, res) => {
  res.send("Responding from home route");
});
```

### USE /

This route matches all HTTP methods for requests to `/` (root) and responds with a message.

```javascript
app.use("/", (req, res) => {
  res.send("Responding from root route");
});
```

### GET /ab?c

This route matches requests to `/ab` and `/abc`, where `b` is optional.

```javascript
app.get("/ab?c", (req, res) => {
  res.send("b is optional");
});
```

### GET /ab+c

This route matches requests to `/abc`, `/abbc`, `/abbbc`, etc., where `b` can be repeated.

```javascript
app.get("/ab+c", (req, res) => {
  res.send("b can be repeated");
});
```

### GET /ab\*cd

This route matches requests to `/abcd`, `/abbbbbbh24t63ecd`, etc., where anything can be between `ab` and `cd`.

```javascript
app.get("/ab*cd", (req, res) => {
  res.send("starts with ab, ends with cd, anything in between is accepted");
});
```

## Query Parameters

To handle query parameters, use the following route. Example: `http://localhost:7777/user?name=John&age=30`

```javascript
app.get("/user", (req, res) => {
  console.log(req.query); // { name: 'John', age: '30' }
  res.send(req.query);
});
```

## Dynamic Parameters

To handle dynamic parameters, use the following route. Example: `http://localhost:7777/user/John/30`

```javascript
app.get("/user/:name/:age", (req, res) => {
  console.log(req.params); // { name: 'John', age: '30' }
  res.send(req.params);
});
```

## Middleware and Handlers

### No Response Sent

If a request is not handled and no response is sent, the request will keep waiting and eventually timeout.

```javascript
app.use("/test", (req, res) => {
  // no response sent
});
```

### Using `next()` to Pass Request

You can use `next()` to pass the request to the next route handler. Multiple handlers can be used.

```javascript
app.use(
  "/test",
  (req, res, next) => {
    console.log("First handler");
    next();
  },
  (req, res) => {
    console.log("Second handler");
    res.send("Response from second handler");
  }
);
```

OR multiple route handlers can be used separately also like this...

```javascript
app.get("/test", (req, res, next) => {
  console.log("First handler");
  next();
});
app.get("/test", (req, res) => {
  console.log("Second handler");
  res.send("Response from second handler");
});
```

### Error: Cannot Set Headers After They Are Sent

If a response is sent in the first handler and `next()` is called, an error will be thrown because you cannot send a response after headers are sent.

```javascript
app.use(
  "/test",
  (req, res, next) => {
    console.log("First handler");
    res.send("Response from first handler");
    next();
  },
  (req, res) => {
    console.log("Second handler");
    res.send("Response from second handler");
  }
);
```

### Response Sent from Second Handler

If `next()` is called before sending the response in the first handler, the second handler will send the response and code will execute according to JS call stack.

```javascript
app.use(
  "/test",
  (req, res, next) => {
    console.log("First handler");
    next();
    res.send("Response from first handler");
  },
  (req, res) => {
    console.log("Second handler");
    res.send("Response from second handler");
  }
);
```

### No Further Handlers

If `next()` is called and there are no further handlers, an error will be thrown saying cannot GET /test.

```javascript
app.use(
  "/test",
  (req, res, next) => {
    console.log("First handler");
    next();
  },
  (req, res, next) => {
    console.log("Second handler");
    next();
  },
  (req, res, next) => {
    console.log("Third handler");
    next();
  },
  (req, res, next) => {
    console.log("Fourth handler");
    next();
  }
);
```

### Wrapping Handlers in an Array

You can wrap any combination of handlers in an array.

```javascript
app.use("/test", [
  (req, res, next) => {
    console.log("First handler");
    next();
  },
  (req, res) => {
    console.log("Second handler");
    res.send("Response from second handler");
  },
]);
```

### Middlewares for Authorization

Suppose we want to first check authentication before serving any request, so instead of
adding the check in each route, we can add a middleware that will check for authentication

for example,

```javascript
app.get("/admin/getAllData", (req, res) => {
  // logic to check authentication
  const token = "xyz";
  const isAdminAuthorzed = token === "xyz";
  if (isAdminAuthorzed) {
    res.send("Admin data");
  } else {
    res.status(401).send("Unauthorized");
  }
});
app.get("/admin/deleteData", (req, res) => {
  // logic to check authentication
  const token = "xyz";
  const isAdminAuthorzed = token === "xyz";
  if (isAdminAuthorzed) {
    res.send("Admin data deleted");
  } else {
    res.status(401).send("Unauthorized");
  }
});
```

Instead of adding the same logic in each route, we can create a middleware that will check for authentication and then call next() to move to the next middleware or route handler.

```javascript
app.use("/admin", (req, res, next) => {
  // logic to check authentication
  const token = "xyz";
  const isAdminAuthorzed = token === "xyz";
  if (isAdminAuthorzed) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});
```

put the above middleware before the routes that need authentication

We can also make a folder named middleware and add all functions inside it.

```javascript
const adminAuth = (req, res, next) => {
  // logic to check authentication
  const token = "xyz";
  const isAdminAuthorzed = token === "xyz";
  if (isAdminAuthorzed) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = { adminAuth };
```

Use the above function inside app.js now

```javascript
// every route starting with /admin will be checkd by this middleware first.
app.use("/admin", adminAuth);

app.get("/admin/getAllData",(req,res)=>{
  res.send("All data sent");
});
app.get("/admin/deleteData",(req,res)=>{
  res.send("Data deleted");
});
```
## Error Handling

Two broad ways to handle errors in Express applications:
1. Using try-catch blocks **(preferred)**
2. Using err parameter in middleware functions (first parameter among the four parameters) **(Use this at the very end)**

```javascript
app.use('/getUserData',(req,res)=>{
  // try{
    // DB call
    throw new Error("Something went wrong");
    res.send("User data sent");
  // }
  // catch(err){
  //   res.status(500).send("Something went wrong");
  // }
})

app.use("/",(err,req,res,next)=>{
  if(err){
    res.status(500).send("Something went wrong");
  }
})
```
Always use the above wildcard route at the end of all routes to handle errors as it will take care of all the errors that are not handled by the other routes.


## Server

The server listens on port 7777.

```javascript
app.listen(7777, () => {
  console.log("Server is running on port 7777");
});
```
## Databse, Models and Schema

Go to Monggose documentation.
- Create a user schema
- Make a model and export it
- Create an API and create an instance of the model using data coming in request
- save it to Database using async await
- handle error using try catch block

## Notes

- The order of the routes is important. If the `/` route is placed at the top, it will always be executed, so it should be placed at the end.
- By default, requests to any route are GET requests unless specified otherwise.
- Middlewares are nothing but all the functions that are executed between the request and response. Middlewares are executed in the order they are defined in the application.
- First establish the database connection, then only listen to the requests on the port.