import type { Route } from "./+types/home";
import { Main } from "../home/main";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat!" },
    { name: "description", content: "Welcome to my Chat App!" },
  ];
}

export default function Home() {
  return <Main />;
}
