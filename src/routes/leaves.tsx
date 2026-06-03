import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { leaveStorage, studentStorage, classStorage } from "@/lib/storage";
import { formatDateString } from "@/lib/helpers";
import type { Leave } from "@/lib/types";

export const Route = createFileRoute("/leaves")({
  component: LeaveManagementPage,
});

function LeaveManagementPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = () => {
    let allLeaves = leaveStorage.getAll();
    allLeaves.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
    setLeaves(allLeaves);
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (filter === "all") return true;
    return leave.status === filter;
  });

  const getStudentName = (studentId: string) => {
    const student = studentStorage.getById(studentId);
    return student?.name || "Unknown";
  };

  const getClassName = (classId: string) => {
    const classData = classStorage.getById(classId);
    return classData?.name || "Unknown";
  };

  const handleApprove = (id: string) => {
    leaveStorage.update(id, {
      status: "approved",
      approvedAt: new Date().toISOString(),
      approvedBy: "Admin",
    });
    loadLeaves();
  };

  const handleReject = (id: string) => {
    leaveStorage.update(id, {
      status: "rejected",
      approvedAt: new Date().toISOString(),
      approvedBy: "Admin",
    });
    loadLeaves();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-600">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "pending").length,
    approved: leaves.filter((l) => l.status === "approved").length,
    rejected: leaves.filter((l) => l.status === "rejected").length,
  };

  return (
    <div className="flex-1 overflow-auto">
      <PageHeader
        title="Leave Management"
        description="Manage student leave requests and approvals."
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaves Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>Showing {filteredLeaves.length} requests</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLeaves.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No leave requests found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>From Date</TableHead>
                      <TableHead>To Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-medium">
                          {getStudentName(leave.studentId)}
                        </TableCell>
                        <TableCell>{getClassName(leave.classId)}</TableCell>
                        <TableCell>{formatDateString(leave.startDate)}</TableCell>
                        <TableCell>{formatDateString(leave.endDate)}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>{getStatusBadge(leave.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {leave.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApprove(leave.id)}
                                  className="text-green-600"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(leave.id)}
                                  className="text-red-600"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
