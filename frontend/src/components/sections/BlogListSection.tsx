import React from "react";
import { Plus, Trash } from "lucide-react";

export function BlogListSection({
  section,
  isSelected,
  isEditing,
  onContentChange,
}) {
  const { content, styles } = section;

  const updatePost = (id, field, value) => {
    const posts = content.posts.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    onContentChange("posts", posts);
  };

  const addPost = () => {
    const newPost = {
      id: Date.now().toString(),
      imageUrl: "",
      title: "New Post",
      excerpt: "Summary here",
      author: "Author",
      date: "Today",
    };
    onContentChange("posts", [...content.posts, newPost]);
  };

  const removePost = (id) => {
    onContentChange(
      "posts",
      content.posts.filter((p) => p.id !== id)
    );
  };

  const editImage = (id) => {
    const url = window.prompt(
      "Enter image URL",
      content.posts.find((p) => p.id === id).imageUrl || ""
    );
    if (url !== null) updatePost(id, "imageUrl", url);
  };

  return (
    <section
      className={`${isSelected ? "ring-2 ring-primary" : ""} py-12`}
      style={{ background: styles.backgroundColor, padding: styles.padding }}
    >
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-3xl font-bold"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) =>
              onContentChange("headline", e.currentTarget.textContent || "")
            }
          >
            {content.headline}
          </h2>
          <p
            className="text-muted-foreground mb-6"
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) =>
              onContentChange("subheadline", e.currentTarget.textContent || "")
            }
          >
            {content.subheadline}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {content.posts.map((post) => (
              <article
                key={post.id}
                className="rounded-lg overflow-hidden shadow-sm bg-white"
              >
                <div className="relative h-48 bg-gray-50">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {isEditing && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => editImage(post.id)}
                        className="bg-primary text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removePost(post.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3
                    className="font-semibold"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updatePost(
                        post.id,
                        "title",
                        e.currentTarget.textContent || ""
                      )
                    }
                  >
                    {post.title}
                  </h3>
                  <p
                    className="text-sm text-muted-foreground"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updatePost(
                        post.id,
                        "excerpt",
                        e.currentTarget.textContent || ""
                      )
                    }
                  >
                    {post.excerpt}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    By{" "}
                    <span
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        updatePost(
                          post.id,
                          "author",
                          e.currentTarget.textContent || ""
                        )
                      }
                    >
                      {post.author}
                    </span>{" "}
                    •{" "}
                    <span
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        updatePost(
                          post.id,
                          "date",
                          e.currentTarget.textContent || ""
                        )
                      }
                    >
                      {post.date}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {isEditing && (
            <div className="mt-6">
              <button
                onClick={addPost}
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-primary text-white"
              >
                <Plus className="w-4 h-4" />
                Add Post
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
