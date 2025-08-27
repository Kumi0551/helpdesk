import React from "react";
import { format } from "date-fns";
import UserAvatar from "@/app/Components/UserAvatar";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  return (
    <div className="py-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Comments</h2>
      {comments.length > 0 ? (
        <div className="mt-6 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-2">
                <UserAvatar src={comment.createdBy.image} />
                <div>
                  <p className="font-medium text-gray-900">
                    {comment.createdBy.name || comment.createdBy.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(comment.createdAt), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-gray-700 whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

export default CommentsSection;
