import express from "express";
import users from "../controllers/users";

const usersRoute = express.Router();

usersRoute.get("/users", users);

export default usersRoute;
