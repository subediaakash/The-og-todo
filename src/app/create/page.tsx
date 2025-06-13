import TodoWorkSpace from "@/components/todos/main-todo";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function CreateTodosPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return <div>Not authenticated</div>;
  }

  const user = session.user;

  return (
    <div className="">
      <TodoWorkSpace userId={user.id} selectedDate={new Date().toISOString()} />
    </div>
  );
}
