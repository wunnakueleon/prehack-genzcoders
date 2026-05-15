import { useEffect, useState } from "react";
import api from "./api";

type User = { id: string; username: string; email: string };
type Message = {
  id: string;
  content: string;
  sender: { username: string };
  receiver: { username: string };
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.get<User[]>("/users"), api.get<Message[]>("/messages")])
      .then(([u, m]) => {
        setUsers(u.data);
        setMessages(m.data);
      })
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6 space-y-8 font-mono">
      <h1 className="text-2xl font-bold">Cipherline — Skeleton Test</h1>

      <section>
        <h2 className="text-lg font-semibold mb-2">Users</h2>
        <ul className="space-y-1">
          {users.map((u) => (
            <li key={u.id} className="text-sm">
              <span className="font-medium">{u.username}</span> — {u.email}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Messages</h2>
        <ul className="space-y-1">
          {messages.map((m) => (
            <li key={m.id} className="text-sm">
              <span className="font-medium">{m.sender.username}</span> →{" "}
              <span className="font-medium">{m.receiver.username}</span>:{" "}
              {m.content}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
