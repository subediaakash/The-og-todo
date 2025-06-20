import TodoWorkspaceManager from "@/components/todos/todo-workspace-manager";
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
      <TodoWorkspaceManager userId={user.id} />
    </div>
  );
}
