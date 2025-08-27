"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm, useWatch } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Button from "../../../Components/Button";
import Input from "@/app/Components/inputs/inputs";

interface CommentFormProps {
  ticketId: string;
  currentUser: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

const CommentForm = ({ ticketId, currentUser }: CommentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      content: "",
    },
  });

  // Watch the content field
  const content = useWatch({
    control,
    name: "content",
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!currentUser) {
      toast.error("You must be logged in to comment");
      return;
    }

    setIsLoading(true);

    axios
      .post(`/api/tickets/${ticketId}/comments`, {
        ...data,
        userId: currentUser.id,
      })
      .then(() => {
        toast.success("Comment added");
        reset();
        router.refresh();
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Failed to add comment");
      })
      .finally(() => setIsLoading(false));
  };

  // Check if content is empty or only contains whitespace
  const isContentEmpty = !content || content.trim() === "";

  return (
    <div className="mt-6">
      <div className="space-y-4">
        <Input
          id="content"
          label="Add comment"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <Button
          label={isLoading ? "Loading" : "Submit Comment"}
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || isContentEmpty}
        />
      </div>
    </div>
  );
};

export default CommentForm;
