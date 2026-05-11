"use client";
export function DeleteButton() {
  return (
    <button
      type="submit"
      className="text-red-600 hover:underline"
      onClick={(e) => {
        if (!confirm("Are you sure?")) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
