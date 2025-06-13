import { Form } from "../ui/form";
function TodoWorkSpace() {
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return (
    <div>
      <div>
        <p>Date : {formattedDate}</p>
        <input></input>
      </div>
    </div>
  );
}
