import sanitize from "sanitize-html";

export function sanitizeHTML(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "a",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "blockquote",
      "code",
      "pre",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height", "loading"], 
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "data"],
    disallowedTagsMode: "discard",
  });
}
