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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import useAuthStore from "@/store/AuthStore";
import axios from "axios";
import { base_URL } from "@/api/Api";

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

export type Quote = {
  origin: {
    name: string;
    has_stairs: boolean;
  };
  destination: {
    name: string;
    has_stairs: boolean;
  };
  move_type_id: string;
  move_size_id: string;
  move_date: Date;
  id: number;
  estimate: any;
  status: string;
};

const Quotes = () => {
  const setEstimate = async (payload: any) => {
    console.log(payload);

    await service
      .setEstimate(payload)
      .then((response) => {
        console.log(response);
        closeDialog();
      })
      .catch((error) => {
        console.error("Error setting estimate ___ : ", error);
      });
  };

  const [quote_estimate, setQuoteEstimate] = useState("");
  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = () => {
    if (inputRef.current) {
      console.log(inputRef.current.value); // Access input value without re-render
    }
  };

  const columns: ColumnDef<Quote>[] = [
    {
      accessorKey: "origin",
      header: "Origin",
      cell: (row: any) => (
        <div className="capitalize flex flex-col gap-2">
          <p>{row.getValue("origin").name}</p>
          {row.getValue("destination").has_stairs ? (
            <Badge className="bg-blue-600">stairs</Badge>
          ) : (
            <Badge className="bg-red-400">No stairs</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "destination",
      header: "Destination",
      cell: (row: any) => (
        <div className="font-semibold flex flex-col gap-2">
          <p>{row.getValue("destination").name}</p>
          {row.getValue("destination").has_stairs ? (
            <Badge className="bg-blue-500">stairs</Badge>
          ) : (
            <Badge className="bg-red-400">No stairs</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "move_type_id",
      header: "Move type",
      cell: ({ row }) => (
        <div className="underline">{row.getValue("move_type_id")}</div>
      ),
    },
    {
      accessorKey: "move_size_id",
      header: "Move size",
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("move_size_id")}</div>
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
      accessorKey: "estimate",
      header: "Estimate",
      cell: ({ row }) => (
        <div>{row.getValue("estimate") ? row.getValue("estimate") : "N-A"}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="underline font-bold">
          {row.getValue("estimate") ? (
            <Badge className="bg-green-500">Replied</Badge>
          ) : (
            <Badge className="bg-orange-600">Pending</Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Estimate",
      cell: ({ row }) => {
        const quote = row.original;
        return (
          <div className="flex items-center justify-around gap-4 ">
            {row.getValue("estimate") ? (
              <p className="font-bold underline underline-offset-2">$ {row.getValue("estimate")}</p>
            ) : (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    className="text-sm"
                    disabled={quote.estimate ? true : false}
                  >
                    Set estimate
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Estimate</h4>
                      <p className="text-sm text-muted-foreground">
                        Do the calculations before adding an estimate
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="flex flex-col items-start gap-4">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          className="col-span-2 h-8"
                          ref={inputRef}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <Button
                      className="bg-blue-500"
                      onClick={() => {
                        const formatPayload = {
                          id: quote.id,
                          estimate: inputRef.current?.value,
                        };
                        setEstimate(formatPayload);
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            {/* <i
              className="fa-solid fa-trash-can text-red-600 cursor-not-allowed"
              onClick={() => console.log(quote.id)}
            ></i> */}
          </div>
        );
      },
    },
  ];

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDestination, setFilterDestination] = useState<string>("");

  const service = new useService();
  const { services, sizes } = useAuthStore();
  console.log(services);

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await service.fetchAdminQuotes();

      const formattedResponse = response.map((quote: any) => {
        const move_size: any = sizes.find(
          (res: any) => res.id === quote.move_size_id
        );

        const move_type: any = services.find(
          (res: any) => res.id === quote.move_type_id
        );

        return {
          ...quote,

          move_size_id: move_size ? move_size.name : quote.move_size_id,
          move_type_id: move_type ? move_type.name : quote.move_type_id,
        };
      });

      console.log(formattedResponse);
      setQuotes(formattedResponse);
    } catch (error) {
      console.error("Error fetching quotes", error);
      toast({
        title: "Error",
        description: "Failed to fetch quotes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const table = useReactTable({
    data: quotes,
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
          <p className="text-lg font-bold">Quotes</p>
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

export default Quotes;
