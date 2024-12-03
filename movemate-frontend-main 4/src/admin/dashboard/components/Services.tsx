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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { serviceType } from "@/utils/types";
import { DialogClose } from "@radix-ui/react-dialog";

export type MoveService = {
  id: number;
  name: string;
};

const columns: ColumnDef<MoveService>[] = [
  {
    accessorKey: "name",
    header: "Service",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const service = row.original;
      return (
        <div className="flex items-center justify-around gap-4 ">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="text-sm"
                onClick={() => console.log(service.id)}
              >
                <i className="fa-regular fa-rectangle-list"></i>
                View reviews
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[80%]">
              <DialogHeader>
                <DialogTitle>Reviews</DialogTitle>
                <DialogDescription>
                  These are the reviews for : <b>mover new</b>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-start gap-2 justify-between">
                  <Avatar>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="flex items-center justify-start gap-2">
                      <p className="font-semibold">Rating:</p>
                      <p>4</p>
                    </span>
                    <span className="font-light text-sm">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];

const MoveServices = () => {
  const [moveServices, setMoveServices] = useState<MoveService[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterService, setFilterService] = useState("");
  const [open, setOpen] = useState(false);

  const service = new useService();

  const fetchMoveServices = async () => {
    setIsLoading(true);
    try {
      const response = await service.fetchMoveServices();
      setMoveServices(response);
    } catch (error) {
      console.error("Error fetching moveServices", error);
      toast({
        title: "Error",
        description: "Failed to fetch sizes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoveServices();
  }, []);

  const table = useReactTable({
    data: moveServices,
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

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterService(e.target.value);
    setColumnFilters((prevFilters) => [
      {
        id: "name",
        value: e.target.value,
      },
    ]);
  };

  // Logic for service creation
  // Function to close the dialog
  const closeDialog = () => setOpen(false);
  const defaultService = { name: "" };
  const [servicePayload, setServicePayload] =
    useState<serviceType>(defaultService);
  const handleCreateService = async () => {
    await service
      .createService(servicePayload)
      .then((response) => {
        console.log("SERVICE CREATION RESPONSE ___ ", response.data);
        toast({
          title: "Success",

          description: (
            <span className="flex items-center justify-start gap-2">
              <i className="fa-solid fa-check text-green-600"></i>
              <p>Service created succesfully</p>
            </span>
          ),
        });
        setServicePayload(defaultService);
        fetchMoveServices();
        closeDialog();
      })
      .catch((error) => {
        console.error("ERROR CREATING SERVICE ____ ", error);
        toast({
          title: "Error",
          variant: "destructive",
          description: (
            <span className="flex items-center justify-start gap-2">
              <p>Error creating service, please try again..</p>
            </span>
          ),
        });
      });
  };

  return (
    <div className="w-full">
      <div className="flex items-end py-4 w-full justify-between">
        <span className="flex flex-col items-start gap-2 justify-start">
          <p className="text-lg font-bold">Services</p>
          <Input
            placeholder="Search..."
            value={filterService}
            onChange={handleFilterChange}
            className="max-w-sm"
          />
        </span>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"> Create Service</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-start flex-col gap-4">
                <Label htmlFor="service_name" className="text-right">
                  Service Name
                </Label>
                <Input
                  id="service_name"
                  type="text"
                  className="col-span-3"
                  value={servicePayload.name}
                  onChange={(e) =>
                    setServicePayload(() => ({
                      name: e.target.value,
                    }))
                  }
                />
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
                  onClick={() => handleCreateService()}
                  disabled={!servicePayload.name}
                >
                  Create
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

export default MoveServices;
