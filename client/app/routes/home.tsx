import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat!" },
    { name: "description", content: "Welcome to my Chat App!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
