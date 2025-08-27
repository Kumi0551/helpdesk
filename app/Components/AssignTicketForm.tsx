"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import SelectField from "@/app/Components/SelectField";
import Button from "@/app/Components/Button";
import { FieldValues, useForm } from "react-hook-form";

interface AssignTicketFormProps {
  ticketId: string;
  currentUserDepartmentId: string;
  canAssignTicket: boolean;
}

const AssignTicketForm: React.FC<AssignTicketFormProps> = ({
  ticketId,
  currentUserDepartmentId,
  canAssignTicket,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<
    {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    }[]
  >([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const {
    register,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: { assignedTo: "" },
  });

  const assignedTo = watch("assignedTo");

  useEffect(() => {
    if (canAssignTicket) {
      setUsersLoading(true);
      axios
        .get(
          `/api/users/department-users?departmentId=${currentUserDepartmentId}`
        )
        .then((response) => setUsers(response.data))
        .catch(() => toast.error("Failed to fetch department users"))
        .finally(() => setUsersLoading(false));
    }
  }, [canAssignTicket, currentUserDepartmentId]);

  const handleAssign = () => {
    if (!assignedTo) {
      toast.error("Please select a user");
      return;
    }

    setLoading(true);
    axios
      .post(`/api/tickets/${ticketId}/assign`, { assignedToId: assignedTo })
      .then(() => {
        toast.success("Ticket assigned successfully!");
        router.refresh();
      })
      .catch(() => toast.error("Failed to assign ticket"))
      .finally(() => setLoading(false));
  };

  const userOptions = users.map((user) => ({
    id: user.id,
    name: `${user.name} (${user.email})`,
  }));

  if (!canAssignTicket) {
    return null;
  }

  return (
    <div className="py-4 border-b border-gray-200">
      <p className="text-sm font-medium text-gray-00 mb-2">Assign Ticket</p>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <SelectField
          id="assignedTo"
          label="Assign to department user"
          register={register}
          errors={errors}
          options={userOptions}
          isLoading={usersLoading}
          disabled={usersLoading || loading}
          required
        />
        <Button
          label="Assign Ticket"
          onClick={handleAssign}
          disabled={loading || !assignedTo || usersLoading}
        />
      </div>
    </div>
  );
};

export default AssignTicketForm;
