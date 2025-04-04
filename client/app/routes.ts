import { type RouteConfig, index } from "@react-router/dev/routes";
import Home from "../routes/";
import Login from "./login.tsx";
import Signup from "./signup.tsx";

export default [
  index("routes/home.tsx"),
  { path: "/login", Login },
  { path: "/signup", Signup },
] satisfies RouteConfig;
