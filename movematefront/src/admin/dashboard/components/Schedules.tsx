import useService from "@/api/Services";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { scheduleType } from "@/utils/types";
import { DialogClose } from "@radix-ui/react-dialog";
import useAuthStore from "@/store/AuthStore";
import { jwtDecode } from "jwt-decode";

export type Schedule = {
  provider_id: number;
  date: Date;
  availability: boolean;
  on_schedule: boolean;
  id: number;
};

const columns: ColumnDef<Schedule>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="font-semibold">
        {new Date(row.getValue("date")).toLocaleDateString()}
      </div>
    ),
  },
  {
    accessorKey: "availability",
    header: "Available",
    cell: ({ row }) => (
      <div className="font-semibold">
        <Badge
          className={
            row.getValue("availability") === true
              ? "bg-green-500"
              : "bg-orange-600"
          }
        >
          {row.getValue("availability")}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "on_schedule",
    header: "On Schedule",
    cell: ({ row }) => (
      <div className="font-semibold">
        <Badge
          className={
            row.getValue("on_schedule") === true
              ? "bg-blue-500"
              : "bg-purple-600"
          }
        >
          {row.getValue("on_schedule")}
        </Badge>
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const schedule = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => console.log(schedule.id)}>
              <i className="fa-solid fa-trash-can text-red-600 cursor-pointer"></i>
              Clear schedule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log(schedule.id)}>
              View schedule
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Schedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isLoading, setIsLoading] = useState(false);

  const service = new useService();

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await service.fetchSchedules();
      setSchedules(response);
    } catch (error) {
      console.error("Error fetching schedules", error);
      toast({
        title: "Error",
        description: "Failed to fetch schedules",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const table = useReactTable({
    data: schedules,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // Logic for schedule creation

  const getUserId = () => {
    if (localStorage.length) {
      const token = localStorage.getItem("access") || "";
      const formattedToken = jwtDecode(token);
      return formattedToken.sub;
    }
  };
  const userId = getUserId();
  console.log(userId);

  const defaultSchedule = {
    date: "",
    availability: true,
    on_schedule: false,
    provider_id: userId,
  };

  const [schedulePayload, setSchedulePayload] = useState<scheduleType | any>(
    defaultSchedule
  );
  const handleCreateSchedule = async () => {
    const formattedPayload = {
      ...schedulePayload,
      date: new Date(schedulePayload.date),
    };

    await service
      .createSchedule(formattedPayload)
      .then((response) => {
        console.log("SCHEDULE CREATION RESPONSE ___ ", response.data);
        toast({
          title: "Success",

          description: (
            <span className="flex items-center justify-start gap-2">
              <i className="fa-solid fa-check text-green-600"></i>
              <p>Schedule created succesfully</p>
            </span>
          ),
        });
        setSchedulePayload(defaultSchedule);
        fetchSchedules();
      })
      .catch((error) => {
        console.error("ERROR CREATING SCHEDULE ____ ", error);
        toast({
          title: "Error",
          variant: "destructive",
          description: (
            <span className="flex items-center justify-start gap-2">
              <p>Error creating schedule, please try again..</p>
            </span>
          ),
        });
      });
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <span className="flex  items-center gap-4 justify-between w-full">
          <p className="text-lg font-bold">Schedules</p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"> Create Service</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Schedule</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-start flex-col gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="col-span-3"
                    value={schedulePayload.date}
                    onChange={(e) =>
                      setSchedulePayload((prev: any) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="w-full flex items-center justify-between gap-4">
                  <div className="flex  items-start gap-4">
                    <input
                      id="availability"
                      type="checkbox"
                      className="col-span-3"
                      value={schedulePayload.availability}
                      onChange={(e) =>
                        setSchedulePayload((prev: any) => ({
                          ...prev,
                          availability: e.target.checked,
                        }))
                      }
                    />

                    <Label htmlFor="availability" className="text-right">
                      Available
                    </Label>
                  </div>

                  <div className="flex items-start gap-4">
                    <input
                      id="on_schedule"
                      type="checkbox"
                      className="col-span-3"
                      value={schedulePayload.on_schedule}
                      onChange={(e) =>
                        setSchedulePayload((prev: any) => ({
                          ...prev,
                          on_schedule: e.target.checked,
                        }))
                      }
                    />
                    <Label htmlFor="on_schedule" className="text-right">
                      On Schedule
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <div className=" w-full flex items-center justify-between ">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    onClick={() => handleCreateSchedule()}
                    disabled={!schedulePayload.date}
                  >
                    Create
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </span>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{" "}
          {table.getRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
