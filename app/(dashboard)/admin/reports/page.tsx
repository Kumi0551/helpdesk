// app/reports/page.tsx
import { getAllDepartments } from "@/actions/getAllDepartments";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { getDepartmentUsers } from "@/actions/getDepartmentUsers";
import { getReportData } from "@/actions/getReportData";
import Container from "@/app/Components/Container";
import EmptyState from "@/app/Components/EmptyState";
import ReportFilters from "@/app/Components/filters/ReportFilters";
import ReportResults from "@/app/Components/filters/ReportResults";
import { FilterPriority, FilterStatus } from "@/types";

const ReportPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    type?: "user" | "department" | "overview";
    department?: string;
    user?: string;
    status?: string;
    priority?: string;
    start?: string;
    end?: string;
  }>;
}) => {
  const resolvedSearchParams = await searchParams;
  const currentUser = await getCurrentUser();
  const departments = await getAllDepartments();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="You don't have permission to view reports"
      />
    );
  }

  // Get users if department is selected in resolvedSearchParams
  if (resolvedSearchParams.department) {
    await getDepartmentUsers(resolvedSearchParams.department);
  }

  const reportData = await getReportData({
    reportType: resolvedSearchParams.type || "overview",
    departmentId: resolvedSearchParams.department,
    userId: resolvedSearchParams.user,
    status: (resolvedSearchParams.status as FilterStatus) || "all",
    priority: (resolvedSearchParams.priority as FilterPriority) || "all",
    startDate: resolvedSearchParams.start
      ? new Date(resolvedSearchParams.start)
      : undefined,
    endDate: resolvedSearchParams.end
      ? new Date(resolvedSearchParams.end)
      : undefined,
  });

  return (
    <Container>
      <div className="w-full overflow-hidden relative">
        <ReportFilters
          currentUser={{
            ...currentUser,
            departmentId: currentUser.departmentId ?? undefined,
          }}
          departments={departments}
          initialParams={resolvedSearchParams}
        />
        <div className="w-full overflow-x-auto">
          <ReportResults
            reportData={reportData}
            reportType={resolvedSearchParams.type || "overview"}
          />
        </div>
      </div>
    </Container>
  );
};
export default ReportPage;
