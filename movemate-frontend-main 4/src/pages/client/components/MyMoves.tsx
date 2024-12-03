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

export type Move = {
  origin: string;
  destination: string;
  move_type: string;
  move_size: string;
  move_date: Date;
  id: number;

  status: string;

  service_id: number;
};

const columns: ColumnDef<Move>[] = [
  {
    accessorKey: "origin",
    header: "Origin",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("origin")}</div>
    ),
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue("destination")}</div>
    ),
  },
  {
    accessorKey: "move_type",
    header: "Move type",
    cell: ({ row }) => (
      <div className="underline">{row.getValue("move_type")}</div>
    ),
  },
  {
    accessorKey: "move_size",
    header: "Move size",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("move_size")}</div>
    ),
  },

  {
    accessorKey: "move_date",
    header: "Move date",
    cell: ({ row }) => (
      <div className="font-semibold">
        {new Date(row.getValue("move_date")).toLocaleDateString()}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="underline font-bold">{row.getValue("status")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const move = row.original;
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
            <DropdownMenuItem onClick={() => console.log(move.id)}>
              <i className="fa-solid fa-trash-can text-red-600 cursor-pointer"></i>
              Remove move
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => console.log(move.service_id)}>
              View Service
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      const response = await service.fetchMoves();
      setMoves(response);
    } catch (error) {
      console.error("Error fetching moves", error);
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <span className="flex flex-col items-start gap-2 justify-start">
          <p className="text-lg font-bold">Moves</p>
          <Input
            placeholder="Search destination..."
            value={filterDestination}
            onChange={handleFilterChange}
            className="max-w-sm"
          />
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

export default Moves;
