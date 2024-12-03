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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { serviceType } from "@/utils/types";
import { Label } from "@/components/ui/label";

export type Move = {
  id: number;
  name: string;
};

const columns: ColumnDef<Move>[] = [
  {
    accessorKey: "name",
    header: "Move size",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const move = row.original;
      return (
        <div className="flex gap-2">
          <i className="fa-solid fa-trash-can text-red-600 cursor-pointer"></i>
          Remove
        </div>
      );
    },
  },
];

const Moves = () => {
  const [moves, setMoves] = useState<Move[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDestination, setFilterDestination] = useState("");

  const service = new useService();

  const fetchMoves = async () => {
    setIsLoading(true);
    try {
      const response = await service.fetchMoveSizes();
      setMoves(response);
    } catch (error) {
      console.error("Error fetching move sizes", error);
      toast({
        title: "Error",
        description: "Failed to fetch moves",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoves();
  }, []);

  const table = useReactTable({
    data: moves,
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
    setFilterDestination(e.target.value);
    setColumnFilters((prevFilters) => [
      {
        id: "destination",
        value: e.target.value,
      },
    ]);
  };

  // Function to close the dialog
  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);
  const defaultService = { name: "" };
  const [servicePayload, setServicePayload] =
    useState<serviceType>(defaultService);
  const handleCreateSize = async () => {
    await service
      .createMoveSize(servicePayload)
      .then((response) => {
        console.log("SIZE CREATION RESPONSE ___ ", response.data);
        toast({
          title: "Success",

          description: (
            <span className="flex items-center justify-start gap-2">
              <i className="fa-solid fa-check text-green-600"></i>
              <p>Size created succesfully</p>
            </span>
          ),
        });
        setServicePayload(defaultService);
        fetchMoves();
        closeDialog();
      })
      .catch((error) => {
        console.error("ERROR CREATING SIZE ____ ", error);
        toast({
          title: "Error",
          variant: "destructive",
          description: (
            <span className="flex items-center justify-start gap-2">
              <p>Error creating size, please try again..</p>
            </span>
          ),
        });
      });
  };

  return (
    <div className="w-full">
      <div className="flex items-end py-4 w-full justify-between">
        <span className="flex flex-col items-start gap-2 justify-start">
          <p className="text-lg font-bold">Move Sizes</p>
          <Input
            placeholder="Search destination..."
            value={filterDestination}
            onChange={handleFilterChange}
            className="max-w-sm"
          />
        </span>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"> Add Size</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Size</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-start flex-col gap-4">
                <Label htmlFor="service_name" className="text-right">
                  Name
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
                  onClick={() => handleCreateSize()}
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

export default Moves;
