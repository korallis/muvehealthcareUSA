"use client";

export function ResourceTable({
  items,
  onEdit,
}: {
  items: { id: string; title: string; slug: string }[];
  onEdit: (slug: string) => void;
}) {
  return (
    <table className="w-full bg-white border">
      <thead>
        <tr className="border-b">
          <th className="p-3 text-left">Title</th>
          <th className="p-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className="border-b">
            <td className="p-3">{item.title}</td>
            <td className="p-3 text-right">
              <button onClick={() => onEdit(item.slug)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
